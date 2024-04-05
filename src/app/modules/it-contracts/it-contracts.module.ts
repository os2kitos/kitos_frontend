import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { ItContractDetailsComponent } from './it-contract-details/it-contract-details.component';
import { ItContractFrontpageComponent } from './it-contract-details/it-contract-frontpage/it-contract-frontpage.component';
import { ItContractsRootComponent } from './it-contracts-root.component';
import { ITContractsRouterModule } from './it-contracts.routes';
import { ITContractsComponent } from './overview/it-contracts.component';
import { ItContractSystemsComponent } from './it-contract-details/it-contract-systems/it-contract-systems.component';
import { AgreementElementCreateDialogComponent } from './it-contract-details/it-contract-systems/agreement-element-create-dialog/agreement-element-create-dialog.component';
import { ContractSystemCreateDialogComponent } from './it-contract-details/it-contract-systems/contract-system-create-dialog/contract-system-create-dialog.component';
import { ItContractDprComponent } from './it-contract-details/it-contract-dpr/it-contract-dpr.component';

@NgModule({
  declarations: [
    ITContractsComponent,
    ItContractDetailsComponent,
    ItContractFrontpageComponent,
    ItContractsRootComponent,
    ItContractSystemsComponent,
    AgreementElementCreateDialogComponent,
    ContractSystemCreateDialogComponent,
    ItContractDprComponent,
  ],
  imports: [ITContractsRouterModule, CommonModule, SharedModule],
})
export class ITContractsModule {}
