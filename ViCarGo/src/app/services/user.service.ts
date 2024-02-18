import {Injectable, OnInit} from '@angular/core';
import {AngularFirestore} from "@angular/fire/compat/firestore";
import {UserModel} from "../models/userModel";
import {AuthService} from "./auth.service";
import {user} from "@angular/fire/auth";
import {Observable, Subject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class UserService implements OnInit{
  currentUser: UserModel;
  currentAuthentication: any;
  // private currentUserSubject: Subject<UserModel> = new Subject<UserModel>();
  // public currentUser$: Observable<UserModel> = this.currentUserSubject.asObservable();

  constructor(private firestore: AngularFirestore,
              private authService: AuthService) {
  }

  ngOnInit() {
    this.currentAuthentication = this.authService.getId();
    this.getUserByUid(this.currentAuthentication.uid).then(res => {
      this.currentUser = res;
    })
  }

  setCurrentUser(userId: string) {
    this.getUserByUid(userId).then(res => {
      this.currentUser = res;
      console.log(this.currentUser);
    })
  }

  getCurrentUser() {
    return this.currentUser;
  }

  getAuthenticatedUser(): Promise<UserModel> {
    const uid = this.authService.getCurrentAuthentication().uid;

    const userDocRef = this.firestore.collection('users').doc(uid);

    // Retrieve the user document from Firestore
    return userDocRef.get().toPromise()
      .then((doc) => {
        if (doc.exists) {
          // Map the Firestore document data to your UserModel
          const userData = doc.data() as UserModel;

          // Set the document ID on the UserModel instance
          userData.uid = doc.id;

          // this.currentUserSubject.next(userData);

          return userData;
        } else {
          throw new Error('User document not found');
        }
      })
      .catch((error) => {
        console.error('Error retrieving user document:', error);
        throw error;
      });
  }

  getUserByUid(uid: string): Promise<UserModel> {
    // Construct the reference to the user document based on UID
    const userDocRef = this.firestore.collection('users').doc(uid);

    // Retrieve the user document from Firestore
    return userDocRef.get().toPromise()
      .then((doc) => {
        if (doc.exists) {
          // Map the Firestore document data to your UserModel
          const userData = doc.data() as UserModel;

          // Set the document ID on the UserModel instance
          userData.uid = doc.id;

          // this.currentUserSubject.next(userData);

          return userData;
        } else {
          throw new Error('User document not found');
        }
      })
      .catch((error) => {
        console.error('Error retrieving user document:', error);
        throw error;
      });
  }

  updateUserProfile(userId: string, profileData: any) {
    // 'profileData' is an object containing the additional fields to be updated in the user document
    // const userData = JSON.stringify(profileData);
    console.log(profileData);

    // Construct the path to the user's document
    const userDocRef = this.firestore.collection('users').doc(userId);

    const userObject = { ...profileData };
    delete  userObject.uid;

    return userDocRef.update(userObject)
      .catch((error) => {
        console.error('Error updating user document:', error);
        throw error;
      });
    // Update the document with the provided profileData
    // return userDocRef.update(profileData)
    //   .then(() => {
    //     console.log('User profile updated successfully!');
    //   })
    //   .catch((error) => {
    //     console.error('Error updating user profile:', error);
    //   });
  }

  updateUserValidationBool(userId: string, isValdiated: boolean) {
    const reservationRef = this.firestore.collection('users').doc(userId);

    return reservationRef.update({ isUserValidated: isValdiated });
  }

  // getUserValidationStatus(userId: string) {
  //   return this.firestore.collection('users').doc(userId).get();
  // }
}
