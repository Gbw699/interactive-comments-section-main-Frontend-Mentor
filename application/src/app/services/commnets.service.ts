import { HttpClient } from '@angular/common/http';
import { Injectable, signal, WritableSignal } from '@angular/core';

import { IComment } from '../../models/IComment';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root',
})
export class CommnetsService {
  publishedComments: WritableSignal<IComment[] | undefined> = signal(undefined);

  constructor(private http: HttpClient, private user: UserService) {}

  fetchComments() {
    this.http
      .get('http://localhost:4200/assets/data.json')
      .subscribe((value: any) => {
        this.publishedComments.set([...value.comments]);
        console.log(this.publishedComments());
      });
  }

  addComment(comment: string) {
    let currentUser: any = this.user.currentUser()?.currentUser;
    let publishedComments: any = this.publishedComments();
    let lastId = this.getLastId(publishedComments);

    let newComment: IComment = {
      id: lastId + 1,
      content: comment,
      createdAt: new Date().toLocaleDateString('en-US', {
        day: '2-digit',
        weekday: 'short',
        month: 'short',
        year: 'numeric',
      }),
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

    let newPublishedComments: IComment[] = [...publishedComments, newComment];

    this.publishedComments.set([...newPublishedComments]);
  }

  editComment(id: number | undefined, comment: string) {
    let publishedComments: any = this.publishedComments();

    let newPublishedComments: IComment[] = [...publishedComments];

    newPublishedComments.forEach((element) => {
      element.replies?.forEach((childElement) => {
        if (childElement.id === id) {
          childElement.content = comment;
        }
      });
      if (element.id === id) {
        element.content = comment;
      }
    });

    this.publishedComments.set([...newPublishedComments]);
  }

  replyComment(
    id: number | undefined,
    userToReply: string | undefined,
    comment: string
  ) {
    let currentUser: any = this.user.currentUser()?.currentUser;
    let publishedComments: any = this.publishedComments();
    let lastId = this.getLastId(publishedComments);

    let newReplyComment: IComment = {
      id: lastId + 1,
      content: comment,
      createdAt: new Date().toLocaleDateString('en-US', {
        day: '2-digit',
        weekday: 'short',
        month: 'short',
        year: 'numeric',
      }),
      score: 0,
      replyingTo: userToReply,
      user: {
        image: {
          png: currentUser.image.png,
          webp: currentUser.image.webp,
        },
        username: currentUser.username,
      },
    };

    let newPublishedComments: IComment[] = [...publishedComments];

    newPublishedComments.forEach((element) => {
      if (element.id === id) {
        element.replies = [
          ...(element.replies ? element.replies : []),
          newReplyComment,
        ];
      }
    });

    this.publishedComments.set([...newPublishedComments]);
  }

  deleteComment(id: number) {
    let publishedComments: any = this.publishedComments();

    let newPublishedComments: IComment[] = publishedComments.filter(
      (comment: IComment) => {
        comment.replies = comment.replies?.filter((chieldComment: IComment) => {
          return chieldComment.id !== id;
        });
        return comment.id !== id;
      }
    );

    this.publishedComments.set([...newPublishedComments]);
  }

  private getLastId(publishedComments: IComment[]) {
    let lastKnownId: number = 0;

    publishedComments.forEach((element) => {
      element.replies?.forEach((chieldElement) => {
        if (chieldElement.id > lastKnownId) {
          lastKnownId = chieldElement.id;
        }
      });
      if (element.id > lastKnownId) {
        lastKnownId = element.id;
      }
    });

    return lastKnownId;
  }
}
