import {Component, Input, OnInit} from '@angular/core';
import {CarModel} from "../../models/carModel";
import {CarService} from "../../services/car.service";
import {AlertController, ToastController} from "@ionic/angular";
import {AuthService} from "../../services/auth.service";

@Component({
  selector: 'app-large-car-item',
  templateUrl: './large-car-item.component.html',
  styleUrls: ['./large-car-item.component.scss'],
})
export class LargeCarItemComponent  implements OnInit {

  @Input()
  carItem: CarModel;

  @Input()
  showFavoriteButton?: boolean;

  @Input()
  isFavorite?: boolean;

  @Input()
  distanceFromUser?: number;

  public distanceDisplayed: string;
  public distanceMeasurement: string = 'km';
  private userId: string;
  private imageLoading: boolean = true;

  constructor(private carService: CarService,
              private alertController: AlertController,
              private authService: AuthService,
              private toastController: ToastController) { }

  ngOnInit() {
    this.formatDistanceAway();
  }

  formatDistanceAway() {
    if(this.distanceFromUser != undefined) {
      if(this.distanceFromUser < 1) {
        this.distanceDisplayed = (this.distanceFromUser * 1000).toFixed(0);
        this.distanceMeasurement = 'm';
      } else {
        this.distanceDisplayed = this.distanceFromUser.toFixed(2);
      }
    }
  }

  async deleteCar(event: Event): Promise<void> {
    event.stopPropagation();
    const alert = await this.alertController.create({
      header: 'Confirm Deletion',
      message: 'Are you sure you want to delete this car?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            // User clicked the cancel button
            console.log('Deletion canceled.');
          }
        },
        {
          text: 'Delete',
          handler: () => {
            // User clicked the delete button
            this.carService.deleteCar(this.carItem.id)
              .then(() => {
                // Deletion successful
                this.showToast("Car deleted successfully", "success")
                console.log('Car deleted successfully.');
              })
              .catch((error) => {
                // Error occurred during deletion
                this.showToast("An error occurred while saving the car", "danger")
                console.error('Error deleting car:', error);
              });
          }
        }
      ]
    });

    await alert.present();
  }

  favoritesButtonClicked(event: Event) {
    event.stopPropagation();
    this.userId = this.authService.getId();
    if(this.isFavorite) {
      this.carService.removeCarFromFavorites(this.userId, this.carItem.id).then(() => {
        console.log("removed from fav");
        this.isFavorite = !this.isFavorite;
      })
    } else {
      this.carService.addCarToFavorites(this.userId, this.carItem.id).then(() => {
        console.log("added car to fav");
        this.isFavorite = !this.isFavorite;
      })
    }
  }

  async showToast(message: string, toastColor: string): Promise<void> {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000, // Duration in milliseconds
      position: "top",
      color: toastColor // Choose the desired color for the toast
    });
    await toast.present();
  }

  handleImageLoad() {
    this.imageLoading = false;
  }
}
