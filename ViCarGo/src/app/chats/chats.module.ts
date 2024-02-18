import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ChatsPageRoutingModule } from './chats-routing.module';

import { ChatsPage } from './chats.page';
import {UserCarsPageModule} from "../my-account/user-cars/user-cars.module";
import {SubComponentsModule} from "../sub-components/sub-components.module";

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        ChatsPageRoutingModule,
        SubComponentsModule
    ],
  declarations: [ChatsPage]
})
export class ChatsPageModule {}
