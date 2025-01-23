import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';

import { IComment } from '../../models/IComment';
import { ICurrentUser } from '../../models/ICurrentUser';

import { data } from '../../assets/data';

import { CommentDateAdjustmentService } from './comment-date-adjustment.service';
import { UserService } from './user.service';
import { CommentsService } from './comments.service';

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
    mockDataComments = data.comments.sort((comment1: any, comment2: any) => {
      return comment2.score - comment1.score;
    });

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
        .expectOne('./assets/data.json')
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

      expect(service.publishedComments()?.length).toBe(4);
      service.addComment('This comment is for testing add');

      expect(service.publishedComments()?.length).toBe(5);
      expect(service.publishedComments()?.[4].content).toBe(
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

      expect(service.publishedComments()?.[1].content).toBe(
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

      expect(service.publishedComments()?.[0].replies?.[1].content).toBe(
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

      expect(service.publishedComments()?.[1].replies?.[0].replyingTo).toBe(
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

      expect(service.publishedComments()?.[0].replies?.[2].replyingTo).toBe(
        'ramsesmiron'
      );
      expect(localStorage.setItem).toHaveBeenCalledWith(
        'publishedComments',
        JSON.stringify(service.publishedComments())
      );
    });
  });

  describe('deleteComment', () => {
    it('Should delete the comment identified by the given ID ', () => {
      service.publishedComments.set(mockDataComments);

      service.deleteComment(5);

      let result: any = service
        .publishedComments()
        ?.some((element: IComment) => {
          element.replies.some((chieldElement: IComment) => {
            return chieldElement.id === 5 ? true : false;
          });
          return element.id === 5 ? true : false;
        });

      expect(result).toBe(false);
      expect(localStorage.setItem).toHaveBeenCalledWith(
        'publishedComments',
        JSON.stringify(service.publishedComments())
      );
    });

    it('Should delete the child comment identified by the given ID', () => {
      service.publishedComments.set(mockDataComments);

      service.deleteComment(7);

      let result: any = service
        .publishedComments()
        ?.some((element: IComment) => {
          element.replies.some((chieldElement: IComment) => {
            return chieldElement.id === 7 ? true : false;
          });
          return element.id === 7 ? true : false;
        });

      expect(result).toBe(false);
      expect(localStorage.setItem).toHaveBeenCalledWith(
        'publishedComments',
        JSON.stringify(service.publishedComments())
      );
    });
  });

  describe('manageScore', () => {
    it("Should increase the total score by 1 when the action is 'add'.", () => {
      service.publishedComments.set(mockDataComments);

      service.manageScore(1, 'add', 'add');

      expect(service.publishedComments()?.[1].score).toBe(13);
      expect(service.publishedComments()?.[1].lastScoreInstruction).toBe('add');

      service.manageScore(4, 'add', 'remove');

      expect(service.publishedComments()?.[0].replies[1].score).toBe(3);
      expect(
        service.publishedComments()?.[0].replies[1].lastScoreInstruction
      ).toBe('remove');

      service.manageScore(4, 'null', 'remove');
      expect(service.publishedComments()?.[0].replies[1].score).toBe(3);
    });

    it("Should decrease the total score by 1 when the action is 'remove'.", () => {
      service.publishedComments.set(mockDataComments);

      service.manageScore(2, 'remove', 'remove');

      expect(service.publishedComments()?.[0].score).toBe(14);
      expect(service.publishedComments()?.[0].lastScoreInstruction).toBe(
        'remove'
      );

      service.manageScore(3, 'remove', 'add');

      expect(service.publishedComments()?.[0].replies[0].score).toBe(3);
      expect(
        service.publishedComments()?.[0].replies[0].lastScoreInstruction
      ).toBe('add');

      service.manageScore(2, 'null', 'remove');

      expect(service.publishedComments()?.[0].score).toBe(14);
    });
  });
});
