import { AsyncPipe } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Login } from 'src/app/shared/models/login.model';
import { resetStateAction } from 'src/app/store/meta/actions';
import { UserActions } from 'src/app/store/user-store/actions';
import { selectSsoErrorCode } from 'src/app/store/user-store/selectors';
import { AccordionComponent } from '../../../shared/components/accordion/accordion.component';
import { ButtonComponent } from '../../../shared/components/buttons/button/button.component';
import { CheckboxComponent } from '../../../shared/components/checkbox/checkbox.component';
import { StandardVerticalContentGridComponent } from '../../../shared/components/standard-vertical-content-grid/standard-vertical-content-grid.component';
import { TextBoxComponent } from '../../../shared/components/textbox/textbox.component';
import { ResetPasswordTextLinkComponent } from '../reset-password-text-link/reset-password-text-link.component';
import { SsoButtonComponent } from '../sso-button/sso-button.component';
import { SsoErrorComponent } from './sso-error/sso-error.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    AccordionComponent,
    StandardVerticalContentGridComponent,
    SsoButtonComponent,
    SsoErrorComponent,
    TextBoxComponent,
    CheckboxComponent,
    ButtonComponent,
    ResetPasswordTextLinkComponent,
    AsyncPipe,
  ],
})
export class LoginComponent {
  public readonly loginForm = new FormGroup({
    email: new FormControl('', [Validators.email]),
    password: new FormControl(''),
    remember: new FormControl(false),
  });

  public readonly ssoErrorCode$ = this.store.select(selectSsoErrorCode);

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

  public disableLoginButton(): boolean {
    return this.loginForm.value.email === '' || this.loginForm.value.password === '';
  }
}
