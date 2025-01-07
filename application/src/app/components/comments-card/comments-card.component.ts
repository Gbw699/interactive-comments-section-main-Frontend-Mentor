import {
  Component,
  computed,
  ElementRef,
  input,
  signal,
  Signal,
  viewChild,
  WritableSignal,
} from '@angular/core';

import { ICurrentUser } from '../../../models/ICurrentUser';
import { IComment } from '../../../models/IComment';

import { UserService } from '../../services/user.service';
import { CommentsService } from '../../services/comments.service';
import { UserToReplyService } from '../../services/user-to-reply.service';
import { IdReferenceService } from '../../services/id-reference.service';
import { ReplyFlagService } from '../../services/reply-flag.service';
import { EditFlagService } from '../../services/edit-flag.service';
import { DeleteModalService } from '../../services/delete-modal.service';

@Component({
  selector: 'app-comments-card',
  standalone: true,
  imports: [],
  templateUrl: './comments-card.component.html',
  styleUrl: './comments-card.component.scss',
})
export class CommentsCardComponent {
  comment = input.required<IComment>();
  parentId = input.required<number>();
  currentUser: Signal<ICurrentUser | undefined> = computed(() => {
    return this.userService.currentUser();
  });
  lastScoreInstruction: WritableSignal<string | undefined> = signal(undefined);
  plusBtn = viewChild<ElementRef<HTMLImageElement>>('plusBtn');
  minusBtn = viewChild<ElementRef<HTMLDivElement>>('minusBtn');

  constructor(
    private userService: UserService,
    private commentsService: CommentsService,
    private userToReplyService: UserToReplyService,
    private idReferenceService: IdReferenceService,
    private replyFlagService: ReplyFlagService,
    private editFlagService: EditFlagService,
    private deleteModalService: DeleteModalService
  ) {}

  setStatesToEdit() {
    this.idReferenceService.setIdReference(this.comment().id);
    this.editFlagService.setEditFlag(true);
    this.replyFlagService.setReplyFlag(false);
  }

  setStatesToReply(userToReply: string) {
    this.idReferenceService.setIdReference(this.parentId());
    this.userToReplyService.setUserToReply(userToReply);
    this.replyFlagService.setReplyFlag(true);
    this.editFlagService.setEditFlag(false);
  }

  deleteComment(id: number) {
    this.deleteModalService.setCommentIdToDelete(id)
  }

  manageScore(instruction: string) {
    if (this.lastScoreInstruction() === instruction) {
      this.commentsService.manageScore(
        this.comment().id,
        this.lastScoreInstruction() === 'add' ? 'remove' : 'add'
      );
      this.lastScoreInstruction.set(undefined);
      this.updateButtonState(undefined);
    } else if (
      this.lastScoreInstruction() !== instruction &&
      this.lastScoreInstruction() !== undefined
    ) {
      this.commentsService.manageScore(
        this.comment().id,
        instruction === 'add' ? 'add' : 'remove'
      );
      this.lastScoreInstruction.set(undefined);
      this.updateButtonState(undefined);
    } else {
      this.commentsService.manageScore(this.comment().id, instruction);
      this.lastScoreInstruction.set(instruction);
      this.updateButtonState(instruction);
    }
  }

  private updateButtonState(instruction: string | undefined) {
    this.plusBtn()?.nativeElement.classList.toggle(
      'btn-selected',
      instruction === 'add'
    );
    this.minusBtn()?.nativeElement.classList.toggle(
      'btn-selected',
      instruction === 'remove'
    );
  }
}
