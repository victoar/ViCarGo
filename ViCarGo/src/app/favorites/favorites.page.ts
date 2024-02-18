import { Component, OnInit } from '@angular/core';
import {CarModel} from "../models/carModel";
import {CarService} from "../services/car.service";
import {AuthService} from "../services/auth.service";
import {LoadingController, ModalController} from "@ionic/angular";
import {concatMap, finalize, forkJoin, Observable, switchMap, tap} from "rxjs";
import {CarDetailsModalComponent} from "../sub-components/car-details-modal/car-details-modal.component";

@Component({
  selector: 'app-favorites',
  templateUrl: './favorites.page.html',
  styleUrls: ['./favorites.page.scss'],
})
export class FavoritesPage implements OnInit {

  favoriteCarsById: string[] = [];
  favoriteCarsModels: CarModel[] = [];
  private userId: string;
  favoriteCarsByUser: Observable<CarModel[]>;
  isLoading: boolean = true;

  constructor(private carService: CarService,
              private authService: AuthService,
              private modalController: ModalController,
              private loadingController: LoadingController) { }

  ngOnInit() {
  }

  ionViewWillEnter() {
    this.favoriteCarsById = [];
    this.favoriteCarsModels = [];
    // console.log(this.authService.getId());
    this.authService.getCurrentUserId().then(userId => {
      // this.presentLoading().then();
      console.log(userId);
      this.userId = userId;
      // this.dismissLoading().then();
      this.favoriteCarsByUser = this.carService.retrieveFavoriteCarsByUserId(this.userId);
      console.log(this.favoriteCarsByUser);
      // this.getFavoriteCarsForUser();
    })
  }

  getFavoriteCarsForUser() {
    this.carService.getFavoriteCars(this.userId)
      .subscribe((querySnapshot) => {
          querySnapshot.forEach((doc) => {
            console.log(doc.id);
            this.favoriteCarsById.push(doc.id);
          });
        },
        () => {},
        () => {
          this.favoriteCarsById.forEach(carId => {
            this.carService.getCarById(carId).subscribe(carModel => {
              this.favoriteCarsModels.push(carModel);
            })
          })
          this.isLoading = false;
          console.log(this.isLoading)
          // this.dismissLoading();
        });
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
