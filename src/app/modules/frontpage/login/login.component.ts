import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Login } from 'src/app/shared/models/login.model';
import { resetStateAction } from 'src/app/store/meta/actions';
import { UserActions } from 'src/app/store/user-store/actions';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  public readonly loginForm = new FormGroup({
    email: new FormControl('', [Validators.email, Validators.required]),
    password: new FormControl('', Validators.required),
    remember: new FormControl(false, Validators.required),
  });

  constructor(private store: Store) {}

  public login() {
    const login: Login = {
      email: this.loginForm.value.email ?? '',
      password: this.loginForm.value.password ?? '',
      remember: this.loginForm.value.remember ?? false,
    };

    this.store.dispatch(resetStateAction());
    this.store.dispatch(UserActions.login(login));

    this.loginForm.patchValue({ password: '' });
  }
}
