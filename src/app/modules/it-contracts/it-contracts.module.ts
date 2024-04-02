import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { ITContractsComponent } from './it-contracts.component';
import { ITContractsRouterModule } from './it-contracts.routes';
import { ItContractDetailsComponent } from './it-contract-details/it-contract-details.component';
import { ItContractFrontpageComponent } from './it-contract-details/it-contract-frontpage/it-contract-frontpage.component';

@NgModule({
  declarations: [ITContractsComponent, ItContractDetailsComponent, ItContractFrontpageComponent],
  imports: [ITContractsRouterModule, CommonModule, SharedModule],
})
export class ITContractsModule {}
