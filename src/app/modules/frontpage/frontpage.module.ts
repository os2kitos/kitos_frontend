import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';
import { FrontpageComponent } from './frontpage.component';
import { FrontpageRouterModule } from './frontpage.routes';
import { LoginComponent } from './login/login.component';
import { PublicMessageComponent } from './public-message/public-message.component';
import { EditPublicMessageDialogComponent } from './public-message/edit-public-message-dialog/edit-public-message-dialog.component';
import { ResetPasswordTextLinkComponent } from './reset-password-text-link/reset-password-text-link.component';
import { SendPasswordResetRequestComponent } from './send-password-reset-request/send-password-reset-request.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';

@NgModule({
  declarations: [
    FrontpageComponent,
    LoginComponent,
    PublicMessageComponent,
    EditPublicMessageDialogComponent,
    ResetPasswordTextLinkComponent,
    SendPasswordResetRequestComponent,
    ResetPasswordComponent,
  ],
  imports: [ReactiveFormsModule, SharedModule, FrontpageRouterModule],
})
export class FrontpageModule {}
