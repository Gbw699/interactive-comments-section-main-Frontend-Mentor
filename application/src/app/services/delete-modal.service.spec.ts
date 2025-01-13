import { TestBed } from '@angular/core/testing';

import { DeleteModalService } from './delete-modal.service';

xdescribe('DeleteModalService', () => {
  let service: DeleteModalService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DeleteModalService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
