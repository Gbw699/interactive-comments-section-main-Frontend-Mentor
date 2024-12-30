import { TestBed } from '@angular/core/testing';

import { CommentIdToReplyService } from './comment-id-to-reply.service';

describe('CommentIdToReplyService', () => {
  let service: CommentIdToReplyService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CommentIdToReplyService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
