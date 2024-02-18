import { Injectable } from '@angular/core';
import {AngularFirestore, QuerySnapshot} from "@angular/fire/compat/firestore";
import {ReservationModel} from "../models/reservationModel";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ReservationService {

  constructor(private firestore: AngularFirestore) { }

  generateCarId() {
    return this.firestore.createId();
  }

  createReservation(reservation: ReservationModel): Promise<void> {
    return this.firestore.collection('reservations').doc(reservation.id).set(reservation);
  }

  // getReservationsForOwner(ownerId: string): Promise<QuerySnapshot<ReservationModel>> {
  //   return this.firestore.collection<ReservationModel>('reservations')
  //     .ref.where('ownerId', '==', ownerId)
  //     .orderBy('startDate', 'desc')
  //     .get();
  // }

  getReservationsForOwner(ownerId: string): Observable<ReservationModel[]> {
    return new Observable<ReservationModel[]>(observer => {
      const unsubscribe = this.firestore.collection<ReservationModel>('reservations')
        .ref.where('ownerId', '==', ownerId)
        .orderBy('startDate', 'desc')
        .onSnapshot(snapshot => {
          const reservations: ReservationModel[] = [];
          snapshot.forEach(doc => {
            const data = doc.data() as ReservationModel;
            const id = doc.id;
            reservations.push({ id, ...data });
          });
          observer.next(reservations);
        });

      return () => unsubscribe();
    });
  }

  getReservationsForRenter(renterId: string): Observable<ReservationModel[]> {
    return new Observable<ReservationModel[]>(observer => {
      const unsubscribe = this.firestore.collection<ReservationModel>('reservations')
        .ref.where('renterId', '==', renterId)
        .orderBy('startDate', 'desc')
        .onSnapshot(snapshot => {
          const reservations: ReservationModel[] = [];
          snapshot.forEach(doc => {
            const data = doc.data() as ReservationModel;
            const id = doc.id;
            reservations.push({ id, ...data });
          });
          observer.next(reservations);
        });

      return () => unsubscribe();
    });
  }

  async getAcceptedReservationsBetweenIntervalByCarId(startDate, endDate) {
    const reservationsSnapshot = await this.firestore.collection<ReservationModel>('reservations')
      .ref.where('status', '==', 'ACCEPTED')
      .get();

    let reservations: ReservationModel[] = [];
    reservationsSnapshot.forEach(doc => {
      const reservation = doc.data() as ReservationModel;
      reservation.id = doc.id;
      reservations.push(reservation);
    });

    startDate = new Date(startDate);
    endDate = new Date(endDate);

    return reservations.filter(reservation => (
      (reservation.startDate.toDate() <= endDate && endDate >= startDate) ||
      (reservation.startDate.toDate() >= startDate && reservation.endDate.toDate() <= endDate) ||
      (reservation.startDate.toDate() <= startDate && reservation.endDate.toDate() >= endDate)
    )).map(reservation => {
      return reservation.carId;
    });
  }

  // getReservationsForRenter(renterId: string): Promise<QuerySnapshot<ReservationModel>> {
  //   return this.firestore.collection<ReservationModel>('reservations')
  //     .ref.where('renterId', '==', renterId)
  //     .orderBy('startDate', 'desc')
  //     .get();
  // }

  updateReservationStatus(reservationId: string, newStatus: string): Promise<void> {
    const reservationRef = this.firestore.collection('reservations').doc(reservationId);

    return reservationRef.update({ status: newStatus });
  }

  updateReservationReviewBool(reservationId: string): Promise<void> {
    const reservationRef = this.firestore.collection('reservations').doc(reservationId);

    return reservationRef.update({ isReviewed: true });
  }

  async updateStatusForBatch(acceptedReservation: ReservationModel) {
    try {
      const batch = this.firestore.firestore.batch();

      const reservationsSnapshot = await this.firestore.collection('reservations').ref
        .where('ownerId', '==', acceptedReservation.ownerId)
        .where('carId', '==', acceptedReservation.carId)
        .where('status', '==', 'PENDING')
        .get();

      let reservations: ReservationModel[] = [];
      reservationsSnapshot.forEach(doc => {
        const reservation = doc.data() as ReservationModel;
        reservation.id = doc.id;
        reservations.push(reservation);
      });
      console.log(reservations);

      reservations = reservations.filter(reservation => (reservation.id != acceptedReservation.id && (
        (reservation.startDate.toDate() <= acceptedReservation.endDate.toDate() && reservation.endDate.toDate() >= acceptedReservation.startDate.toDate()) ||
        (reservation.startDate.toDate() >= acceptedReservation.startDate.toDate() && reservation.endDate.toDate() <= acceptedReservation.endDate.toDate()) ||
        (reservation.startDate.toDate() <= acceptedReservation.startDate.toDate() && reservation.endDate.toDate() >= acceptedReservation.endDate.toDate())
      )));

      console.log(reservations);
      reservations.forEach(reservation => {
        // Verificați dacă cererea trebuie actualizată și adăugați-o la batch
          const reservationRef = this.firestore.collection('reservations').doc(reservation.id).ref;
          batch.update(reservationRef, { status: 'DECLINED' });
      });

      const reservationRef = this.firestore.collection('reservations').doc(acceptedReservation.id).ref;
      batch.update(reservationRef, { status: 'ACCEPTED' });

      await batch.commit();
    } catch (error) {
      console.log('Eroare la procesarea cererilor retrase:', error);
    }
  }

  async acceptReservation(reservation: ReservationModel) {
    // Obțineți intervalul de date al cererii acceptate
    try {
      const startDate = reservation.startDate;
      const endDate = reservation.endDate;

      // Interogare Firebase pentru a obține cererile care se suprapun cu intervalul acceptat
      const overlappingReservationsSnapshot = await this.firestore.collection('reservations').ref
        .where('carId', '==', reservation.carId)
        .where('status', '==', 'PENDING')
        .where('startDate', '<', endDate)
        .where('endDate', '>', startDate)
        .get();

      const batch = this.firestore.firestore.batch();
      console.log("am aj aici")

      // Actualizează statusul fiecărei cereri de rezervare refuzate
      overlappingReservationsSnapshot.forEach(doc => {
        const overlappingReservation = doc.data() as ReservationModel;
        overlappingReservation.status = 'DECLINED';

        const reservationRef = this.firestore.collection('reservations').doc(doc.id).ref;
        batch.update(reservationRef, overlappingReservation);
      });

      console.log("am aj aici")
      // Actualizează statusul cererii acceptate
      const acceptedReservationRef = this.firestore.collection('reservations').doc(reservation.id).ref;
      batch.update(acceptedReservationRef, {status: 'ACCEPTED'});

      // Execută tranzacția atomică pentru a actualiza cererile
      await batch.commit();
    } catch (error) {
      console.log('Eroare la acceptarea rezervării:', error);
    }
  }

}
