import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { first, map, Observable } from 'rxjs';
import { BaseComponent } from 'src/app/shared/base/base.component';
import { AppPath } from 'src/app/shared/enums/app-path';
import { UserActions } from 'src/app/store/user-store/actions';
import { ResetPasswordComponentStore } from './reset-password.component-store';
import { NgIf, AsyncPipe } from '@angular/common';
import { LoadingComponent } from '../../../shared/components/loading/loading.component';
import { CardComponent } from '../../../shared/components/card/card.component';
import { StandardVerticalContentGridComponent } from '../../../shared/components/standard-vertical-content-grid/standard-vertical-content-grid.component';
import { TextBoxComponent } from '../../../shared/components/textbox/textbox.component';
import { ParagraphComponent } from '../../../shared/components/paragraph/paragraph.component';
import { ButtonComponent } from '../../../shared/components/buttons/button/button.component';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.scss',
  providers: [ResetPasswordComponentStore],
  imports: [
    NgIf,
    LoadingComponent,
    CardComponent,
    StandardVerticalContentGridComponent,
    TextBoxComponent,
    FormsModule,
    ReactiveFormsModule,
    ParagraphComponent,
    ButtonComponent,
    RouterLink,
    AsyncPipe,
  ],
})
export class ResetPasswordComponent extends BaseComponent implements OnInit {
  public readonly requestId$: Observable<string> = this.route.params.pipe(map((params) => params['id']));

  public readonly email$: Observable<string | undefined> = this.componentStore.email$;
  public readonly loading$: Observable<boolean> = this.componentStore.loading$;

  public readonly routerLink = AppPath.passwordReset;

  public readonly formGroup = new FormGroup({
    password: new FormControl<string | undefined>(undefined, [Validators.required, Validators.minLength(6)]),
    confirmPassword: new FormControl<string | undefined>(undefined, [Validators.required]),
  });

  constructor(
    private route: ActivatedRoute,
    private componentStore: ResetPasswordComponentStore,
    private store: Store,
    private actions$: Actions,
    private router: Router,
  ) {
    super();
  }

  public ngOnInit(): void {
    this.componentStore.getPasswordResetRequest(this.requestId$);

    this.actions$.pipe(ofType(UserActions.resetPasswordSuccess), first()).subscribe(() => {
      this.router.navigate([AppPath.root]);
    });

    this.subscriptions.add(
      this.actions$.pipe(ofType(UserActions.resetPasswordSuccess, UserActions.resetPasswordError)).subscribe(() => {
        this.componentStore.setLoading(false);
      }),
    );

    this.formGroup.valueChanges.subscribe((value) => {
      if (value.password !== value.confirmPassword) {
        this.formGroup.controls.confirmPassword.setErrors({ passwordMismatch: true });
      } else {
        this.formGroup.controls.confirmPassword.setErrors(null);
      }
    });
  }

  public onResetPassword(): void {
    const password = this.formGroup.value.password;
    if (!password) return;
    this.requestId$.pipe(first()).subscribe((requestId) => {
      this.store.dispatch(UserActions.resetPassword(requestId, password));
      this.componentStore.setLoading(true);
    });
  }
}
