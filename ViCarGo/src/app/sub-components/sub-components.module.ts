import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { CarDetailsModalComponent } from './car-details-modal/car-details-modal.component';
import {SaveCarModalComponent} from "./save-car-modal/save-car-modal.component";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {GooglePlaceModule} from "ngx-google-places-autocomplete";
import {FilterModalComponent} from "./filter-modal/filter-modal.component";
import {SkeletonTextLargeCarItemComponent} from "./skeleton-text-large-car-item/skeleton-text-large-car-item.component";
import {ReservationModalComponent} from "./reservation-modal/reservation-modal.component";
import {CarReservationItemComponent} from "./car-reservation-item/car-reservation-item.component";
import {WriteReviewModalComponent} from "./write-review-modal/write-review-modal.component";
import {EmptyArrayItemComponent} from "./empty-array-item/empty-array-item.component";
import {LargeCarItemComponent} from "./large-car-item/large-car-item.component";
import {ReadReviewsModalComponent} from "./read-reviews-modal/read-reviews-modal.component";
import {ReadReviewCardComponent} from "./read-review-card/read-review-card.component";
import {SkeletonTextCarItemComponent} from "./skeleton-text-car-item/skeleton-text-car-item.component";
// import other sub-components here

@NgModule({
  declarations: [
    CarDetailsModalComponent,
    SaveCarModalComponent,
    FilterModalComponent,
    SkeletonTextLargeCarItemComponent,
    ReservationModalComponent,
    CarReservationItemComponent,
    WriteReviewModalComponent,
    EmptyArrayItemComponent,
    LargeCarItemComponent,
    ReadReviewsModalComponent,
    ReadReviewCardComponent,
    SkeletonTextCarItemComponent
    // declare other sub-components here
  ],
  imports: [
    CommonModule,
    IonicModule,
    ReactiveFormsModule,
    FormsModule,
    GooglePlaceModule
  ],
  exports: [
    CarDetailsModalComponent,
    SaveCarModalComponent,
    FilterModalComponent,
    SkeletonTextLargeCarItemComponent,
    ReservationModalComponent,
    CarReservationItemComponent,
    WriteReviewModalComponent,
    EmptyArrayItemComponent,
    LargeCarItemComponent,
    ReadReviewsModalComponent,
    ReadReviewCardComponent,
    SkeletonTextCarItemComponent
    // export other sub-components here
  ]
})
export class SubComponentsModule { }
