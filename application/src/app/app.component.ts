import { Component, computed, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { CommentsService } from './services/comments.service';
import { UserService } from './services/user.service';

import { CommentsCardComponent } from './components/comments-card/comments-card.component';
import { FormCardComponent } from './components/form-card/form-card.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommentsCardComponent, FormCardComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  title = 'application';
  publishedCommnets = computed(() => {
    return this.comments.publishedComments()?.sort((comment1, comment2) => {
      if (comment1.score > comment2.score) {
        return -1;
      } else if (comment1.score < comment2.score) {
        return 1;
      } else {
        return 0;
      }
    });
  });

  constructor(private comments: CommentsService, private user: UserService) {}

  ngOnInit(): void {
    this.comments.fetchComments();
    this.user.fetchCurrentUser();
  }
}
