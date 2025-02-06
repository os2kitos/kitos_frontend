import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { BaseComponent } from 'src/app/shared/base/base.component';
import { UserActions } from 'src/app/store/user-store/actions';

@Component({
  selector: 'app-send-password-reset-request',
  templateUrl: './send-password-reset-request.component.html',
  styleUrl: './send-password-reset-request.component.scss',
})
export class SendPasswordResetRequestComponent extends BaseComponent {
  public readonly formGroup = new FormGroup({
    email: new FormControl<string | undefined>(undefined, [Validators.email, Validators.required]),
  });

  public loading = false;

  constructor(private store: Store, private actions$: Actions) {
    super();
    this.subscriptions.add(
      this.actions$
        .pipe(ofType(UserActions.resetPasswordRequestSuccess, UserActions.resetPasswordRequestError))
        .subscribe(() => {
          this.loading = false;
          this.formGroup.reset();
        })
    );
  }

  public onSendEmail(): void {
    const email = this.formGroup.value.email;
    if (!email) return;
    this.loading = true;
    this.store.dispatch(UserActions.resetPasswordRequest(email));
  }
}
