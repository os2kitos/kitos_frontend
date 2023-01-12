import { NgModule } from '@angular/core';
import { OrganisationComponent } from './organisation.component';
import { OrganisationRouterModule } from './organisation.routes';

@NgModule({
  declarations: [OrganisationComponent],
  imports: [OrganisationRouterModule],
})
export class OrganisationModule {}
