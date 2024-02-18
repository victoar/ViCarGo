import { Component, OnInit } from '@angular/core';
import {ReservationModel} from "../../models/reservationModel";
import {AuthService} from "../../services/auth.service";
import {ReservationService} from "../../services/reservation.service";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-user-trips',
  templateUrl: './user-trips.page.html',
  styleUrls: ['./user-trips.page.scss'],
})
export class UserTripsPage implements OnInit {
  segmentSelection: string = 'upcoming';
  userId: string;
  reservations: ReservationModel[] = [];
  pastReservations: ReservationModel[] = [];
  private reservationsSubscription: Subscription;

  constructor(private authService: AuthService,
              private reservationService: ReservationService) { }

  ngOnInit() {
    this.userId = this.authService.getId();
    this.fetchReservations();
  }

  fetchReservations() {
    this.reservationsSubscription = this.reservationService
      .getReservationsForRenter(this.userId)
      .subscribe((allReservations: ReservationModel[]) => {
        this.reservations = allReservations.filter(reservation => (reservation.status === 'PENDING' || reservation.status === 'ACCEPTED'));
        this.pastReservations = allReservations.filter(reservation => (reservation.status === 'DECLINED' || reservation.status === 'COMPLETED'));
      });
  }
}
