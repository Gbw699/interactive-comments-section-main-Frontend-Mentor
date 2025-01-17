import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { CommentsService } from '../../services/comments.service';
import { DeleteModalService } from '../../services/delete-modal.service';

import { ModalCardComponent } from './modal-card.component';

describe('ModalCardComponent', () => {
  let mockCommentsService: any;
  let mockDeleteModalService: any;
  let component: ModalCardComponent;
  let fixture: ComponentFixture<ModalCardComponent>;

  beforeEach(async () => {
    mockCommentsService = jasmine.createSpyObj(['deleteComment']);
    mockDeleteModalService = jasmine.createSpyObj([
      'commentIdToDelete',
      'setCommentIdToDelete',
    ]);

    await TestBed.configureTestingModule({
      imports: [ModalCardComponent],
      providers: [
        { provide: CommentsService, useValue: mockCommentsService },
        { provide: DeleteModalService, useValue: mockDeleteModalService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ModalCardComponent);
    component = fixture.componentInstance;
    mockDeleteModalService.commentIdToDelete.and.returnValue(3);
    fixture.detectChanges();
  });

  describe('deleteComment', () => {
    it('Should delete the comment', () => {
      let deletebtn = fixture.debugElement.query(By.css('.delete-btn'));

      deletebtn.triggerEventHandler('click');

      expect(mockCommentsService.deleteComment).toHaveBeenCalledWith(3);
      expect(mockDeleteModalService.setCommentIdToDelete).toHaveBeenCalledWith(
        undefined
      );
    });
  });

  describe('closeModal', () => {
    it('Should close the modal', () => {
      let cancelBtn = fixture.debugElement.query(By.css('.cancel-btn'));

      cancelBtn.triggerEventHandler('click');

      expect(mockDeleteModalService.setCommentIdToDelete).toHaveBeenCalledWith(
        undefined
      );
    });
  });
});
