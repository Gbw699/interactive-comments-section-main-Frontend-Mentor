import { Component, computed, input, OnInit, Signal } from '@angular/core';
import { UserService } from '../../services/user.service';
import { ICurrentUser } from '../../../models/ICurrentUser';
import { IComment } from '../../../models/IComment';
import { CommnetsService } from '../../services/commnets.service';
import { UserToReplyService } from '../../services/user-to-reply.service';
import { IdReferenceService } from '../../services/id-reference.service';
import { ReplyFlagService } from '../../services/reply-flag.service';
import { EditFlagService } from '../../services/edit-flag.service';

@Component({
  selector: 'app-comments-card',
  standalone: true,
  imports: [],
  templateUrl: './comments-card.component.html',
  styleUrl: './comments-card.component.scss',
})
export class CommentsCardComponent {
  currentUser: Signal<ICurrentUser | undefined> = computed(() => {
    return this.userService.currentUser();
  });
  comment = input.required<IComment>();
  parentId = input.required<number>();

  constructor(
    private userService: UserService,
    private commentsService: CommnetsService,
    private userToReplyService: UserToReplyService,
    private idReferenceService: IdReferenceService,
    private replyFlagService: ReplyFlagService,
    private editFlagService: EditFlagService
  ) {}

  setStatesToEdit() {
    this.idReferenceService.setIdReference(this.comment().id)
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
    this.commentsService.deleteComment(id);
  }
}
