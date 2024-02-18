import {Component, Input, OnInit} from '@angular/core';
import {ModalController, ToastController} from "@ionic/angular";
import {CarModel} from "../../models/carModel";
import {UserService} from "../../services/user.service";
import {UserModel} from "../../models/userModel";
import {CallNumber} from "capacitor-call-number";
import {NavigationExtras, Router} from "@angular/router";
import {ChatService} from "../../services/chat.service";
import {ReservationModalComponent} from "../reservation-modal/reservation-modal.component";
import {WriteReviewModalComponent} from "../write-review-modal/write-review-modal.component";
import {ReadReviewsModalComponent} from "../read-reviews-modal/read-reviews-modal.component";

@Component({
  selector: 'app-car-details-modal',
  templateUrl: './car-details-modal.component.html',
  styleUrls: ['./car-details-modal.component.scss'],
})
export class CarDetailsModalComponent  implements OnInit {
  @Input()
  carModel: CarModel;

  @Input()
  userId: string;

  public carOwner: UserModel;

  constructor(private modalController: ModalController,
              private userService: UserService,
              private toastController: ToastController,
              private chatService: ChatService,
              private router: Router
              ) { }

  ngOnInit() {
    console.log(this.carModel);
    this.userService.getUserByUid(this.carModel.ownerId).then(user => {
      this.carOwner = user;
      console.log(this.carOwner);
    })
  }

  dismissModal() {
    this.modalController.dismiss();
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

  dialNumberOnClick() {
    if(this.carOwner.phoneNumber) {
      window.open("tel:" + this.carOwner.phoneNumber);
    } else {
      this.showToast("Phone number is missing", "danger");
    }
  }

  async sendMessageOnClick() {
    try {
      // this.global.showLoader();
      // create chatroom
      const room = await this.chatService.createChatRoom(this.carOwner.uid);
      console.log('room: ', room);
      // const navData: NavigationExtras = {
      //   queryParams: {
      //     name: item?.name
      //   }
      // };
      this.router.navigate(['/chat-room'], {queryParams: {firstName: this.carOwner?.firstName, chatId: room?.id}});
      this.dismissModal();
      // this.global.hideLoader();
    } catch(e) {
      console.log(e);
      // this.global.hideLoader();
    }
  }

  async seeCarReviews(carId: any) {
    const modal = await this.modalController.create({
      component: ReadReviewsModalComponent,
      componentProps: {
        carId: carId,
      }
    });

    return await modal.present();
  }
}
