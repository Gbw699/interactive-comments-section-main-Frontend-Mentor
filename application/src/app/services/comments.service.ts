import { HttpClient } from '@angular/common/http';
import { Injectable, signal, WritableSignal } from '@angular/core';

import { IComment } from '../../models/IComment';

import { UserService } from './user.service';

@Injectable({
  providedIn: 'root',
})
export class CommentsService {
  publishedComments: WritableSignal<IComment[] | undefined> = signal(undefined);

  constructor(private http: HttpClient, private user: UserService) {}

  fetchComments() {
    let publishedCommentsInStorageJson: any =
      localStorage.getItem('publishedComments');
    let publishedCommentsInStorageObject: IComment[] = JSON.parse(
      publishedCommentsInStorageJson
    );

    if (publishedCommentsInStorageObject !== null) {
      publishedCommentsInStorageObject = this.adjustCreatedAtProperty(
        publishedCommentsInStorageObject
      );
      this.publishedComments.set([...publishedCommentsInStorageObject]);
    } else {
      this.http
        .get('http://localhost:4200/assets/data.json')
        .subscribe((value: any) => {
          value.comments = this.adjustCreatedAtProperty(value.comments);

          this.publishedComments.set([...value.comments]);
          localStorage.setItem(
            'publishedComments',
            JSON.stringify([...value.comments])
          );
          console.log(this.publishedComments());
        });
    }
  }

  addComment(comment: string) {
    let currentUser: any = this.user.currentUser()?.currentUser;
    let publishedComments: any = this.publishedComments();
    let lastId = this.getLastId(publishedComments);

    let newComment: IComment = {
      id: lastId + 1,
      content: comment,
      createdAt: new Date(),
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
    localStorage.setItem(
      'publishedComments',
      JSON.stringify([...newPublishedComments])
    );
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
    localStorage.setItem(
      'publishedComments',
      JSON.stringify([...newPublishedComments])
    );
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
      createdAt: new Date(),
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
    let parentId: number;

    newPublishedComments.forEach((element) => {
      element.replies?.forEach((chieldElement) => {
        if (chieldElement.id === id) {
          parentId = element.id;
        }
      });
      if (element.id === id) {
        parentId = element.id;
      }
    });

    newPublishedComments.forEach((element) => {
      if (element.id === parentId) {
        element.replies = [
          ...(element.replies ? element.replies : []),
          newReplyComment,
        ];
      }
    });

    this.publishedComments.set([...newPublishedComments]);
    localStorage.setItem(
      'publishedComments',
      JSON.stringify([...newPublishedComments])
    );
  }

  deleteComment(id: number | undefined) {
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
    localStorage.setItem(
      'publishedComments',
      JSON.stringify([...newPublishedComments])
    );
  }

  manageScore(id: number | undefined, instruction: string) {
    let publishedComments: any = this.publishedComments();

    publishedComments.forEach((element: IComment) => {
      element.replies?.forEach((childElement) => {
        if (childElement.id === id) {
          switch (instruction) {
            case 'add':
              childElement.score = childElement.score + 1;
              break;
            case 'remove':
              childElement.score = childElement.score - 1;
              break;
            default:
              break;
          }
          childElement.lastScoreInstruction = instruction;
        }
      });
      if (element.id === id) {
        switch (instruction) {
          case 'add':
            element.score = element.score + 1;
            break;
          case 'remove':
            element.score = element.score - 1;
            break;
          default:
            break;
        }
        element.lastScoreInstruction = instruction;
      }
    });

    this.publishedComments.set([...publishedComments]);
    localStorage.setItem(
      'publishedComments',
      JSON.stringify([...publishedComments])
    );
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

  private adjustCreatedAtProperty(publishedComments: IComment[]) {
    publishedComments.forEach((element) => {
      element.replies?.forEach((chieldElement) => {
        chieldElement.createdAt = new Date(chieldElement.createdAt);
      });
      element.createdAt = new Date(element.createdAt);
    });

    return publishedComments;
  }
}
