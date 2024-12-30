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
import { CommnetsService } from '../../services/commnets.service';
import { UserToReplyService } from '../../services/user-to-reply.service';
import { CommentIdToReplyService } from '../../services/comment-id-to-reply.service';
import { ReplyFlagService } from '../../services/reply-flag.service';

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
  replyFlag: Signal<boolean> = computed(() => {
    return this.replyFlagService.replyFlag();
  });
  private userToReply: Signal<string | undefined> = computed(() => {
    return this.userToReplySerivce.userToReply();
  });
  private commentIdToReply: Signal<number | undefined> = computed(() => {
    return this.commentIdToReplySerivce.commentIdToReply();
  });

  formGroup: FormGroup = new FormGroup({
    inputValue: new FormControl('', [
      Validators.required,
      Validators.maxLength(300),
    ]),
  });

  constructor(
    private userSerivce: UserService,
    private commentsService: CommnetsService,
    private userToReplySerivce: UserToReplyService,
    private commentIdToReplySerivce: CommentIdToReplyService,
    private replyFlagService: ReplyFlagService
  ) {}

  publishComment() {
    let result: string = this.formGroup.value.inputValue;
    this.formGroup.setValue({ inputValue: '' });

    this.commentsService.addComment(result);
  }

  replyComment() {
    let result: string = this.formGroup.value.inputValue;
    this.formGroup.setValue({ inputValue: '' });

    this.commentsService.replyComment(
      this.commentIdToReply(),
      this.userToReply(),
      result
    );

    this.replyFlagService.setReplyFlag(false);
  }
}
