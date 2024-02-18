import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import {initializeApp, provideFirebaseApp} from "@angular/fire/app";
import {environment} from "../environments/environment";
import {getAuth, provideAuth} from "@angular/fire/auth";
import {FirestoreModule, getFirestore, provideFirestore} from "@angular/fire/firestore";
import {getStorage, provideStorage} from "@angular/fire/storage";
import {LocationAccuracy} from "@awesome-cordova-plugins/location-accuracy/ngx";
import {NativeGeocoder} from "@awesome-cordova-plugins/native-geocoder/ngx";
import {SubComponentsModule} from "./sub-components/sub-components.module";
import {FIREBASE_OPTIONS} from "@angular/fire/compat";
import {IonicStorageModule} from "@ionic/storage-angular";
import {HttpClientModule} from "@angular/common/http";


@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),
    provideStorage(() => getStorage()),
    SubComponentsModule,
    FirestoreModule,
    IonicStorageModule.forRoot(),
    HttpClientModule
  ],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    LocationAccuracy,
    NativeGeocoder,
    {provide: FIREBASE_OPTIONS, useValue: environment.firebase}
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
