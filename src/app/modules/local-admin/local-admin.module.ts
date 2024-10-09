import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ComponentsModule } from 'src/app/shared/components/components.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { LocalAdminComponent } from './local-admin.component';
import { LocalAdminRouterModule } from './local-admin.routes';

@NgModule({
  declarations: [LocalAdminComponent],
  imports: [CommonModule, ComponentsModule, SharedModule, LocalAdminRouterModule],
})
export class LocalAdminModule {}
