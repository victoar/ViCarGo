import {Injectable, OnInit} from '@angular/core';
import {Auth, createUserWithEmailAndPassword, getAuth, signInWithEmailAndPassword, signOut} from "@angular/fire/auth";
import {AngularFirestore} from "@angular/fire/compat/firestore";
import {UserService} from "./user.service";
import {BehaviorSubject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class AuthService{
  currentUser: any;
  // private currentUserId: any;
  public uid = new BehaviorSubject<any>(null);

  constructor(private auth: Auth,
              private firestore: AngularFirestore) {
    // this.auth.onAuthStateChanged(user => {
    //   this.currentUserId = user.uid;
    //   console.log(user);
    // })
  }

  getId() {
    const auth = getAuth();
    console.log('current user auth: ', auth.currentUser);
    this.currentUser = auth.currentUser;
    console.log(this.currentUser);
    return this.currentUser?.uid;
  }


  async register({email, password, firstName, lastName}) {
    return createUserWithEmailAndPassword(this.auth, email, password).then(cred => {
      return this.firestore.collection('users').doc(cred.user.uid).set({
        firstName: firstName,
        lastName: lastName,
        isUserValidated: false
      })
    });
  }

  async login({email, password}) {
    return signInWithEmailAndPassword(this.auth, email, password);
  }

  logout() {
    return signOut(this.auth);
  }

  getCurrentAuthentication() {
    return this.auth.currentUser;
  }

  // getCurrentAuthenticationUID() {
  //   return this.currentUserId;
  // }

  getCurrentUserId() : Promise<string | null> {
    return new Promise((resolve, reject) => {
      this.auth.onAuthStateChanged(user => {
        if (user) {
          resolve(user.uid);
        } else {
          resolve(null);
        }
      }, reject);
    });
  }
}
