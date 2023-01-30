import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { InputsModule } from '@progress/kendo-angular-inputs';
import { LabelModule } from '@progress/kendo-angular-label';
import { SharedModule } from 'src/app/shared/shared.module';
import { FrontpageComponent } from './frontpage.component';
import { FrontpageRouterModule } from './frontpage.routes';
import { LoginComponent } from './login/login.component';

@NgModule({
  declarations: [FrontpageComponent, LoginComponent],
  imports: [ReactiveFormsModule, SharedModule, FrontpageRouterModule, InputsModule, LabelModule],
})
export class FrontpageModule {}
