import { Injectable, signal, WritableSignal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class EditFlagService {
  editFlag: WritableSignal<boolean> = signal(false);

  constructor() {}

  setEditFlag(newFlag: boolean) {
    this.editFlag.set(newFlag);
  }
}
