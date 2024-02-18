import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { UserCarRequestsPageRoutingModule } from './user-car-requests-routing.module';

import { UserCarRequestsPage } from './user-car-requests.page';
import {SubComponentsModule} from "../../sub-components/sub-components.module";

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        UserCarRequestsPageRoutingModule,
        SubComponentsModule
    ],
  declarations: [UserCarRequestsPage]
})
export class UserCarRequestsPageModule {}
