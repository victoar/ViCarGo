import { Component, OnInit } from '@angular/core';
import {CarModel} from "../../models/carModel";
import {ModalController} from "@ionic/angular";
import {SaveCarModalComponent} from "../../sub-components/save-car-modal/save-car-modal.component";
import {UserModel} from "../../models/userModel";
import {UserService} from "../../services/user.service";
import {CarService} from "../../services/car.service";
import {LoadingService} from "../../services/loading.service";

@Component({
  selector: 'app-user-cars',
  templateUrl: './user-cars.page.html',
  styleUrls: ['./user-cars.page.scss'],
})
export class UserCarsPage implements OnInit {

  // carMock1: CarModel = {
  //   imagePath: "assets/images/home-page/mazda.jpg",
  //   brand: "Mazda",
  //   model: "6",
  //   reviewRating: 4.7,
  //   tripsNumber: 23,
  //   price: 1000,
  //   year: 2018,
  //   transmission: "Manual",
  //   fuelInto: "Full",
  //   passengers: 5,
  //   consumption: 4.8,
  //   speed: 215,
  //   horsepower: 145,
  //   additionalInfo: "prima betie",
  //   licensePlate: "CJ-99-VIC"
  // }

  user: UserModel = null;
  carsList: CarModel[] = [];

  constructor(private modalController: ModalController,
              private userService: UserService,
              private carService: CarService,
              private loadingService: LoadingService) { }

  ngOnInit() {
    // this.carsList.push(this.carMock1);
    // this.carsList.push(this.carMock1);
    // this.carsList.push(this.carMock1);
    // this.carsList.push(this.carMock1);
    this.loadingService.presentLoading().then();
    this.userService.getAuthenticatedUser().then((user: UserModel) => {
      this.user = user;
      this.getCarList();
    })
  }


  getCarList() {
    this.carService.getCarsByUserId(this.user.uid).subscribe((carList) => {
      this.carsList = carList;
      console.log(this.carsList);
      setTimeout(() => {this.loadingService.dismissLoading().then()}, 200)
    }, error => {
      setTimeout(() => {this.loadingService.dismissLoading().then()}, 200)
    });
  }

  async presentSaveCarModal(carModel: CarModel) {
    const modal = await this.modalController.create({
      component: SaveCarModalComponent,
      componentProps: {
        carModel: carModel,
        userModel: this.user
      },
      cssClass: 'car-details-modal',
    });

    return await modal.present();
  }

  deleteCard() {

  }
}
