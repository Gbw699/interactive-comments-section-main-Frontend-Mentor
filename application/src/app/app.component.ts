import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommnetsService } from './services/commnets.service';
import { CommaExpr } from '@angular/compiler';
import { UserService } from './services/user.service';
import { CommentsCardComponent } from './components/comments-card/comments-card.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommentsCardComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  title = 'application';

  constructor(private comments: CommnetsService, private user: UserService) {}

  ngOnInit(): void {
    this.comments.getComments();
    this.user.fetchCurrentUser();
  }
}
