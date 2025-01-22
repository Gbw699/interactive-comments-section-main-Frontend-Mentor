import { Injectable, signal, WritableSignal } from '@angular/core';
import { ICurrentUser } from '../../models/ICurrentUser';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  currentUser: WritableSignal<ICurrentUser | undefined> = signal(undefined);

  constructor(private http: HttpClient) {}

  fetchCurrentUser() {
    this.http
      // .get('http://localhost:4200/assets/data.json')
      .get('./assets/data.json')
      .subscribe((value: any) => {
        this.currentUser.set({ ...value.currentUser });
      });
  }
}
