import {
  Component,
  computed,
  ElementRef,
  input,
  OnChanges,
  OnInit,
  signal,
  Signal,
  SimpleChanges,
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

import { CustomDatePipe } from '../../pipes/custom-date.pipe';

@Component({
  selector: 'app-comments-card',
  standalone: true,
  imports: [CustomDatePipe],
  templateUrl: './comments-card.component.html',
  styleUrl: './comments-card.component.scss',
})
export class CommentsCardComponent implements OnInit ,OnChanges {
  comment = input.required<IComment>();
  parentId = input.required<number>();
  lastScoreInstruction = input<string | undefined>();
  currentUser: Signal<ICurrentUser | undefined> = computed(() => {
    return this.userService.currentUser();
  });
  lastScoreInstructionSignal: WritableSignal<string | undefined> =
    signal(undefined);
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
  
  ngOnInit(): void {
    let instruction = this.lastScoreInstruction();
    this.updateButtonState(instruction);
    this.lastScoreInstructionSignal.set(instruction);
  }
  ngOnChanges(changes: SimpleChanges): void {
    let instruction = this.lastScoreInstruction();
    this.updateButtonState(instruction);
    this.lastScoreInstructionSignal.set(instruction);
  }

  setStatesToEdit() {
    this.idReferenceService.setIdReference(this.comment().id);
    this.editFlagService.setEditFlag(true);
    this.replyFlagService.setReplyFlag(false);
  }

  setStatesToReply(userToReply: string) {
    this.idReferenceService.setIdReference(this.comment().id);
    this.userToReplyService.setUserToReply(userToReply);
    this.replyFlagService.setReplyFlag(true);
    this.editFlagService.setEditFlag(false);
  }

  deleteComment(id: number) {
    this.deleteModalService.setCommentIdToDelete(id);
  }

  manageScore(newInstruction: string) {
    const lastScoreInstruction = this.lastScoreInstructionSignal();
    const isSameInstruction = lastScoreInstruction === newInstruction;

    const action =
      lastScoreInstruction === undefined
        ? newInstruction
        : isSameInstruction
        ? newInstruction === 'add'
          ? 'remove'
          : 'add'
        : newInstruction;

    const newLastScoreInstruction =
      action === newInstruction
        ? lastScoreInstruction === undefined
          ? newInstruction
          : undefined
        : undefined;

    this.commentsService.manageScore(
      this.comment().id,
      action,
      newLastScoreInstruction
    );
    this.lastScoreInstructionSignal.set(newLastScoreInstruction);
    this.updateButtonState(newLastScoreInstruction);
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
