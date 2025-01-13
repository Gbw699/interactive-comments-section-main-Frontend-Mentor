import { TestBed } from '@angular/core/testing';

import { UserToReplyService } from './user-to-reply.service';

xdescribe('UserToReplyService', () => {
  let service: UserToReplyService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserToReplyService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
