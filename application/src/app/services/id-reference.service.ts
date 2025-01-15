import { Injectable, signal, WritableSignal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class IdReferenceService {
  idReference: WritableSignal<number> = signal(0);

  constructor() {}

  setIdReference(newId: number) {
    this.idReference.set(newId);
  }
}
