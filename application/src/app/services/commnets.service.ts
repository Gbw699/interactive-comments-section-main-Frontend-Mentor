import { HttpClient } from '@angular/common/http';
import { Injectable, signal, WritableSignal } from '@angular/core';

import { IComment } from '../../models/IComment';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root',
})
export class CommnetsService {
  publishedCommnets: WritableSignal<IComment[] | undefined> = signal(undefined);

  constructor(private http: HttpClient, private user: UserService) {}

  fetchComments() {
    this.http
      .get('http://localhost:4200/assets/data.json')
      .subscribe((value: any) => {
        this.publishedCommnets.set([...value.comments]);
        console.log(this.publishedCommnets());
      });
  }

  addComment(comment: string) {
    let currentUser: any = this.user.currentUser()?.currentUser;
    let publishedCommnets: any = this.publishedCommnets();

    let newComment: IComment = {
      id: publishedCommnets[publishedCommnets?.length - 1].id + 1,
      content: comment,
      createdAt: '',
      score: 0,
      user: {
        image: {
          png: currentUser.image.png,
          webp: currentUser.image.webp,
        },
        username: currentUser.username,
      },
      replies: [],
    };

    let newPublishedComments: IComment[] = [...publishedCommnets, newComment];

    this.publishedCommnets.set([...newPublishedComments])
  }
}
