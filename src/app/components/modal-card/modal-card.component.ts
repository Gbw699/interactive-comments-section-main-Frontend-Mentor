import { Component, computed, Signal } from '@angular/core';

import { DeleteModalService } from '../../services/delete-modal.service';
import { CommentsService } from '../../services/comments.service';

@Component({
  selector: 'app-modal-card',
  standalone: true,
  imports: [],
  templateUrl: './modal-card.component.html',
  styleUrl: './modal-card.component.scss',
})
export class ModalCardComponent {
  commentId: Signal<number | undefined> = computed(() => {
    return this.deleteModalService.commentIdToDelete();
  });

  constructor(
    private commentsService: CommentsService,
    private deleteModalService: DeleteModalService
  ) {}

  deleteComment() {
    this.commentsService.deleteComment(this.commentId());
    this.deleteModalService.setCommentIdToDelete(undefined);
  }

  closeModal() {
    this.deleteModalService.setCommentIdToDelete(undefined);
  }
}
