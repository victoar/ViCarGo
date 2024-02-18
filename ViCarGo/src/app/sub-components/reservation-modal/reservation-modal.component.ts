import {Component, Input, OnInit} from '@angular/core';
import {ModalController} from "@ionic/angular";
import {format, parseISO} from 'date-fns';
import {ReservationModel} from "../../models/reservationModel";
import {ReservationService} from "../../services/reservation.service";
import {ToastService} from "../../services/toast.service";
import {CarModel} from "../../models/carModel";

@Component({
  selector: 'app-reservation-modal',
  templateUrl: './reservation-modal.component.html',
  styleUrls: ['./reservation-modal.component.scss'],
})
export class ReservationModalComponent  implements OnInit {
  @Input()
  userId: string;

  @Input()
  ownerId: string;

  @Input()
  carModel: CarModel;

  startDateValue = format(new Date(), 'yyyy-MM-dd') + 'T09:00:00.000Z';
  endDateValue = format(new Date(), 'yyyy-MM-dd') + 'T09:00:00.000Z';
  formattedStartDateValue = '';
  formattedEndDateValue = '';
  now: string;
  additionalInfo: string = '';

  constructor(private modalController: ModalController,
              private reservationService: ReservationService,
              private toastService: ToastService) { }

  ngOnInit() {
    this.now = format(new Date(), 'yyyy-MM-dd') + 'T09:00:00.000Z';
  }

  confirm() {
    if(this.formattedStartDateValue && this.formattedEndDateValue) {
      let newReservation: ReservationModel = {
        id: this.reservationService.generateCarId(),
        renterId: this.userId,
        ownerId: this.ownerId,
        carId: this.carModel.id,
        price: this.carModel.price,
        brand: this.carModel.brand,
        model: this.carModel.model,
        startDate: new Date(this.startDateValue),
        endDate: new Date(this.endDateValue),
        additionalInfo: this.additionalInfo,
        status: 'PENDING',
        isReviewed: false
      }
      this.reservationService.createReservation(newReservation)
        .then(() => {
          this.toastService.showToast('Reservation created successfully!\nCheck status in MyTrips', 'success');
          this.cancel();
      })
        .catch((error) => {
          console.error('Error in creation of the reservation', error);
          this.toastService.showToast('There was an error while creating your reservation', 'danger');
        });
    }
  }

  cancel() {
    this.modalController.dismiss();
  }

  startDateChanged(value) {
    this.startDateValue = value;
    this.formattedStartDateValue = format(parseISO(value), 'HH:mm, MMM d, yyyy');
    if(value > this.endDateValue) {
      this.endDateValue = value;
      this.formattedEndDateValue = format(parseISO(value), 'HH:mm, MMM d, yyyy')
    }
  }

  endDateChanged(value) {
    this.endDateValue = value;
    this.formattedEndDateValue = format(parseISO(value), 'HH:mm, MMM d, yyyy');
  }
}
