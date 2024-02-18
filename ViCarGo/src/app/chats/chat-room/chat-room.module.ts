import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ChatRoomPageRoutingModule } from './chat-room-routing.module';

import { ChatRoomPage } from './chat-room.page';
import {ChatItemComponent} from "../../sub-components/chat-item/chat-item.component";
import {UserCarsPageModule} from "../../my-account/user-cars/user-cars.module";
import {SubComponentsModule} from "../../sub-components/sub-components.module";

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        ChatRoomPageRoutingModule,
        SubComponentsModule
    ],
  declarations: [ChatRoomPage, ChatItemComponent]
})
export class ChatRoomPageModule {}
