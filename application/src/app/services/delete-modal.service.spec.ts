import { TestBed } from '@angular/core/testing';

import { DeleteModalService } from './delete-modal.service';

describe('DeleteModalService', () => {
  let service: DeleteModalService;

  beforeEach(() => {
    service = new DeleteModalService();
  });

  describe('setCommentIdToDelete', () => {
    it('Should update the delete state with the ID of the comment to be deleted', () => {
      service.setCommentIdToDelete(3);

      expect(service.commentIdToDelete()).toBe(3);
    });
  });
});
