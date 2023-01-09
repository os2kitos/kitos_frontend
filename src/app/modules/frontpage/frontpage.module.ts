import { NgModule } from '@angular/core';
import { FrontpageComponent } from './frontpage.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { CommonModule } from '@angular/common';
import { FrontpageRouterModule } from './frontpage.routes';

@NgModule({
  declarations: [FrontpageComponent],
  imports: [CommonModule, SharedModule, FrontpageRouterModule],
})
export class FrontpageModule {}
