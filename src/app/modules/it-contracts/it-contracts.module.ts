import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { ItContractDeadlinesComponent } from './it-contract-details/it-contract-deadlines/it-contract-deadlines.component';
import { ItContractDetailsComponent } from './it-contract-details/it-contract-details.component';
import { ItContractDprComponent } from './it-contract-details/it-contract-dpr/it-contract-dpr.component';
import { ItContractFrontpageComponent } from './it-contract-details/it-contract-frontpage/it-contract-frontpage.component';
import { ItContractReferencesComponent } from './it-contract-details/it-contract-references/it-contract-references.component';
import { ItContractRolesComponent } from './it-contract-details/it-contract-roles/it-contract-roles.component';
import { AgreementElementCreateDialogComponent } from './it-contract-details/it-contract-systems/agreement-element-create-dialog/agreement-element-create-dialog.component';
import { ItContractSystemsComponent } from './it-contract-details/it-contract-systems/it-contract-systems.component';
import { ItContractsRootComponent } from './it-contracts-root.component';
import { ITContractsRouterModule } from './it-contracts.routes';
import { ITContractsComponent } from './overview/it-contracts.component';

@NgModule({
  declarations: [
    ITContractsComponent,
    ItContractDetailsComponent,
    ItContractFrontpageComponent,
    ItContractsRootComponent,
    ItContractSystemsComponent,
    AgreementElementCreateDialogComponent,
    ItContractDprComponent,
    ItContractDeadlinesComponent,
    ItContractReferencesComponent,
    ItContractRolesComponent,
  ],
  imports: [ITContractsRouterModule, CommonModule, SharedModule],
})
export class ITContractsModule {}
