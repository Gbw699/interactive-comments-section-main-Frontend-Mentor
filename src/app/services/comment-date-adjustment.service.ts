import { Injectable } from '@angular/core';
import { IComment } from '../../models/IComment';

@Injectable({
  providedIn: 'root',
})
export class CommentDateAdjustmentService {
  constructor() {}

  adjustCreatedAtProperty(publishedComments: IComment[]) {
    publishedComments.forEach((element) => {
      element.replies?.forEach((chieldElement) => {
        chieldElement.createdAt = new Date(chieldElement.createdAt);
      });
      element.createdAt = new Date(element.createdAt);
    });

    return publishedComments;
  }
}
