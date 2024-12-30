import { Component, computed, input, OnInit, Signal } from '@angular/core';
import { UserService } from '../../services/user.service';
import { ICurrentUser } from '../../../models/ICurrentUser';
import { IComment } from '../../../models/IComment';
import { CommnetsService } from '../../services/commnets.service';
import { UserToReplyService } from '../../services/user-to-reply.service';
import { CommentIdToReplyService } from '../../services/comment-id-to-reply.service';
import { ReplyFlagService } from '../../services/reply-flag.service';

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
    private commentIdToReplyService: CommentIdToReplyService,
    private replyFlagService: ReplyFlagService
  ) {}

  setStatesToReply(userToReply: string) {
    this.commentIdToReplyService.setCommentIdToReply(this.parentId());
    this.userToReplyService.setUserToReply(userToReply);
    this.replyFlagService.setReplyFlag(true);
  }

  deleteComment(id: number) {
    this.commentsService.deleteComment(id);
  }
}
