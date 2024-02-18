import { Component } from '@angular/core';
import {AuthService} from "../services/auth.service";
import {Router} from "@angular/router";
import {GeolocationService} from "../services/geolocation.service";
import {CarModel} from "../models/carModel";
import {AlertController, LoadingController, ModalController} from "@ionic/angular";
import {NativeGeocoder} from "@awesome-cordova-plugins/native-geocoder/ngx";
import {CarDetailsModalComponent} from "../sub-components/car-details-modal/car-details-modal.component";
import {UserModel} from "../models/userModel";
import {UserService} from "../services/user.service";
import {FilterCarModel} from "../models/filterCarModel";
import {CarService} from "../services/car.service";

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  topBrandsList: string[] = ["BMW", "Audi", "Volkswagen", "Mercedes-benz", "Skoda", "Tesla", "Dacia", "Renault", "Kia", "Opel"];
  currentLocation: string = "Loading...";

  carMock1: CarModel = {
    id: "asda",
    ownerId: "asd",
    imagePath: "assets/images/home-page/mazda.jpg",
    brand: "Mazda",
    model: "6",
    reviewRating: 18,
    reviewNumber: 4,
    price: 35,
    year: 2018,
    transmission: "Manual",
    fuelInto: "Full",
    passengers: 5,
    consumption: 4.8,
    speed: 215,
    horsepower: 145,
    additionalInfo: "prima betie",
    licensePlate: "CJ-99-VIC",
    carImages: [],
    locationLatitude: 0,
    locationLongitude: 0,
    locationAddress: "",
    locationGeohash: ""
  }

  carMock2: CarModel = {
    id: "asda",
    ownerId: "asd",
    imagePath: "assets/images/home-page/a-class.jpg",
    brand: "Mercedes-Benz",
    model: "A 200 AMG",
    reviewRating: 24,
    reviewNumber: 5,
    price: 75,
    year: 2018,
    transmission: "Manual",
    fuelInto: "Full",
    passengers: 4,
    consumption: 5.7,
    speed: 230,
    horsepower: 170,
    additionalInfo: "prima betie",
    licensePlate: "CJ-99-VIC",
    carImages: [],
    locationLatitude: 0,
    locationLongitude: 0,
    locationAddress: "",
    locationGeohash: ""
  }

  user: UserModel;
  searchRange: any;
  favoriteCarsById: string[] = [];
  carModels: any[] = [];
  filteredCars: any[] = [];
  isLoading: boolean = true;
  userLatitude: number;
  userLongitude: number;

  constructor(private authService: AuthService,
              private router: Router,
              private geolocationService: GeolocationService,
              private alertController: AlertController,
              private nativeGeocoder: NativeGeocoder,
              private modalController: ModalController,
              private loadingController: LoadingController,
              private carService: CarService,
              private userService: UserService) {}

  ngOnInit() {
    this.isLoading = true;
    this.userService.getAuthenticatedUser().then((user: UserModel) => {
      this.user = user;
      this.requestGeolocationPermission();
      this.geolocationService.getCurrentLocation()
        .then(result => {
        this.userLatitude = result.coords.latitude;
        this.userLongitude = result.coords.longitude;
        this.searchRange = this.geolocationService.getGeoHashRange(this.userLongitude, this.userLatitude, 5);
        this.populateWithCars();
      })
        .catch(() => {
          this.userLatitude = 46.773150;
          this.userLongitude = 23.620718;
          this.searchRange = this.geolocationService.getGeoHashRange(this.userLongitude, this.userLatitude, 5);
          this.populateWithCars();
        })

    })
    console.log("lol")
  }

  async logout() {
    await this.authService.logout()
      .then(() => {
        this.router.navigate(['/'], {replaceUrl: true});
      })
  }

  async requestLocationPopup() {
    const alert = await this.alertController.create({
      header: 'Location Access',
      message: 'Enabling your location helps us finding the closest car for you.',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => console.log('Cancel clicked')
        },
        {
          text: 'Allow',
          handler: () => this.enableLocation()
        }
      ]
    });
    await alert.present();
  }

  async enableLocation() {
    try {
      const status = await this.geolocationService.requestLocationPermission();
      console.log(status);
      if(status?.location == 'granted') {
        const stat = await this.geolocationService.enableLocation();
        if (stat) {
          const coordinates = await this.geolocationService.getCurrentLocation();
          console.log(coordinates);
        }
      }
    } catch (e) {
      console.log(e);
    }
  }

  async getCurrentLocation() {
    try {
      const coordinates = await this.geolocationService.getCurrentLocation();
      console.log('Current pos:' + coordinates);
      this.nativeGeocoder.reverseGeocode(coordinates.coords.latitude, coordinates.coords.longitude)
        .then((result) => {
          console.log("address: " + JSON.stringify(result));
          result.forEach(item => {
            this.currentLocation = item.subThoroughfare + " " + item.thoroughfare;
          })
        })
        .catch((error: any) => {
          this.currentLocation = "Loading..."
          console.log(error)
        })
    } catch (e) {
      console.log(e);
    }
  }

  async requestGeolocationPermission() {
    try {
      const status = await this.geolocationService.requestLocationPermission();
      console.log(status);
      if(status?.location == 'granted') {
        await this.getCurrentLocation();
      } else {
        console.log("we do not have permission");
        await this.requestLocationPopup();
      }
    } catch (e) {
      console.log(e);
    }
  }

  async presentDetailsModal(carModel: CarModel) {
    const modal = await this.modalController.create({
      component: CarDetailsModalComponent,
      componentProps: {
        carModel: carModel,
      },
      cssClass: 'car-details-modal',
      breakpoints: [0, 0.9, 1],
      initialBreakpoint: 0.9,
      backdropDismiss: true,
      canDismiss: true
    });
    return await modal.present();
  }

  async presentLoading() {
    const loading = await this.loadingController.create({
      message: 'Loading...',
      spinner: 'circles',
    });
    await loading.present();
  }

  async dismissLoading() {
    await this.loadingController.dismiss();
  }

  navigateToSearchPageUsingUserLocation() {
    this.router.navigate(['search-cars'], {queryParams: {userLocation: true}})
  }

  navigateToSearchPageBrandFiltered(brand: string) {
    console.log(brand);
    this.router.navigate(['/search-cars'], {queryParams: {brand: brand}});
  }

  navigateToSearchPage() {
    console.log('wtf')
    this.router.navigate(['/search-cars']);
  }

  navigateToUserProfile() {
    this.router.navigate(['/landing/account/user-details'])
  }

  populateWithCars() {
    // this.carService.getFavoriteCars(this.userId).subscribe()
    this.carService.getCarsBasedOnLocation(this.searchRange.lower, this.searchRange.upper, this.user.uid).subscribe(cars => {
      // this.carModels = cars;
      this.carService.getFavoriteCars(this.user.uid)
        .subscribe((querySnapshot) => {
          querySnapshot.forEach((doc) => {
            this.favoriteCarsById.push(doc.id);
          })
          console.log(this.carModels);
          this.carModels = this.getDistancesAndPerformMoreExactSort(cars, 5);
          this.isLoading = false;
          console.log(this.carModels);
        })
    })
  }

  getDistancesAndPerformMoreExactSort(cars: CarModel[], radius: number) {
    return cars
      .filter(car => car.ownerId != this.user.uid)
      .map(car => {

        const distance = this.geolocationService.calculateDistance(
          45.7678128,
          22.9072331,
          car.locationLatitude,
          car.locationLongitude
        );

        const isFavorite = this.favoriteCarsById.includes(car.id);

        return {...car, distance, isFavorite};
      })
      .filter(car => car.distance <= radius);
  }
}
