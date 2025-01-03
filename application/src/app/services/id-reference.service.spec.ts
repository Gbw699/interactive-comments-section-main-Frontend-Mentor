import { TestBed } from '@angular/core/testing';

import { IdReferenceService } from './id-reference.service';

describe('IdReferenceService', () => {
  let service: IdReferenceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(IdReferenceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
