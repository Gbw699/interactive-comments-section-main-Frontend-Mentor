import { TestBed } from '@angular/core/testing';

import { CommentDateAdjustmentService } from './comment-date-adjustment.service';

describe('CommentDateAdjustmentService', () => {
  let service: CommentDateAdjustmentService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CommentDateAdjustmentService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
