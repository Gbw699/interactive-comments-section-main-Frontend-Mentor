import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommnetsService } from './services/commnets.service';
import { CommaExpr } from '@angular/compiler';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  title = 'application';

  constructor(private comments: CommnetsService) {}

  ngOnInit(): void {
    this.comments.getComments();
  }
}
