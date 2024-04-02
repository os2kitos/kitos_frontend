import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { ITContractsComponent } from './it-contracts.component';
import { ITContractsRouterModule } from './it-contracts.routes';

@NgModule({
  declarations: [ITContractsComponent],
  imports: [ITContractsRouterModule, CommonModule, SharedModule],
})
export class ITContractsModule {}
