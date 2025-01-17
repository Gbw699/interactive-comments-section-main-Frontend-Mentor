import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { data } from '../../../assets/data';

import { UserService } from '../../services/user.service';
import { CommentsService } from '../../services/comments.service';
import { UserToReplyService } from '../../services/user-to-reply.service';
import { IdReferenceService } from '../../services/id-reference.service';
import { ReplyFlagService } from '../../services/reply-flag.service';
import { EditFlagService } from '../../services/edit-flag.service';
import { DeleteModalService } from '../../services/delete-modal.service';

import { CommentsCardComponent } from './comments-card.component';

describe('CommentsCardComponent', () => {
  let mockUserService: any;
  let mockCommentsService: any;
  let mockUserToReplyService: any;
  let mockIdReferenceService: any;
  let mockReplyFlagService: any;
  let mockDeleteModalService: any;
  let mockData: any;
  let mockEditFlagService: any;
  let component: CommentsCardComponent;
  let fixture: ComponentFixture<CommentsCardComponent>;

  beforeEach(async () => {
    mockUserService = jasmine.createSpyObj(['currentUser']);
    mockCommentsService = jasmine.createSpyObj(['manageScore']);
    mockUserToReplyService = jasmine.createSpyObj(['setUserToReply']);
    mockIdReferenceService = jasmine.createSpyObj(['setIdReference']);
    mockReplyFlagService = jasmine.createSpyObj(['setReplyFlag']);
    mockEditFlagService = jasmine.createSpyObj(['setEditFlag']);
    mockDeleteModalService = jasmine.createSpyObj(['setCommentIdToDelete']);
    mockData = data;

    await TestBed.configureTestingModule({
      imports: [CommentsCardComponent],
      providers: [
        { provide: UserService, useValue: mockUserService },
        { provide: CommentsService, useValue: mockCommentsService },
        { provide: UserToReplyService, useValue: mockUserToReplyService },
        { provide: IdReferenceService, useValue: mockIdReferenceService },
        { provide: ReplyFlagService, useValue: mockReplyFlagService },
        { provide: EditFlagService, useValue: mockEditFlagService },
        { provide: DeleteModalService, useValue: mockDeleteModalService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CommentsCardComponent);
    fixture.componentRef.setInput('comment', {
      id: 2,
      content: 'content of the mock test',
      createdAt: new Date(),
      score: 0,
      user: {
        image: {
          png: '',
          webp: '',
        },
        username: 'juliusomo',
      },
      replies: [],
    });
    fixture.componentRef.setInput('parentId', 1);
    fixture.componentRef.setInput('lastScoreInstruction', undefined);
    component = fixture.componentInstance;
    mockUserService.currentUser.and.returnValue(mockData.currentUser);
  });

  describe('setStatesToEdit', () => {
    it('Should set the global states to update a comment', () => {
      fixture.detectChanges();
      let editBtn = fixture.debugElement.queryAll(By.css('.crud-btn'))[1];

      editBtn.triggerEventHandler('click');

      expect(mockIdReferenceService.setIdReference).toHaveBeenCalledWith(2);
      expect(mockEditFlagService.setEditFlag).toHaveBeenCalledWith(true);
      expect(mockReplyFlagService.setReplyFlag).toHaveBeenCalledWith(false);
    });
  });

  describe('deleteComment', () => {
    it('Should set a global state to delete a comment', () => {
      fixture.detectChanges();
      let editBtn = fixture.debugElement.queryAll(By.css('.crud-btn'))[0];

      editBtn.triggerEventHandler('click');

      expect(mockDeleteModalService.setCommentIdToDelete).toHaveBeenCalledWith(
        2
      );
    });
  });

  describe('setStatesToReply', () => {
    it('Should set the global states to reply a comment', () => {
      fixture.componentRef.setInput('comment', {
        id: 2,
        content: 'content of the mock test',
        createdAt: new Date(),
        score: 0,
        user: {
          image: {
            png: '',
            webp: '',
          },
          username: 'amyrobson',
        },
        replies: [],
      });
      fixture.detectChanges();
      let editBtn = fixture.debugElement.queryAll(By.css('.crud-btn'))[0];

      editBtn.triggerEventHandler('click');

      expect(mockIdReferenceService.setIdReference).toHaveBeenCalledWith(2);
      expect(mockUserToReplyService.setUserToReply).toHaveBeenCalledWith(
        'amyrobson'
      );
      expect(mockEditFlagService.setEditFlag).toHaveBeenCalledWith(false);
      expect(mockReplyFlagService.setReplyFlag).toHaveBeenCalledWith(true);
    });
  });

  describe('manageScore', () => {
    describe('add', () => {
      it('Should call manageScore with correct parameters when lastScoreInstruction is undefined', () => {
        fixture.detectChanges();
        let plusBtn = fixture.debugElement.query(By.css('.plus-btn'));

        plusBtn.triggerEventHandler('click');

        let isBtnSelected =
          plusBtn.nativeNode.classList.contains('btn-selected');

        expect(mockCommentsService.manageScore).toHaveBeenCalledWith(
          2,
          'add',
          'add'
        );
        expect(component.lastScoreInstructionSignal()).toBe('add');
        expect(isBtnSelected).toBe(true);
      });

      it('Should call manageScore with correct parameters when lastScoreInstruction is not undefined and is the same as the new instruction', () => {
        fixture.componentRef.setInput('lastScoreInstruction', 'add');
        fixture.detectChanges();
        let plusBtn = fixture.debugElement.query(By.css('.plus-btn'));

        plusBtn.triggerEventHandler('click');

        let isBtnSelected =
          plusBtn.nativeNode.classList.contains('btn-selected');

        expect(mockCommentsService.manageScore).toHaveBeenCalledWith(
          2,
          'remove',
          undefined
        );
        expect(component.lastScoreInstructionSignal()).toBe(undefined);
        expect(isBtnSelected).toBe(false);
      });

      it('Should call manageScore with correct parameters when lastScoreInstruction is not undefined and is not the same as the new instruction', () => {
        fixture.componentRef.setInput('lastScoreInstruction', 'remove');
        fixture.detectChanges();
        let plusBtn = fixture.debugElement.query(By.css('.plus-btn'));

        plusBtn.triggerEventHandler('click');

        let isBtnSelected =
          plusBtn.nativeNode.classList.contains('btn-selected');

        expect(mockCommentsService.manageScore).toHaveBeenCalledWith(
          2,
          'add',
          undefined
        );
        expect(component.lastScoreInstructionSignal()).toBe(undefined);
        expect(isBtnSelected).toBe(false);
      });
    });

    describe('remove', () => {
      it('Should call manageScore with correct parameters when lastScoreInstruction is undefined', () => {
        fixture.detectChanges();
        let minusBtn = fixture.debugElement.query(By.css('.minus-btn'));

        minusBtn.triggerEventHandler('click');

        let isBtnSelected =
          minusBtn.nativeNode.classList.contains('btn-selected');

        expect(mockCommentsService.manageScore).toHaveBeenCalledWith(
          2,
          'remove',
          'remove'
        );
        expect(component.lastScoreInstructionSignal()).toBe('remove');
        expect(isBtnSelected).toBe(true);
      });

      it('Should call manageScore with correct parameters when lastScoreInstruction is not undefined and is the same as the new instruction', () => {
        fixture.componentRef.setInput('lastScoreInstruction', 'remove');
        fixture.detectChanges();
        let minusBtn = fixture.debugElement.query(By.css('.minus-btn'));

        minusBtn.triggerEventHandler('click');

        let isBtnSelected =
          minusBtn.nativeNode.classList.contains('btn-selected');

        expect(mockCommentsService.manageScore).toHaveBeenCalledWith(
          2,
          'add',
          undefined
        );
        expect(component.lastScoreInstructionSignal()).toBe(undefined);
        expect(isBtnSelected).toBe(false);
      });

      it('Should call manageScore with correct parameters when lastScoreInstruction is not undefined and is not the same as the new instruction', () => {
        fixture.componentRef.setInput('lastScoreInstruction', 'add');
        fixture.detectChanges();
        let minusBtn = fixture.debugElement.query(By.css('.minus-btn'));

        minusBtn.triggerEventHandler('click');

        let isBtnSelected =
          minusBtn.nativeNode.classList.contains('btn-selected');

        expect(mockCommentsService.manageScore).toHaveBeenCalledWith(
          2,
          'remove',
          undefined
        );
        expect(component.lastScoreInstructionSignal()).toBe(undefined);
        expect(isBtnSelected).toBe(false);
      });
    });
  });
});
