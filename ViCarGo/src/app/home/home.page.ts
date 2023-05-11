import { Component } from '@angular/core';
import {AuthService} from "../services/auth.service";
import {Router} from "@angular/router";
import {GeolocationService} from "../services/geolocation.service";
import {CarModel} from "../models/carModel";
import {AlertController, ModalController} from "@ionic/angular";
import {NativeGeocoder} from "@awesome-cordova-plugins/native-geocoder/ngx";
import {CarDetailsModalComponent} from "../sub-components/car-details-modal/car-details-modal.component";

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  topBrandsList: string[] = ["bmw", "audi", "volkswagen", "mercedes", "skoda", "tesla", "dacia", "renault", "kia", "opel"];
  currentLocation: string = "Loading...";

  carMock1: CarModel = {
    imagePath: "assets/images/home-page/mazda.jpg",
    brand: "Mazda",
    model: "6",
    reviewRating: 4.7,
    tripsNumber: 23,
    price: 1000,
    year: 2018,
    transmission: "Manual",
    fuelInto: "Full",
    passengers: 5,
    consumption: 4.8,
    speed: 215,
    horsepower: 145,
    additionalInfo: "prima betie",
    licensePlate: "CJ-99-VIC"
  }

  carMock2: CarModel = {
    imagePath: "assets/images/home-page/a-class.jpg",
    brand: "Mercedes-Benz",
    model: "A 200 AMG",
    reviewRating: 5.0,
    tripsNumber: 7,
    price: 1500,
    year: 2018,
    transmission: "Manual",
    fuelInto: "Full",
    passengers: 4,
    consumption: 5.7,
    speed: 230,
    horsepower: 170,
    additionalInfo: "prima betie",
    licensePlate: "CJ-99-VIC"
  }

  constructor(private authService: AuthService,
              private router: Router,
              private geolocationService: GeolocationService,
              private alertController: AlertController,
              private nativeGeocoder: NativeGeocoder,
              public modalController: ModalController) {}

  ngOnInit() {
    this.requestGeolocationPermission();
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
      breakpoints: [0.9, 1],
      initialBreakpoint: 0.9,
      backdropDismiss: true
    });
    return await modal.present();
  }

  onClick() {
    console.log("lol")
  }
}
