import { CommentsService } from './comments.service';
import { data } from '../../assets/data';
import { IComment } from '../../models/IComment';
import { defer, delay, Observable, of } from 'rxjs';
import { fakeAsync, tick } from '@angular/core/testing';

describe('CommentsService', () => {
  let mockHttpClient = jasmine.createSpyObj(['get']);
  let mockUserService = jasmine.createSpyObj(['currentUser']);
  // let mockLocalStorage = jasmine.createSpyObj(['getItem', 'setItem']);
  let mockDataComments: IComment[] = data.comments;
  let service: CommentsService;

  beforeEach(() => {
    localStorage.clear();
    service = new CommentsService(mockHttpClient, mockUserService);
  });

  describe('fetchComments', () => {
    it('If data is available in local storage, the state should be initialized using that information', () => {
      localStorage.setItem(
        'publishedComments',
        JSON.stringify(mockDataComments)
      );

      service.fetchComments();

      expect(mockHttpClient.get).not.toHaveBeenCalledWith(
        'http://localhost:4200/assets/data.json'
      );

      expect(service.publishedComments()).toEqual(
        adjustCreatedAtProperty(mockDataComments)
      );
    });

    it('If data is unavailable in local storage, the state should be initialized by making an HTTP request to retrieve the information from a local JSON file', (done: DoneFn) => {
      localStorage.clear();

      mockHttpClient.get.and.returnValue(asyncData(mockDataComments));

      service.fetchComments();

      setTimeout(() => {
       expect(service.publishedComments()).toEqual(adjustCreatedAtProperty(mockDataComments))
        done();
      });
    });
  });
});

function asyncData<T>(data: T) {
  return defer(() => Promise.resolve(data));
}

function adjustCreatedAtProperty(publishedComments: IComment[]) {
  publishedComments.forEach((element) => {
    element.replies?.forEach((chieldElement) => {
      chieldElement.createdAt = new Date(chieldElement.createdAt);
    });
    element.createdAt = new Date(element.createdAt);
  });

  return publishedComments;
}
