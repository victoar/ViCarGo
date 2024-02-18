import {Injectable} from '@angular/core';
import {AngularFirestore, DocumentChangeAction, QuerySnapshot} from "@angular/fire/compat/firestore";
import {CarModel} from "../models/carModel";
import {combineLatest, forkJoin, map, Observable, switchMap, tap} from "rxjs";
import {ApiService} from "./api.service";
import {ReviewModel} from "../models/reviewModel";
import {ReservationModel} from "../models/reservationModel";
import {AngularFireStorage} from "@angular/fire/compat/storage";

@Injectable({
  providedIn: 'root'
})
export class CarService {

  // favoriteCarIds$: Observable<string[]>;
  public favoriteCars: Observable<any[]>;

  constructor(private firestore: AngularFirestore,
              private storage: AngularFireStorage,
              private apiService: ApiService) { }

  generateCarId() {
    return this.firestore.createId();
  }

  addCarForUser(userId: string, car: any): Promise<void> {
    car.ownerId = userId; // Associate the car with the user

    if(!car.id) {
       // Generate a unique ID for the car
      car.id = this.generateCarId()
    }

    return this.firestore.collection('cars').doc(car.id).set(car);
  }

  deleteCar(carId: string): Promise<void> {
    return this.firestore.collection('cars').doc(carId).delete();
  }

  getCarsByUserId(userId: string): Observable<CarModel[]> {
    return this.firestore.collection<CarModel>('cars', ref => ref.where('ownerId', '==', userId)).valueChanges();
  }

  getAllCarsExcludingAuthUser(authUserId: string): Observable<any[]> {
    return this.firestore.collection('cars', ref => ref.where('ownerId', '!=', authUserId)).valueChanges();
  }

  getCarById(carId: string): Observable<CarModel> {
    return this.firestore.collection<CarModel>('cars').doc(carId).valueChanges();
  }

  getCarByIdSimple(carId: string) {
    return this.firestore.collection<CarModel>('cars').doc(carId).get();
  }

  getCarsBasedOnLocation(lowerBoundHash, upperBoundHash, authUserId): Observable<any[]> {
    // const ownerQuery = this.firestore.collection('cars', ref => ref
    //   .where('ownerId', '!=', authUserId))
    //   .valueChanges();
    console.log(lowerBoundHash);
    console.log(upperBoundHash);

    return this.firestore.collection('cars', ref => ref
      .where('locationGeohash', '>=', lowerBoundHash)
      .where('locationGeohash', '<=', upperBoundHash))
      .valueChanges();


    // return combineLatest([ownerQuery, locationQuery]).pipe(
    //   map(([ownerCars, locationCars]) => {
    //     // Combine and process the cars from both queries as needed
    //     // For example, you can filter out duplicates or merge the results
    //     return [...locationCars];
    //   })
    // );
  }

  addCarToFavorites(userId, carId) {
    const userRef = this.firestore.collection('users').doc(userId);
    const favoritesRef = userRef.collection('favorites');

    // Create the favorite car document
    return favoritesRef.doc(carId).set({});
  }

  removeCarFromFavorites(userId, carId) {
    const userRef = this.firestore.collection('users').doc(userId);
    const favoriteCarDoc = userRef.collection('favorites').doc(carId);

    return favoriteCarDoc.delete();
  }

  getFavoriteCars(userId) {
    const userRef = this.firestore.collection('users').doc(userId);
    const favoritesRef = userRef.collection('favorites');

    return favoritesRef.get();
  }

  retrieveFavoriteCarsByUserId(userId: string): Observable<CarModel[]> {
    return this.firestore.collection(`users/${userId}/favorites`).snapshotChanges().pipe(
      switchMap((actions: DocumentChangeAction<unknown>[]) => {
        const carIds: string[] = actions.map(action => action.payload.doc.id);
        const carObservables: Observable<CarModel>[] = carIds.map(carId => {
          console.log(carId);
          return this.getCarById(carId).pipe(
            tap(car => console.log(car))
          );
        });

        return combineLatest(carObservables); // Wait for all the car observables to complete
      })
    );
  }

  // retrieveFavoriteCarsByUserId(userId: string) : Observable<CarModel[]> {
  //   return this.firestore.collection(`users/${userId}/favorites`).snapshotChanges()
  //     .pipe(
  //       map((carIds) => {
  //         const carObservables = carIds.map(carId => {
  //           this.getCarById(carId);
  //         }
  //         return forkJoin(carObservables))
  //       })
  //     )
  // }

  // retrieveFavoriteCars(userId) {
  //   this.apiService.
  // }

  updateReviewRatingsForCar(carId: string, rating: number) {
    this.getCarByIdSimple(carId).subscribe(res => {
      let carModel = res.data();
      const newReviewNumber = carModel.reviewNumber + 1;
      const newReviewRating = carModel.reviewRating + rating;
      this.firestore.collection('cars').doc(carId).update({reviewNumber: newReviewNumber, reviewRating: newReviewRating})
    });
  }

  addNewCarReview(newReview: ReviewModel) {
    let carCollection = this.firestore.collection('cars').doc(newReview.carId);
    let reviewId = this.generateCarId();

    this.updateReviewRatingsForCar(newReview.carId, newReview.rating);

    return carCollection.collection('reviews').doc(reviewId).set(newReview);
  }

  getReviewsForCar(carId: string) : Promise<QuerySnapshot<ReviewModel>> {
    return this.firestore.collection('cars').doc(carId).collection<ReviewModel>('reviews').ref
      .orderBy('createdAt', 'desc')
      .get()
  }
}
