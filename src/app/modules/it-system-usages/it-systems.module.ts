import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { ITSystemDetailsComponent } from './it-system-details/it-system-details.component';
import { ITSystemsComponent } from './it-systems.component';
import { ITSystemRouterModule } from './it-systems.routes';

@NgModule({
  declarations: [ITSystemsComponent, ITSystemDetailsComponent],
  imports: [CommonModule, SharedModule, ITSystemRouterModule],
})
export class ItSystemsModule {}
