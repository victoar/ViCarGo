import { Injectable } from '@angular/core';
import {AuthService} from "./auth.service";
import {AngularFirestore, CollectionReference, QueryFn} from "@angular/fire/compat/firestore";
import {ApiService} from "./api.service";
import {map, Observable, of, switchMap} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  public currentUserId: string;
  public chatRooms: Observable<any>;
  public selectedChatRoomMessages: Observable<any>;

  constructor(private authService: AuthService,
              private apiService: ApiService,
              private firestore: AngularFirestore

  ) {
    // this.authService.getCurrentUserId().then(userId => {
    //   this.currentUserId;
    // })
  }

  getId() {
    console.log(this.currentUserId);
    this.currentUserId = this.authService.getId();
  }

  async createChatRoom(ownerId) {
    try {
      this.getId();
      let room: any;
      const querySnapshot = await this.apiService.getDocs(
        'chatRooms',
        this.apiService.whereQuery(
          'members',
          'in',
          [[this.currentUserId, ownerId], [ownerId, this.currentUserId]]
        )
      );
      room = querySnapshot.docs.map((doc: any) => {
        let item = doc.data();
        item.id = doc.id;
        return item;
      });
      console.log('exist docs: ', room);
      if(room?.length > 0) return room[0];
      const data = {
        members: [
          this.currentUserId,
          ownerId
        ],
        type: 'private',
        createdAt: new Date(),
        updatedAt: new Date(),
        id: this.firestore.createId()
      };
      room = await this.firestore.collection('chatRooms').doc(data.id).set(data);
      return room;
    } catch (e) {
      throw(e);
    }
  }

  getChatRooms() {
    this.getId();
    console.log(this.currentUserId);
    const queryFn: QueryFn = (ref: CollectionReference) => {
      return ref
        .where('members', 'array-contains', this.currentUserId)
        .orderBy('updatedAt', 'desc');
    };
    this.chatRooms = this.firestore.collection('chatRooms', queryFn)
      .valueChanges()
      .pipe(
        map((data: any[]) => {
          console.log('room data: ', data);
          data.map((element) => {
            console.log(element.id)
            const user_data = element.members.filter(x => x != this.currentUserId);
            console.log(user_data);
            const user = this.apiService.docDataQuery(`users/${user_data[0]}`, true);
            // const user: any = this.api.getDocById(`users/${user_data[0]}`);
            element.user = user;
          });
          return (data);
        }),
        switchMap(data => {
          return of(data);
        })
      );
  }

  getChatRoomMessages(chatRoomId) {
    const queryFn: QueryFn = (ref: CollectionReference) => {
      return ref
        .orderBy('createdAt', 'desc');
    };
    this.selectedChatRoomMessages = this.firestore.collection(`chats/${chatRoomId}/messages`, queryFn)
      .valueChanges()
      .pipe(map((arr: any) => arr.reverse()));
  }

  async sendMessage(chatId, msg) {
    try {
      const new_message = {
        message: msg,
        sender: this.currentUserId,
        createdAt: new Date()
      };
      console.log(chatId);
      if(chatId) {
        await this.firestore.collection(`chats/${chatId}/messages`).add(new_message);
        await this.firestore.collection('chatRooms').doc(chatId).update({ updatedAt: new Date(), lastMessage: msg })
      }
    } catch(e) {
      throw(e);
    }
  }

}
