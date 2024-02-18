import {Component, Input, OnInit} from '@angular/core';
import {ModalController} from "@ionic/angular";
import {CarService} from "../../services/car.service";
import {UserService} from "../../services/user.service";
import {ReservationModel} from "../../models/reservationModel";
import {UserModel} from "../../models/userModel";
import {ReviewModel} from "../../models/reviewModel";
import {ToastService} from "../../services/toast.service";
import {ReservationService} from "../../services/reservation.service";

@Component({
  selector: 'app-write-review-modal',
  templateUrl: './write-review-modal.component.html',
  styleUrls: ['./write-review-modal.component.scss'],
})
export class WriteReviewModalComponent  implements OnInit {
  @Input()
  reservationModel: ReservationModel;

  reviewText: any;
  ratingValue: number = 1;
  isStarClicked: boolean[] = [true, false, false, false, false];
  userModel: UserModel;

  constructor(private modalController: ModalController,
              private carService: CarService,
              private reservationService: ReservationService,
              private toastService: ToastService,
              private userService: UserService) { }

  ngOnInit() {
    this.userService.getUserByUid(this.reservationModel.renterId).then(res => {
     this.userModel = res;
    })
  }

  dismissModal() {
    this.modalController.dismiss({ isReviewSubmitted: false })
  }

  submitReview() {
    let newReview: ReviewModel = {
      carId: this.reservationModel.carId,
      userId: this.userModel.uid,
      userFirstName: this.userModel.firstName,
      rating: this.ratingValue,
      text: this.reviewText,
      createdAt: new Date()
    }
    this.carService.addNewCarReview(newReview)
      .then(() => {
        this.reservationService.updateReservationReviewBool(this.reservationModel.id)
          .then(() => {
            this.toastService.showToast('Review saved successfully', 'success');
            this.modalController.dismiss({ isReviewSubmitted: true })
          })
          .catch(() => {
            this.toastService.showToast('There was a problem while saving your review. Please try again', 'danger');
          })
    })
      .catch(() => {
        this.toastService.showToast('There was a problem while saving your review. Please try again', 'danger');
      })
  }

  starClicked(number: number) {
    this.ratingValue = number;
    console.log(this.ratingValue);
    for (let i = 0; i < 5; i++) {
      this.isStarClicked[i] = i < number;
    }
  }
}
