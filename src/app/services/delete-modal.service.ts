import { Injectable, signal, WritableSignal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class DeleteModalService {
  commentIdToDelete: WritableSignal<number | undefined> = signal(undefined);

  constructor() {}

  setCommentIdToDelete(idToDelete: number |undefined) {
    this.commentIdToDelete.set(idToDelete);
  }
}
