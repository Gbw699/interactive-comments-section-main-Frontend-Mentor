import { TestBed } from '@angular/core/testing';

import { ReplyFlagService } from './reply-flag.service';

describe('ReplyFlagService', () => {
  let service: ReplyFlagService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ReplyFlagService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
