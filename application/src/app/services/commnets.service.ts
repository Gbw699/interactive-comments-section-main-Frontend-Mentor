import { HttpClient } from '@angular/common/http';
import { Injectable, signal, WritableSignal } from '@angular/core';

import { IComments } from '../../models/IComments';

@Injectable({
  providedIn: 'root',
})
export class CommnetsService {
  private commnets: WritableSignal<IComments[] | undefined> = signal(undefined);

  constructor(private http: HttpClient) {}

  getComments() {
    this.http
      .get('http://localhost:4200/assets/data.json')
      .subscribe((value: any) => {
        this.commnets.set(value.comments);
        console.log(this.commnets());
        
      });
  }
}
