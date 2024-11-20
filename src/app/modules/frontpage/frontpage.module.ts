import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';
import { FrontpageComponent } from './frontpage.component';
import { FrontpageRouterModule } from './frontpage.routes';
import { LoginComponent } from './login/login.component';
import { PublicMessageComponent } from './public-message/public-message.component';
import { EditPublicMessageDialogComponent } from './public-message/edit-public-message-dialog/edit-public-message-dialog.component';

@NgModule({
  declarations: [FrontpageComponent, LoginComponent, PublicMessageComponent, EditPublicMessageDialogComponent],
  imports: [ReactiveFormsModule, SharedModule, FrontpageRouterModule],
})
export class FrontpageModule {}
