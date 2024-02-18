import {Component, Input, OnInit} from '@angular/core';
import {ReservationModel} from "../../models/reservationModel";
import {ReservationService} from "../../services/reservation.service";
import {ToastService} from "../../services/toast.service";
import {ModalController} from "@ionic/angular";
import {SaveCarModalComponent} from "../save-car-modal/save-car-modal.component";
import {WriteReviewModalComponent} from "../write-review-modal/write-review-modal.component";

@Component({
  selector: 'app-car-reservation-item',
  templateUrl: './car-reservation-item.component.html',
  styleUrls: ['./car-reservation-item.component.scss'],
})
export class CarReservationItemComponent  implements OnInit {
  @Input()
  reservation: ReservationModel;

  @Input()
  isFromCarRequests: boolean;
  // startDate: any;
  // endDate: any

  constructor(private reservationService: ReservationService,
              private toastService: ToastService,
              private modalController: ModalController) { }

  ngOnInit() {
    // this.startDate =
  }

  confirmReservation(reservation: any) {
    this.reservationService.updateStatusForBatch(reservation)
      .then(() => {

    })
      .catch(() => {
        this.toastService.showToast('There was an error while confirming the reservation. Please try again', 'danger');
      })
  }

  declineReservation(reservation: any) {
    this.reservationService.updateReservationStatus(reservation.id, 'DECLINED')
      .then(() => {

      })
      .catch(() => {
        this.toastService.showToast('There was an error while declining the reservation. Please try again', 'danger');
      })
  }

  async leaveReview(reservation: ReservationModel) {
    const modal = await this.modalController.create({
      component: WriteReviewModalComponent,
      componentProps: {
        reservationModel: reservation,
      }
    });

    return await modal.present();
  }
}
