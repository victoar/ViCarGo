import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SearchCarsPageRoutingModule } from './search-cars-routing.module';

import { SearchCarsPage } from './search-cars.page';
import {GooglePlaceModule} from "ngx-google-places-autocomplete";
import {UserCarsPageModule} from "../my-account/user-cars/user-cars.module";
import {SubComponentsModule} from "../sub-components/sub-components.module";

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        SearchCarsPageRoutingModule,
        GooglePlaceModule,
        SubComponentsModule
    ],
  declarations: [SearchCarsPage]
})
export class SearchCarsPageModule {}
