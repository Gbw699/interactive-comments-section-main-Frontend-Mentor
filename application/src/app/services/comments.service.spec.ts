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
import { signal, WritableSignal } from '@angular/core';

describe('CommentsService', () => {
  let service: CommentsService;
  let httpTestingController: any;
  let commentDateAdjustmentService: any;
  let mockUserService: any;
  let mockDataCurrentUser: ICurrentUser;
  let mockDataComments: IComment[];

  beforeEach(() => {
    mockUserService = jasmine.createSpyObj(['currentUser']);
    mockDataCurrentUser = data.currentUser;
    mockDataComments = data.comments;

    TestBed.configureTestingModule({
      providers: [
        CommentsService,
        provideHttpClient(),
        provideHttpClientTesting(),
        {
          provide: UserService,
          useValue: mockUserService,
        },
      ],
    });

    service = TestBed.inject(CommentsService);
    httpTestingController = TestBed.inject(HttpTestingController);
    commentDateAdjustmentService = TestBed.inject(CommentDateAdjustmentService);

    spyOn(localStorage, 'getItem').and.callFake((key: string) => {
      if (key === 'publishedComments') {
        return null;
      }
      return null;
    });
    spyOn(localStorage, 'setItem').and.stub();
  });

  afterEach(() => {
    service.publishedComments.set(undefined);
  });

  describe('fetchComments', () => {
    it('Should fetch comments from HTTP and update the signal when localStorage is empty', () => {
      service.fetchComments();

      httpTestingController
        .expectOne('http://localhost:4200/assets/data.json')
        .flush({ comments: mockDataComments });

      expect(service.publishedComments()).toEqual(
        commentDateAdjustmentService.adjustCreatedAtProperty(mockDataComments)
      );
      expect(localStorage.setItem).toHaveBeenCalledWith(
        'publishedComments',
        JSON.stringify(mockDataComments)
      );
    });

    it('Should load comments from localStorage if they exist', () => {
      (localStorage.getItem as jasmine.Spy).and.returnValue(
        JSON.stringify(mockDataComments)
      );

      service.fetchComments();

      expect(service.publishedComments()).toEqual(
        commentDateAdjustmentService.adjustCreatedAtProperty(mockDataComments)
      );
    });
  });

  describe('addComment', () => {
    it('Should add a new comment to the state', () => {
      mockUserService.currentUser.and.returnValue(mockDataCurrentUser);
      service.publishedComments.set(mockDataComments);

      expect(service.publishedComments()?.length).toBe(2);
      service.addComment('This comment is for testing add');

      expect(service.publishedComments()?.length).toBe(3);
      expect(service.publishedComments()?.[2].content).toBe(
        'This comment is for testing add'
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

      service.editComment(1, 'This comment is for testing edit1');

      expect(service.publishedComments()?.[0].content).toBe(
        'This comment is for testing edit1'
      );
      expect(localStorage.setItem).toHaveBeenCalledWith(
        'publishedComments',
        JSON.stringify(service.publishedComments())
      );
    });

    it('Should update the child comment identified by the given ID', () => {
      service.publishedComments.set(mockDataComments);

      service.editComment(4, 'This comment is for testing edit2');

      expect(service.publishedComments()?.[1].replies?.[1].content).toBe(
        'This comment is for testing edit2'
      );
      expect(localStorage.setItem).toHaveBeenCalledWith(
        'publishedComments',
        JSON.stringify(service.publishedComments())
      );
    });
  });

  describe('replyComment', () => {
    it('Should add a reply to a top-level comment', () => {
      service.publishedComments.set(mockDataComments);
      mockUserService.currentUser.and.returnValue(mockDataCurrentUser);

      service.replyComment(
        1,
        'amyrobson',
        'This comment is for testing reply1'
      );

      expect(service.publishedComments()?.[0].replies?.[0].replyingTo).toBe(
        'amyrobson'
      );
      expect(localStorage.setItem).toHaveBeenCalledWith(
        'publishedComments',
        JSON.stringify(service.publishedComments())
      );
    });

    it('If a reply is directed at another reply, it should be added to the top-level comment that serves as the parent of the original replied-to comment', () => {
      service.publishedComments.set(mockDataComments);
      mockUserService.currentUser.and.returnValue(mockDataCurrentUser);

      service.replyComment(
        3,
        'ramsesmiron',
        'This comment is for testing reply2'
      );

      expect(service.publishedComments()?.[1].replies?.[2].replyingTo).toBe(
        'ramsesmiron'
      );
      expect(localStorage.setItem).toHaveBeenCalledWith(
        'publishedComments',
        JSON.stringify(service.publishedComments())
      );
    });
  });
});
