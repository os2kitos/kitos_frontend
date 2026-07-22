import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { BaseComponent } from 'src/app/shared/base/base.component';
import { UserActions } from 'src/app/store/user-store/actions';
import { CardComponent } from '../../../shared/components/card/card.component';
import { StandardVerticalContentGridComponent } from '../../../shared/components/standard-vertical-content-grid/standard-vertical-content-grid.component';
import { ParagraphComponent } from '../../../shared/components/paragraph/paragraph.component';

import { LoadingComponent } from '../../../shared/components/loading/loading.component';
import { TextBoxComponent } from '../../../shared/components/textbox/textbox.component';
import { ButtonComponent } from '../../../shared/components/buttons/button/button.component';

@Component({
  selector: 'app-send-password-reset-request',
  templateUrl: './send-password-reset-request.component.html',
  styleUrl: './send-password-reset-request.component.scss',
  imports: [
    CardComponent,
    StandardVerticalContentGridComponent,
    ParagraphComponent,
    LoadingComponent,
    TextBoxComponent,
    FormsModule,
    ReactiveFormsModule,
    ButtonComponent
],
})
export class SendPasswordResetRequestComponent extends BaseComponent {
  public readonly formGroup = new FormGroup({
    email: new FormControl<string | undefined>(undefined, [Validators.email, Validators.required]),
  });

  public loading = false;

  constructor(
    private store: Store,
    private actions$: Actions,
  ) {
    super();
    this.subscriptions.add(
      this.actions$
        .pipe(ofType(UserActions.resetPasswordRequestSuccess, UserActions.resetPasswordRequestError))
        .subscribe(() => {
          this.loading = false;
          this.formGroup.reset();
        }),
    );
  }

  public onSendEmail(): void {
    const email = this.formGroup.value.email;
    if (!email) return;
    this.loading = true;
    this.store.dispatch(UserActions.resetPasswordRequest(email));
  }
}
