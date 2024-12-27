import {
  Component,
  computed,
  OnChanges,
  Signal,
  SimpleChanges,
} from '@angular/core';
import { UserService } from '../../services/user.service';
import { ICurrentUser } from '../../../models/ICurrentUser';
import { computeMsgId } from '@angular/compiler';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';

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
      Validators.maxLength(50),
    ]),
  });

  constructor(private user: UserService) {}

  publishComment(event: any) {
    console.log(event.target.elements[0].value);

    let result: string = this.formGroup.value.inputValue;
    // this.formGroup.setValue({ inputValue: '' });
  }
}
