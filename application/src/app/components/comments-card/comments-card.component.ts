import { Component, computed, Signal } from '@angular/core';
import { UserService } from '../../services/user.service';
import { ICurrentUser } from '../../../models/ICurrentUser';

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

  constructor(private user: UserService) {}
}
