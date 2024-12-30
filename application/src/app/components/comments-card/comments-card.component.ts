import { Component, computed, input, OnInit, Signal } from '@angular/core';
import { UserService } from '../../services/user.service';
import { ICurrentUser } from '../../../models/ICurrentUser';
import { IComment } from '../../../models/IComment';
import { CommnetsService } from '../../services/commnets.service';

@Component({
  selector: 'app-comments-card',
  standalone: true,
  imports: [],
  templateUrl: './comments-card.component.html',
  styleUrl: './comments-card.component.scss',
})
export class CommentsCardComponent {
  currentUser: Signal<ICurrentUser | undefined> = computed(() => {
    return this.user.currentUser();
  });
  comment = input.required<IComment>();
 

  constructor(private user: UserService, private comments: CommnetsService) {
  
  }

  deleteComment(id: number) {
    this.comments.deleteComment(id);
  }
}
