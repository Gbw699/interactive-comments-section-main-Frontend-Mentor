import { TestBed } from '@angular/core/testing';

import { UserService } from './user.service';
import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { data } from '../../assets/data';

describe('UserService', () => {
  let service: UserService;
  let httpTestingController: HttpTestingController;
  let mockData: any;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });

    service = TestBed.inject(UserService);
    httpTestingController = TestBed.inject(HttpTestingController);
    mockData = data;
  });

  describe('fetchCurrentUser', () => {
    it('Should retrieve the current user and store it in the current user state', () => {
      service.fetchCurrentUser();

      httpTestingController
        .expectOne('./assets/data.json')
        .flush(data);

      expect(service.currentUser()?.username).toBe('juliusomo');
    });
  });
});
