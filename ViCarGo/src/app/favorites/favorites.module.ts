import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FavoritesPageRoutingModule } from './favorites-routing.module';

import { FavoritesPage } from './favorites.page';
import {UserCarsPageModule} from "../my-account/user-cars/user-cars.module";
import {SubComponentsModule} from "../sub-components/sub-components.module";

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        FavoritesPageRoutingModule,
        SubComponentsModule
    ],
  declarations: [FavoritesPage]
})
export class FavoritesPageModule {}
