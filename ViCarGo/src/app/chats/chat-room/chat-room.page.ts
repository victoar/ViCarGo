import {Component, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {ChatService} from "../../services/chat.service";
import {Observable} from "rxjs";
import { IonContent } from '@ionic/angular';

@Component({
  selector: 'app-chat-room',
  templateUrl: './chat-room.page.html',
  styleUrls: ['./chat-room.page.scss'],
})
export class ChatRoomPage implements OnInit {

  public receiverFirstName: string;
  private chatRoomId: string;
  chats: Observable<any[]>;
  message: string;
  isLoading: boolean;

  @ViewChild(IonContent, { static: false }) content: IonContent;

  constructor(private activatedRoute: ActivatedRoute,
              public chatService: ChatService,
              private router: Router) { }

  ngOnInit() {
    this.activatedRoute.queryParams.subscribe(params => {
      this.receiverFirstName = params['firstName'];
      if(!params['chatId']) {
        this.router.navigate(['/landing/chats']);
        return;
      }
      this.chatRoomId = params['chatId'];

      this.chatService.getChatRoomMessages(this.chatRoomId);
      this.chats = this.chatService.selectedChatRoomMessages;
      console.log(this.chats);
    })
  }

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  scrollToBottom() {
    if(this.chats) {
      this.content.scrollToBottom(500);
    }
  }

  async sendMessage() {
    if(!this.message || this.message?.trim() == '') {
      // this.global.errorToast('Please enter a proper message', 2000);
      return;
    }
    try {
      this.isLoading = true;
      await this.chatService.sendMessage(this.chatRoomId, this.message);
      this.message = '';
      this.isLoading = false;
      this.scrollToBottom();
    } catch(e) {
      this.isLoading = false;
      console.log(e);
      // this.global.errorToast();
    }
  }

  getEmptyArrayMessage() {
    return `Say Hi to ${this.receiverFirstName}!`;
  }
}
