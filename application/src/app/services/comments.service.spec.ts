import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';

import { IComment } from '../../models/IComment';

import { data } from '../../assets/data';

import { CommentDateAdjustmentService } from './comment-date-adjustment.service';
import { UserService } from './user.service';
import { CommentsService } from './comments.service';
import { ICurrentUser } from '../../models/ICurrentUser';

describe('CommentsService', () => {
  let service: CommentsService;
  let mockHttpClient: any;
  let mockCommentDateAdjustmentService: any;
  let mockUserService: any;
  let mockDataCurrentUser: ICurrentUser = data.currentUser;
  let mockDataComments: IComment[] = data.comments;

  beforeEach(() => {
    mockCommentDateAdjustmentService = jasmine.createSpyObj([
      'adjustCreatedAtProperty',
    ]);
    mockUserService = jasmine.createSpyObj(['currentUser']);

    TestBed.configureTestingModule({
      providers: [
        CommentsService,
        provideHttpClient(),
        provideHttpClientTesting(),
        {
          provide: CommentDateAdjustmentService,
          useValue: mockCommentDateAdjustmentService,
        },
        {
          provide: UserService,
          useValue: mockUserService,
        },
      ],
    });

    service = TestBed.inject(CommentsService);
    mockHttpClient = TestBed.inject(HttpTestingController);

    spyOn(localStorage, 'getItem').and.callFake((key: string) => {
      if (key === 'publishedComments') {
        return null;
      }
      return null;
    });
    spyOn(localStorage, 'setItem').and.stub();
  });

  describe('fetchComments', () => {
    it('Should fetch comments from HTTP and update the signal when localStorage is empty', () => {
      mockCommentDateAdjustmentService.adjustCreatedAtProperty.and.returnValue(
        mockDataComments
      );

      service.fetchComments();

      mockHttpClient
        .expectOne('http://localhost:4200/assets/data.json')
        .flush({ comments: mockDataComments });

      expect(
        mockCommentDateAdjustmentService.adjustCreatedAtProperty
      ).toHaveBeenCalledWith(mockDataComments);
      expect(service.publishedComments()).toEqual(mockDataComments);
      expect(localStorage.setItem).toHaveBeenCalledWith(
        'publishedComments',
        JSON.stringify(mockDataComments)
      );
    });

    it('Should load comments from localStorage if they exist', () => {
      (localStorage.getItem as jasmine.Spy).and.returnValue(
        JSON.stringify(mockDataComments)
      );
      mockCommentDateAdjustmentService.adjustCreatedAtProperty.and.returnValue(
        mockDataComments
      );

      service.fetchComments();

      expect(
        mockCommentDateAdjustmentService.adjustCreatedAtProperty
      ).toHaveBeenCalledWith(mockDataComments);
      expect(service.publishedComments()).toEqual(mockDataComments);
    });
  });

  describe('addComment', () => {
    it('Should add a new comment to the state', () => {
      mockUserService.currentUser.and.returnValue(mockDataCurrentUser);
      service.publishedComments.set(mockDataComments);

      expect(service.publishedComments()?.length).toBe(2);
      service.addComment('This comment is for testing');

      expect(service.publishedComments()?.length).toBe(3);
      expect(service.publishedComments()?.[2].content).toBe(
        'This comment is for testing'
      );
      expect(localStorage.setItem).toHaveBeenCalledWith(
        'publishedComments',
        JSON.stringify(service.publishedComments())
      );
    });
  });

  describe('editComment', () => {
    it('Should update the comment identified by the given ID', () => {
      service.publishedComments.set(mockDataComments);

      service.editComment(1, 'This comment is for testing');

      expect(service.publishedComments()?.[0].content).toBe(
        'This comment is for testing'
      );
      expect(localStorage.setItem).toHaveBeenCalledWith(
        'publishedComments',
        JSON.stringify(service.publishedComments())
      );
    });

    it('Should update the child comment identified by the given ID', () => {
      service.publishedComments.set(mockDataComments);

      service.editComment(4, 'This comment is for testing');

      expect(service.publishedComments()?.[1].replies?.[1].content).toBe(
        'This comment is for testing'
      );
      expect(localStorage.setItem).toHaveBeenCalledWith(
        'publishedComments',
        JSON.stringify(service.publishedComments())
      );
    });
  });
});
