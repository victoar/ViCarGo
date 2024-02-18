import { Component, OnInit } from '@angular/core';
import {AuthService} from "../../services/auth.service";
import {ReservationService} from "../../services/reservation.service";
import {ReservationModel} from "../../models/reservationModel";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-user-car-requests',
  templateUrl: './user-car-requests.page.html',
  styleUrls: ['./user-car-requests.page.scss'],
})
export class UserCarRequestsPage implements OnInit {
  segmentSelection: string = 'pending';
  userId: string;
  reservations: ReservationModel[] = [];
  processedReservations: ReservationModel[] = [];
  private reservationsSubscription: Subscription;

  constructor(private authService: AuthService,
              private reservationService: ReservationService) { }

  ngOnInit() {
    this.userId = this.authService.getId();
    this.fetchReservations();
  }

  fetchReservations() {
    this.reservationsSubscription = this.reservationService
      .getReservationsForOwner(this.userId)
      .subscribe((allReservations: ReservationModel[]) => {
        this.reservations = allReservations.filter(reservation => reservation.status === 'PENDING');
        this.processedReservations = allReservations.filter(reservation => reservation.status !== 'PENDING');
      });
  }

}
