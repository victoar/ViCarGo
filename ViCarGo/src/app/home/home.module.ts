import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { HomePage } from './home.page';

import { HomePageRoutingModule } from './home-routing.module';
import {CarItemComponent} from "../sub-components/car-item/car-item.component";
import {SubComponentsModule} from "../sub-components/sub-components.module";


@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        HomePageRoutingModule,
        SubComponentsModule
    ],
    declarations: [HomePage, CarItemComponent]
})
export class HomePageModule {}
