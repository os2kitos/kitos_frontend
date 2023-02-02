import { NgModule } from '@angular/core';
import { OrganizationComponent } from './organization.component';
import { OrganizationRouterModule } from './organization.routes';

@NgModule({
  declarations: [OrganizationComponent],
  imports: [OrganizationRouterModule],
})
export class OrganizationModule {}
