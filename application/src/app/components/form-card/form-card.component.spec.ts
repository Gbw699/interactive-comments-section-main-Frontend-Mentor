import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormCardComponent } from './form-card.component';
import { UserService } from '../../services/user.service';
import { CommentsService } from '../../services/comments.service';
import { UserToReplyService } from '../../services/user-to-reply.service';
import { IdReferenceService } from '../../services/id-reference.service';
import { ReplyFlagService } from '../../services/reply-flag.service';
import { EditFlagService } from '../../services/edit-flag.service';
import { By } from '@angular/platform-browser';

describe('FormCardComponent', () => {
  let mockUserService: any;
  let mockCommentsService: any;
  let mockUserToReplySerivce: any;
  let mockIdReferenceService: any;
  let mockReplyFlagService: any;
  let mockEditFlagService: any;
  let component: FormCardComponent;
  let fixture: ComponentFixture<FormCardComponent>;

  beforeEach(async () => {
    mockUserService = jasmine.createSpyObj(['currentUser']);
    mockCommentsService = jasmine.createSpyObj([
      'addComment',
      'editComment',
      'replyComment',
    ]);
    mockUserToReplySerivce = jasmine.createSpyObj(['userToReply']);
    mockIdReferenceService = jasmine.createSpyObj(['idReference']);
    mockReplyFlagService = jasmine.createSpyObj(['setReplyFlag']);
    mockEditFlagService = jasmine.createSpyObj(['setEditFlag']);

    await TestBed.configureTestingModule({
      imports: [FormCardComponent],
      providers: [
        { provide: UserService, useValue: mockUserService },
        { provide: CommentsService, useValue: mockCommentsService },
        { provide: UserToReplyService, useValue: mockUserToReplySerivce },
        { provide: IdReferenceService, useValue: mockIdReferenceService },
        { provide: ReplyFlagService, useValue: mockReplyFlagService },
        { provide: EditFlagService, useValue: mockEditFlagService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(FormCardComponent);
    fixture.componentRef.setInput('replyFlag', undefined);
    fixture.componentRef.setInput('editFlag', undefined);
    component = fixture.componentInstance;
  });

  describe('conditionalSubmit', () => {
    it('Should publish the comment set in the form control', () => {
      fixture.detectChanges();
      let textArea: HTMLTextAreaElement = fixture.debugElement.query(
        By.css('#text-area')
      ).nativeElement;
      let cardContainer = fixture.debugElement.query(By.css('.card-container'));

      textArea.value = 'This is a comment for testing';
      textArea.dispatchEvent(new Event('input'));
      cardContainer.triggerEventHandler('ngSubmit');

      expect(mockCommentsService.addComment).toHaveBeenCalledWith(
        'This is a comment for testing'
      );
      expect(component.formGroup.value).toEqual({ inputValue: '' });
    });

    it('If edit flag is true, it should publish the comment set in the form control to update a comment', () => {
      mockIdReferenceService.idReference.and.returnValue(2);
      fixture.componentRef.setInput('editFlag', true);
      fixture.detectChanges();
      let textArea: HTMLTextAreaElement = fixture.debugElement.query(
        By.css('#text-area')
      ).nativeElement;
      let cardContainer = fixture.debugElement.query(By.css('.card-container'));

      textArea.value = 'This is a comment for testing';
      textArea.dispatchEvent(new Event('input'));
      cardContainer.triggerEventHandler('ngSubmit');

      expect(mockCommentsService.editComment).toHaveBeenCalledWith(
        2,
        'This is a comment for testing'
      );
      expect(mockEditFlagService.setEditFlag).toHaveBeenCalledWith(false);
      expect(component.formGroup.value).toEqual({ inputValue: '' });
    });

    it('If reply flag is true, it should publish the comment set in the form control to reply a comment', () => {
      mockIdReferenceService.idReference.and.returnValue(2);
      mockUserToReplySerivce.userToReply.and.returnValue('maxblagun');
      fixture.componentRef.setInput('replyFlag', true);
      fixture.detectChanges();
      let textArea: HTMLTextAreaElement = fixture.debugElement.query(
        By.css('#text-area')
      ).nativeElement;
      let cardContainer = fixture.debugElement.query(By.css('.card-container'));

      textArea.value = 'This is a comment for testing';
      textArea.dispatchEvent(new Event('input'));
      cardContainer.triggerEventHandler('ngSubmit');

      expect(mockCommentsService.replyComment).toHaveBeenCalledWith(
        2,
        'maxblagun',
        'This is a comment for testing'
      );
      expect(mockReplyFlagService.setReplyFlag).toHaveBeenCalledWith(false);
      expect(component.formGroup.value).toEqual({ inputValue: '' });
    });
  });

  describe('submitOnEnter', () => {
    it('Should be submitted when the submit event is triggered by pressing the Enter key', () => {
      fixture.detectChanges();
      let textArea = fixture.debugElement.query(By.css('#text-area'));

      textArea.nativeElement.value = 'This is a comment for testing';
      textArea.nativeElement.dispatchEvent(new Event('input'));
      textArea.triggerEventHandler('keydown.enter', {
        key: 'Enter',
        shiftKey: false,
      });

      expect(mockCommentsService.addComment).toHaveBeenCalledWith(
        'This is a comment for testing'
      );
      expect(component.formGroup.value).toEqual({ inputValue: '' });
    });
  });
});
