import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { CarDetailsModalComponent } from './car-details-modal/car-details-modal.component';
import {SaveCarModalComponent} from "./save-car-modal/save-car-modal.component";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
// import other sub-components here

@NgModule({
  declarations: [
    CarDetailsModalComponent,
    SaveCarModalComponent
    // declare other sub-components here
  ],
  imports: [
    CommonModule,
    IonicModule,
    ReactiveFormsModule,
    FormsModule,
  ],
  exports: [
    CarDetailsModalComponent,
    SaveCarModalComponent
    // export other sub-components here
  ]
})
export class SubComponentsModule { }
