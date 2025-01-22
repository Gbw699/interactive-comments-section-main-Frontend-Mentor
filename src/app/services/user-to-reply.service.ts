import { Injectable, signal, WritableSignal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class UserToReplyService {
  userToReply: WritableSignal<string> = signal('');

  constructor() {}

  setUserToReply(newUserToReply: string) {
    this.userToReply.set(newUserToReply);
  }
}
