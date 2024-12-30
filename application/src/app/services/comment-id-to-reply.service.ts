import { Injectable, signal, WritableSignal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class CommentIdToReplyService {
  commentIdToReply: WritableSignal<number | undefined> = signal(undefined);

  constructor() {}

  setCommentIdToReply(commentIdToReply: number) {
    this.commentIdToReply.set(commentIdToReply);
    debugger
  }
}
