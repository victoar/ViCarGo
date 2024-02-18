import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { UserCarsPageRoutingModule } from './user-cars-routing.module';

import { UserCarsPage } from './user-cars.page';
import {SubComponentsModule} from "../../sub-components/sub-components.module";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    UserCarsPageRoutingModule,
    SubComponentsModule
  ],
  exports: [],
  declarations: [UserCarsPage]
})
export class UserCarsPageModule {}
