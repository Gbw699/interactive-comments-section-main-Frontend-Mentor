import { IComment } from '../../models/IComment';

import { data } from '../../assets/data';

import { CommentDateAdjustmentService } from './comment-date-adjustment.service';

describe('CommentDateAdjustmentService', () => {
  let service: CommentDateAdjustmentService;
  let mockDataComments: IComment[];

  beforeEach(() => {
    mockDataComments = data.comments;

    service = new CommentDateAdjustmentService();
  });

  describe('adjustCreatedAtProperty', () => {
    it('Should convert the createdAt property of each comment to a Date object format', () => {
      let result = service.adjustCreatedAtProperty(mockDataComments);

      expect(result[0].createdAt.getFullYear()).toBe(2024);
      expect(result[1].replies[1].createdAt.getFullYear()).toBe(2025);
    });
  });
});
