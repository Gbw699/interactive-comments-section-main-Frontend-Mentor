import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { IData } from '../models/IData';

import { CommentsService } from './services/comments.service';
import { UserService } from './services/user.service';
import { DeleteModalService } from './services/delete-modal.service';
import { ReplyFlagService } from './services/reply-flag.service';
import { EditFlagService } from './services/edit-flag.service';
import { IdReferenceService } from './services/id-reference.service';

import { data } from '../assets/data';

import { AppComponent } from './app.component';

import { CommentDateAdjustmentService } from './services/comment-date-adjustment.service';

describe('AppComponent', () => {
  let mockCommentsService: any;
  let mockUserService: any;
  let mockDeleteModalService: any;
  let mockReplyFlagService: any;
  let mockEditFlagService: any;
  let mockIdReferenceService: any;
  let mockData: IData = data;
  let fixture: ComponentFixture<AppComponent>;
  let component: AppComponent;

  beforeEach(async () => {
    mockCommentsService = jasmine.createSpyObj([
      'publishedComments',
      'fetchComments',
    ]);
    mockUserService = jasmine.createSpyObj(['currentUser', 'fetchCurrentUser']);
    mockDeleteModalService = jasmine.createSpyObj([
      'commentIdToDelete',
      'setCommentIdToDelete',
    ]);
    mockReplyFlagService = jasmine.createSpyObj(['replyFlag']);
    mockEditFlagService = jasmine.createSpyObj(['editFlag']);
    mockIdReferenceService = jasmine.createSpyObj(['idReference']);

    await TestBed.configureTestingModule({
      imports: [AppComponent],
      providers: [
        { provide: CommentsService, useValue: mockCommentsService },
        { provide: UserService, useValue: mockUserService },
        { provide: DeleteModalService, useValue: mockDeleteModalService },
        { provide: ReplyFlagService, useValue: mockReplyFlagService },
        { provide: EditFlagService, useValue: mockEditFlagService },
        { provide: IdReferenceService, useValue: mockIdReferenceService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;

    let commentDateAdjusmentService = new CommentDateAdjustmentService();

    mockCommentsService.publishedComments.and.returnValue(
      commentDateAdjusmentService.adjustCreatedAtProperty(mockData.comments)
    );
    mockDeleteModalService.commentIdToDelete.and.returnValue(undefined);
    mockReplyFlagService.replyFlag.and.returnValue(false);
    mockEditFlagService.editFlag.and.returnValue(true);
    mockIdReferenceService.idReference.and.returnValue(1);
  });

  describe('ngOnInit', () => {
    it('Should fetch comments and user on initialization', () => {
      fixture.detectChanges();

      expect(mockCommentsService.fetchComments).toHaveBeenCalled();
      expect(mockUserService.fetchCurrentUser).toHaveBeenCalled();
      expect(mockIdReferenceService.idReference).toHaveBeenCalled();
    });
  });

  describe('closeModal', () => {
    it('Should close modal when clicking outside of modal', () => {
      mockDeleteModalService.commentIdToDelete.and.returnValue(1);
      fixture.detectChanges();
      let modalContainer = fixture.debugElement.query(
        By.css('.modal-container')
      );

      modalContainer.triggerEventHandler('click', {
        clientX: 30,
        clientY: 500,
      });
      expect(mockDeleteModalService.setCommentIdToDelete).toHaveBeenCalled();
    });
  });
});
