import {
  Component,
  computed,
  ElementRef,
  OnInit,
  Signal,
  viewChild,
} from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { IComment } from '../models/IComment';

import { CommentsService } from './services/comments.service';
import { UserService } from './services/user.service';
import { DeleteModalService } from './services/delete-modal.service';

import { CommentsCardComponent } from './components/comments-card/comments-card.component';
import { FormCardComponent } from './components/form-card/form-card.component';
import { ModalCardComponent } from './components/modal-card/modal-card.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    CommentsCardComponent,
    FormCardComponent,
    ModalCardComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  title = 'application';
  publishedCommnets: Signal<IComment[] | undefined> = computed(() => {
    return this.commentsService
      .publishedComments()
      ?.sort((comment1, comment2) => {
        if (comment1.score > comment2.score) {
          return -1;
        } else if (comment1.score < comment2.score) {
          return 1;
        } else {
          return 0;
        }
      });
  });
  commentIdToDelete: Signal<number | undefined> = computed(() => {
    return this.deleteModalService.commentIdToDelete();
  });
  modalRef = viewChild<ElementRef<HTMLDivElement>>('modal');

  constructor(
    private commentsService: CommentsService,
    private userService: UserService,
    private deleteModalService: DeleteModalService
  ) {}

  ngOnInit(): void {
    this.commentsService.fetchComments();
    this.userService.fetchCurrentUser();
  }

  closeModal(event: MouseEvent) {
    let positions: any = this.modalRef()?.nativeElement.getBoundingClientRect();
    let clientX = event.clientX;
    let clientY = event.clientY;

    if (
      clientX < positions.left ||
      clientX > positions.right ||
      clientY < positions.top ||
      clientY > positions.bottom
    ) {
      this.deleteModalService.setCommentIdToDelete(undefined);
    }
  }
}
