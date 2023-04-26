import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { ITSystemUsageDetailsContractsComponent } from './it-system-usages/it-system-usage-details/it-system-usage-details-contracts/it-system-usage-details-contracts.component';
import { ItSystemUsageDetailsDataProcessingComponent } from './it-system-usages/it-system-usage-details/it-system-usage-details-data-processing/it-system-usage-details-data-processing.component';
import { ITSystemUsageDetailsFrontpageCatalogComponent } from './it-system-usages/it-system-usage-details/it-system-usage-details-frontpage-catalog/it-system-usage-details-frontpage-catalog.component';
import { ITSystemUsageDetailsFrontpageInformationComponent } from './it-system-usages/it-system-usage-details/it-system-usage-details-frontpage-information/it-system-usage-details-frontpage-information.component';
import { ITSystemUsageDetailsFrontpageComponent } from './it-system-usages/it-system-usage-details/it-system-usage-details-frontpage/it-system-usage-details-frontpage.component';
import { ItSystemUsageDetailsInterfacesComponent } from './it-system-usages/it-system-usage-details/it-system-usage-details-interfaces/it-system-usage-details-interfaces.component';
import { UsageOrganizationCreateDialogComponent } from './it-system-usages/it-system-usage-details/it-system-usage-details-organization/create-dialog/usage-organization.create-dialog.component';
import { ItSystemUsageDetailsOrganizationComponent } from './it-system-usages/it-system-usage-details/it-system-usage-details-organization/it-system-usage-details-organization.component';
import { ItSystemUsageDetailsRelationsComponent } from './it-system-usages/it-system-usage-details/it-system-usage-details-relations/it-system-usage-details-relations.component';
import { ModifyRelationDialogComponent } from './it-system-usages/it-system-usage-details/it-system-usage-details-relations/modify-relation-dialog/modify-relation-dialog.component';
import { RelationTableComponent } from './it-system-usages/it-system-usage-details/it-system-usage-details-relations/relation-table/relation-table.component';
import { ItSystemUsageDetailsRolesComponent } from './it-system-usages/it-system-usage-details/it-system-usage-details-roles/it-system-usage-details-roles.component';
import { ITSystemUsageDetailsComponent } from './it-system-usages/it-system-usage-details/it-system-usage-details.component';
import { ITSystemUsageRemoveComponent } from './it-system-usages/it-system-usage-details/it-system-usage-remove/it-system-usage-remove.component';
import { ITSystemUsagesComponent } from './it-system-usages/it-system-usages.component';
import { ITSystemsComponent } from './it-systems.component';
import { ITSystemsRouterModule } from './it-systems.routes';
import { ItSystemInterfacesTableComponent } from './shared/it-system-interfaces-table/it-system-interfaces-table.component';
import { CreateRelationDialogComponent } from './it-system-usages/it-system-usage-details/it-system-usage-details-relations/create-relation-dialog/create-relation-dialog.component';
import { BaseRelationDialogComponent } from './it-system-usages/it-system-usage-details/it-system-usage-details-relations/base-relation-dialog/base-relation-dialog.component';

@NgModule({
  declarations: [
    ITSystemsComponent,
    ITSystemUsagesComponent,
    ITSystemUsageDetailsComponent,
    ITSystemUsageDetailsFrontpageComponent,
    ITSystemUsageDetailsContractsComponent,
    ITSystemUsageRemoveComponent,
    ITSystemUsageDetailsFrontpageInformationComponent,
    ITSystemUsageDetailsFrontpageCatalogComponent,
    ItSystemUsageDetailsDataProcessingComponent,
    ItSystemUsageDetailsInterfacesComponent,
    ItSystemInterfacesTableComponent,
    ItSystemUsageDetailsOrganizationComponent,
    UsageOrganizationCreateDialogComponent,
    ItSystemUsageDetailsRolesComponent,
    ItSystemUsageDetailsRelationsComponent,
    RelationTableComponent,
    ModifyRelationDialogComponent,
    CreateRelationDialogComponent,
    BaseRelationDialogComponent,
  ],
  imports: [CommonModule, SharedModule, ITSystemsRouterModule],
})
export class ItSystemsModule {}
