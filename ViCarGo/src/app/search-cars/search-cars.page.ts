import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {Address} from "ngx-google-places-autocomplete/objects/address";
import {AngularFirestore, QueryDocumentSnapshot} from "@angular/fire/compat/firestore";
import {AuthService} from "../services/auth.service";
import {CarService} from "../services/car.service";
import {ModalController} from "@ionic/angular";
import {FilterModalComponent} from "../sub-components/filter-modal/filter-modal.component";
import {GeolocationService} from "../services/geolocation.service";
import {CarModel} from "../models/carModel";
import {ActivatedRoute} from "@angular/router";
import {FilterCarModel} from "../models/filterCarModel";
import {CarDetailsModalComponent} from "../sub-components/car-details-modal/car-details-modal.component";
import {ReservationService} from "../services/reservation.service";
import {ReservationModel} from "../models/reservationModel";


@Component({
  selector: 'app-search-cars',
  templateUrl: './search-cars.page.html',
  styleUrls: ['./search-cars.page.scss'],
})
export class SearchCarsPage implements OnInit {
  options: any = {
    componentRestrictions: { country: 'RO' }
  }
  @ViewChild('locationInput', { static: false }) locationInput: ElementRef<HTMLInputElement>;

  // @Input()
  // userModel: UserModel;

  searchRange: any;
  userId: string;
  carModels: any[] = [];
  filteredCars: any[] = [];
  searchByBrand: string;
  searchByUserLocation;
  radiusDistance: number = 5;
  inputLocationLatitude: number;
  inputLocationLongitude: number;
  favoriteCarsById: string[] = [];
  filterModel: FilterCarModel;
  isLoading: boolean = true;

  constructor(private firebase: AngularFirestore,
              private authService: AuthService,
              private carService: CarService,
              private modalController: ModalController,
              private locationService: GeolocationService,
              private reservationService: ReservationService,
              private route: ActivatedRoute) { }

  ngOnInit() {
    // console.log("why")
    // this.getFavoriteCarsForUser();
    this.filterModel = {
      selectedBrand: "Any",
      selectedTransmission: "Any",
      minPrice: 10,
      maxPrice: 200,
      selectedRadius: this.radiusDistance,
      newerThan: "Any",
      startDate: null,
      endDate: null
    };
    // this.inputLocationLongitude = 22.9072331;
    // this.inputLocationLatitude = 45.7678128;
    this.authService.getCurrentUserId().then(userId => {
      this.userId = userId;
      this.locationService.getCurrentLocation().then(result => {
        this.inputLocationLongitude = result.coords.longitude;
        this.inputLocationLatitude = result.coords.latitude;
        this.searchRange = this.locationService.getGeoHashRange(this.inputLocationLongitude, this.inputLocationLatitude, this.radiusDistance);
        this.getQueryParameters();
      })
        .catch(() => {
          this.inputLocationLongitude = 22.9072331;
          this.inputLocationLatitude = 45.7678128;
          this.searchRange = this.locationService.getGeoHashRange(this.inputLocationLongitude, this.inputLocationLatitude, this.radiusDistance);
          this.getQueryParameters();
        })
    })

    // this.searchRange = this.locationService.getGeoHashRange(22.9072331, 45.7678128, this.radiusDistance);
    // this.getQueryParameters();
    // this.populateWithCars();
  }

  // ionViewDidEnter() {
  //   const locationInput: HTMLInputElement = this.locationInput.nativeElement;
  //   locationInput.focus();
  // }

  // setLocation() {
  //   this.searchRange = this.locationService.getGeoHashRange(22.9072331, 45.7678128, this.radiusDistance);
  //
  // }

  getQueryParameters() {
    this.route.queryParams.subscribe(params => {
      // Unpack the parameters here
      if(params['brand']) {
        this.filterModel.selectedBrand = params['brand'];
        this.populateWithCars();
      } else if(params['userLocation']) {
        this.populateWithCars();
      } else {
        this.isLoading = false;
        setTimeout(() => {
          this.locationInput.nativeElement.focus();
        }, 0);
      }
    });
  }

  handleAddressChange(address: Address) {
    // this.locationLatitude = address.geometry.location.lat();
    // this.locationLongitude = address.geometry.location.lng();
    // this.carForm.get('locationAddress').setValue(address.formatted_address);
    this.inputLocationLatitude = address.geometry.location.lat();
    this.inputLocationLongitude = address.geometry.location.lng();
    this.searchRange = this.locationService.getGeoHashRange(this.inputLocationLongitude, this.inputLocationLatitude, this.radiusDistance);
    this.populateWithCars();
    console.log(address);
  }

  populateWithCars() {
    // this.carService.getFavoriteCars(this.userId).subscribe()
    this.isLoading = true;
    this.carService.getCarsBasedOnLocation(this.searchRange.lower, this.searchRange.upper, this.userId).subscribe(cars => {
      // this.carModels = cars;
      this.carService.getFavoriteCars(this.userId)
        .subscribe((querySnapshot) => {
          querySnapshot.forEach((doc) => {
            this.favoriteCarsById.push(doc.id);
          })
          console.log(this.carModels);
          this.carModels = this.getDistancesAndPerformMoreExactSort(cars, this.radiusDistance);
          console.log(this.carModels);
          this.applyFilters();
        })
    })
  }

  getDistancesAndPerformMoreExactSort(cars: CarModel[], radius: number) {
    // const sortedCars = carsWithDistance.sort((a, b) => a.distance - b.distance);
    console.log("sort the cars");
    return cars
      .filter(car => car.ownerId != this.userId)
      .map(car => {

        const distance = this.locationService.calculateDistance(
          this.inputLocationLatitude,
          this.inputLocationLongitude,
          car.locationLatitude,
          car.locationLongitude
        );

        const isFavorite = this.favoriteCarsById.includes(car.id);

        return {...car, distance, isFavorite};
      })
      .filter(car => car.distance <= radius);
  }

  async openFilterModal() {
    const modal = await this.modalController.create({
      component: FilterModalComponent,
      componentProps: {
        filterModel: this.filterModel,
      },
    });

    modal.onDidDismiss().then((result) => {
      console.log(result);
      if(result.role == 'response') {
        this.filterModel = result.data.data;
        console.log(this.filterModel)
        if(this.filterModel.selectedRadius != this.radiusDistance) {
          this.radiusDistance = this.filterModel.selectedRadius;
          this.populateWithCars()
        } else {
          this.applyFilters();
        }
      }
    });

    return await modal.present();
  }

  async applyFilters() {
    // Apply the filters based on user selections
    let reservationsInInterval = [];

    if (this.filterModel.startDate && this.filterModel.endDate) {
      reservationsInInterval = await this.reservationService.getAcceptedReservationsBetweenIntervalByCarId(this.filterModel.startDate, this.filterModel.endDate);
      console.log(reservationsInInterval);
    }

    this.filteredCars = this.carModels.filter((car) => {

      if (reservationsInInterval && reservationsInInterval.includes(car.id)) {
        return false;
      }

      // Filter by brand
      if (this.filterModel.selectedBrand && this.filterModel.selectedBrand != "Any" && car.brand !== this.filterModel.selectedBrand) {
        return false;
      }

      // Filter by transmission
      if (this.filterModel.selectedTransmission && this.filterModel.selectedTransmission != "Any" && car.transmission !== this.filterModel.selectedTransmission) {
        return false;
      }

      // Filter by price range
      if (this.filterModel.minPrice != 10 && car.price < this.filterModel.minPrice) {
        return false;
      }

      if (this.filterModel.maxPrice != 200 && car.price > this.filterModel.maxPrice) {
        return false;
      }

      if (this.filterModel.newerThan && this.filterModel.newerThan != "Any" && car.year < parseInt(this.filterModel.newerThan)) {
        return false;
      }

      return true; // Car passes all filters
    });
    this.isLoading = false;
  }

  // async applyDateIntervalFilter() {
  //   return reservations = await this.reservationService.getAcceptedReservationsBetweenInterval(this.filterModel.startDate, this.filterModel.endDate);
  //   console.log(reservations);
  //
  // }

  getFavoriteCarsForUser() {
    this.carService.getFavoriteCars(this.userId)
      .subscribe((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        this.favoriteCarsById.push(doc.id);
      })
    })
    console.log(this.favoriteCarsById);
  }

  async openCarDetailsPopup(carModel: any) {
    const modal = await this.modalController.create({
      component: CarDetailsModalComponent,
      componentProps: {
        carModel: carModel,
        userId: this.userId
      },
      cssClass: 'car-details-modal',
      breakpoints: [0, 0.9, 1],
      initialBreakpoint: 0.9,
      backdropDismiss: true
    });
    return await modal.present();
  }

}
