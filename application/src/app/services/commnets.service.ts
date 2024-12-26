import { HttpClient } from '@angular/common/http';
import { Injectable, signal, WritableSignal } from '@angular/core';

import { IComment } from '../../models/IComment';

@Injectable({
  providedIn: 'root',
})
export class CommnetsService {
  publishedCommnets: WritableSignal<IComment[] | undefined> = signal(undefined);

  constructor(private http: HttpClient) {}

  getComments() {
    this.http
      .get('http://localhost:4200/assets/data.json')
      .subscribe((value: any) => {
        this.publishedCommnets.set([...value.comments]);
        console.log(this.publishedCommnets());
      });
  }
}
