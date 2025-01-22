import { Injectable, signal, WritableSignal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ReplyFlagService {
  replyFlag: WritableSignal<boolean> = signal(false);

  constructor() {}

  setReplyFlag(newFlag: boolean) {
    this.replyFlag.set(newFlag);
  }
}
