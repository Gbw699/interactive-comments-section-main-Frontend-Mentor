import { TestBed } from '@angular/core/testing';

import { EditFlagService } from './edit-flag.service';

describe('EditFlagService', () => {
  let service: EditFlagService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EditFlagService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
