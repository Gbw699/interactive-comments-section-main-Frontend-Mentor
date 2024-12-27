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

@Component({
  selector: 'app-form-card',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './form-card.component.html',
  styleUrl: './form-card.component.scss',
})
export class FormCardComponent {
  currentUser: Signal<ICurrentUser | undefined> = computed(() => {
    return this.user.currentUser();
  });

  formGroup: FormGroup = new FormGroup({
    inputValue: new FormControl('', [
      Validators.required,
      Validators.maxLength(300),
    ]),
  });

  constructor(private user: UserService) {}

  publishComment(event: any) {
    let result: string = this.formGroup.value.inputValue;
    this.formGroup.setValue({ inputValue: '' });
  }
}
