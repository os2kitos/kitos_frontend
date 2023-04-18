import { NgModule } from '@angular/core';
import { ProfileComponent } from './profile.component';
import { ProfileRouterModule } from './profile.routes';

@NgModule({
  declarations: [ProfileComponent],
  imports: [ProfileRouterModule],
})
export class ProfileModule {}
