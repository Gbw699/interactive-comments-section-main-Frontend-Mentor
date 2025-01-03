import { Injectable, signal, WritableSignal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class IdReferenceService {
  idReference: WritableSignal<number | undefined> = signal(undefined);

  constructor() {}

  setIdReference(newId: number) {
    this.idReference.set(newId);
  }
}
