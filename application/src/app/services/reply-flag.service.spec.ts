import { TestBed } from '@angular/core/testing';

import { ReplyFlagService } from './reply-flag.service';

xdescribe('ReplyFlagService', () => {
  let service: ReplyFlagService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ReplyFlagService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
