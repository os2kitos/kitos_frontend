import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { ItSystemsComponent } from './it-systems.component';
import { CommonModule } from '@angular/common';
import { ITSystemRouterModule } from './it-systems.routes';

@NgModule({
  declarations: [ItSystemsComponent],
  imports: [CommonModule, SharedModule, ITSystemRouterModule],
})
export class ItSystemsModule {}
