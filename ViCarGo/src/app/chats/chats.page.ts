import { Component, OnInit } from '@angular/core';
import {Observable, take} from "rxjs";
import {ChatService} from "../services/chat.service";
import {NavigationExtras, Router} from "@angular/router";
import moment from "moment";

@Component({
  selector: 'app-chats',
  templateUrl: './chats.page.html',
  styleUrls: ['./chats.page.scss'],
})
export class ChatsPage implements OnInit {

  chatRooms: Observable<any[]>;


  constructor(private chatService: ChatService,
              private router: Router) { }

  ngOnInit() {
    this.getRooms();
  }

  getRooms() {
    // this.chatService.getId();
    this.chatService.getChatRooms();
    this.chatRooms = this.chatService.chatRooms;
    console.log('chatrooms: ', this.chatRooms);
  }

  getChat(item) {
    (item?.user).pipe(
      take(1)
    ).subscribe(user_data => {
      console.log('data: ', user_data);
      console.log(item);
      // this.router.navigate(['/', 'chat-room', item?.id], navData);
      this.router.navigate(['/chat-room'], {queryParams: {firstName: user_data?.firstName, chatId: item?.id}});
    });
  }

  getUser(user: any) {
    return user;
  }

  getLastUpdate(item) {
    const currentDate = moment();
    const messageTime = moment(item.updatedAt.toDate());

    if (messageTime.isSame(currentDate, 'day')) {
      // Mesajul este în ziua curentă
      return messageTime.format('HH:mm');
    } else if (messageTime.isSame(currentDate, 'week')) {
      // Mesajul este din săptămâna curentă
      return messageTime.format('ddd');
    } else if (messageTime.isSame(currentDate, 'year')) {
      // Mesajul este din acest an
      return messageTime.format('D MMM');
    } else {
      // Mesajul nu mai aparține anului curent
      return messageTime.format('YYYY');
    }
  }
}
