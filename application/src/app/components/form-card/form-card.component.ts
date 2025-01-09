import { Component, computed, Signal } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';

import { UserService } from '../../services/user.service';
import { ICurrentUser } from '../../../models/ICurrentUser';
import { CommentsService } from '../../services/comments.service';
import { UserToReplyService } from '../../services/user-to-reply.service';
import { IdReferenceService } from '../../services/id-reference.service';
import { ReplyFlagService } from '../../services/reply-flag.service';
import { EditFlagService } from '../../services/edit-flag.service';

@Component({
  selector: 'app-form-card',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './form-card.component.html',
  styleUrl: './form-card.component.scss',
})
export class FormCardComponent {
  currentUser: Signal<ICurrentUser | undefined> = computed(() => {
    return this.userSerivce.currentUser();
  });
  private replyFlag: Signal<boolean> = computed(() => {
    return this.replyFlagService.replyFlag();
  });
  private editFlag: Signal<boolean> = computed(() => {
    return this.editFlagService.editFlag();
  });
  private userToReply: Signal<string | undefined> = computed(() => {
    return this.userToReplySerivce.userToReply();
  });
  private commentIdToReply: Signal<number | undefined> = computed(() => {
    return this.idReferenceService.idReference();
  });

  formGroup: FormGroup = new FormGroup({
    inputValue: new FormControl('', [
      Validators.required,
      Validators.maxLength(300),
      Validators.pattern(/\S/),
    ]),
  });

  constructor(
    private userSerivce: UserService,
    private commentsService: CommentsService,
    private userToReplySerivce: UserToReplyService,
    private idReferenceService: IdReferenceService,
    private replyFlagService: ReplyFlagService,
    private editFlagService: EditFlagService
  ) {}

  conditionalSubmit() {
    if (this.editFlag()) {
      this.editComment();
    } else if (this.replyFlag()) {
      this.replyComment();
    } else {
      this.publishComment();
    }
  }

  private publishComment() {
    let inputComment: string = this.formGroup.value.inputValue;
    this.formGroup.setValue({ inputValue: '' });

    this.commentsService.addComment(inputComment);
  }

  private editComment() {
    let inputComment: string = this.formGroup.value.inputValue;
    this.formGroup.setValue({ inputValue: '' });

    this.commentsService.editComment(this.commentIdToReply(), inputComment);

    this.editFlagService.setEditFlag(false);
  }

  private replyComment() {
    let inputComment: string = this.formGroup.value.inputValue;
    this.formGroup.setValue({ inputValue: '' });

    this.commentsService.replyComment(
      this.commentIdToReply(),
      this.userToReply(),
      inputComment
    );

    this.replyFlagService.setReplyFlag(false);
  }
}
