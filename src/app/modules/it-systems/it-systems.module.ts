import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatInputModule } from '@angular/material/input';
import { SharedModule } from 'src/app/shared/shared.module';
import { ItSystemCatalogDetailsFrontpageComponent } from './it-system-catalog/it-system-catalog-details/it-system-catalog-details-frontpage/it-system-catalog-details-frontpage.component';
import { ItSystemCatalogDetailsComponent } from './it-system-catalog/it-system-catalog-details/it-system-catalog-details.component';
import { ItSystemCatalogInterfacesComponent } from './it-system-catalog/it-system-catalog-details/it-system-catalog-interfaces/it-system-catalog-interfaces.component';
import { ItSystemCatalogKleComponent } from './it-system-catalog/it-system-catalog-details/it-system-catalog-kle/it-system-catalog-kle.component';
import { ItSystemCatalogReferencesComponent } from './it-system-catalog/it-system-catalog-details/it-system-catalog-references/it-system-catalog-references.component';
import { ItSystemCatalogComponent } from './it-system-catalog/it-system-catalog.component';
import { ItSystemUsageDetailsArchivingComponent } from './it-system-usages/it-system-usage-details/it-system-usage-details-archiving/it-system-usage-details-archiving.component';
import { ItSystemUsageDetailsJournalPeriodWriteDialogComponent } from './it-system-usages/it-system-usage-details/it-system-usage-details-archiving/write-dialog/it-system-usage-details-journal-period-write-dialog.component';
import { ITSystemUsageDetailsContractsComponent } from './it-system-usages/it-system-usage-details/it-system-usage-details-contracts/it-system-usage-details-contracts.component';
import { ItSystemUsageDetailsDataProcessingComponent } from './it-system-usages/it-system-usage-details/it-system-usage-details-data-processing/it-system-usage-details-data-processing.component';
import { ItSystemUsageDetailsExternalReferencesComponent } from './it-system-usages/it-system-usage-details/it-system-usage-details-external-references/it-system-usage-details-external-references.component';
import { ITSystemUsageDetailsFrontpageCatalogComponent } from './it-system-usages/it-system-usage-details/it-system-usage-details-frontpage-catalog/it-system-usage-details-frontpage-catalog.component';
import { ITSystemUsageDetailsFrontpageInformationComponent } from './it-system-usages/it-system-usage-details/it-system-usage-details-frontpage-information/it-system-usage-details-frontpage-information.component';
import { ITSystemUsageDetailsFrontpageComponent } from './it-system-usages/it-system-usage-details/it-system-usage-details-frontpage/it-system-usage-details-frontpage.component';
import { DataSensitivitySectionComponent } from './it-system-usages/it-system-usage-details/it-system-usage-details-gdpr/data-sensitivity-section/data-sensitivity-section.component';
import { EditUrlDialogComponent } from './it-system-usages/it-system-usage-details/it-system-usage-details-gdpr/edit-url-dialog/edit-url-dialog.component';
import { EditUrlSectionComponent } from './it-system-usages/it-system-usage-details/it-system-usage-details-gdpr/edit-url-section/edit-url-section.component';
import { GdprBaseDateUrlSectionComponent } from './it-system-usages/it-system-usage-details/it-system-usage-details-gdpr/gdpr-base-date-url-section/gdpr-base-date-url-section.component';
import { GdprDpiaConductedSectionComponent } from './it-system-usages/it-system-usage-details/it-system-usage-details-gdpr/gdpr-dpia-conducted-section/gdpr-dpia-conducted-section.component';
import { GdprRetentionPeriodSectionComponent } from './it-system-usages/it-system-usage-details/it-system-usage-details-gdpr/gdpr-retention-period-section/gdpr-retention-period-section.component';
import { GdprRiskAssessmentSectionComponent } from './it-system-usages/it-system-usage-details/it-system-usage-details-gdpr/gdpr-risk-assessment-section/gdpr-risk-assessment-section.component';
import { GdprTechnicalPrecautionsSectionComponent } from './it-system-usages/it-system-usage-details/it-system-usage-details-gdpr/gdpr-technical-precautions-section/gdpr-technical-precautions-section.component';
import { GdprUserSupervisionSectionComponent } from './it-system-usages/it-system-usage-details/it-system-usage-details-gdpr/gdpr-user-supervision-section/gdpr-user-supervision-section.component';
import { GeneralInfoSectionComponent } from './it-system-usages/it-system-usage-details/it-system-usage-details-gdpr/general-info-section/general-info-section.component';
import { ItSystemUsageDetailsGdprComponent } from './it-system-usages/it-system-usage-details/it-system-usage-details-gdpr/it-system-usage-details-gdpr.component';
import { RegisteredDataCategoriesSectionComponent } from './it-system-usages/it-system-usage-details/it-system-usage-details-gdpr/registered-data-categories-section/registered-data-categories-section.component';
import { ItSystemUsageDetailsHierarchyComponent } from './it-system-usages/it-system-usage-details/it-system-usage-details-hierarchy/it-system-usage-details-hierarchy.component';
import { ItSystemUsageDetailsInterfacesComponent } from './it-system-usages/it-system-usage-details/it-system-usage-details-interfaces/it-system-usage-details-interfaces.component';
import { ItSystemUsageDetailsKleComponent } from './it-system-usages/it-system-usage-details/it-system-usage-details-kle/it-system-usage-details-kle.component';
import { UsageOrganizationCreateDialogComponent } from './it-system-usages/it-system-usage-details/it-system-usage-details-organization/create-dialog/usage-organization.create-dialog.component';
import { ItSystemUsageDetailsOrganizationComponent } from './it-system-usages/it-system-usage-details/it-system-usage-details-organization/it-system-usage-details-organization.component';
import { CreateRelationDialogComponent } from './it-system-usages/it-system-usage-details/it-system-usage-details-relations/create-relation-dialog/create-relation-dialog.component';
import { ItSystemUsageDetailsRelationsComponent } from './it-system-usages/it-system-usage-details/it-system-usage-details-relations/it-system-usage-details-relations.component';
import { ModifyRelationDialogComponent } from './it-system-usages/it-system-usage-details/it-system-usage-details-relations/modify-relation-dialog/modify-relation-dialog.component';
import { RelationTableComponent } from './it-system-usages/it-system-usage-details/it-system-usage-details-relations/relation-table/relation-table.component';
import { SystemRelationDialogComponent } from './it-system-usages/it-system-usage-details/it-system-usage-details-relations/system-relation-dialog/system-relation-dialog.component';
import { ItSystemUsageDetailsRolesComponent } from './it-system-usages/it-system-usage-details/it-system-usage-details-roles/it-system-usage-details-roles.component';
import { ITSystemUsageDetailsComponent } from './it-system-usages/it-system-usage-details/it-system-usage-details.component';
import { ITSystemUsageRemoveComponent } from './it-system-usages/it-system-usage-details/it-system-usage-remove/it-system-usage-remove.component';
import { ITSystemUsagesComponent } from './it-system-usages/it-system-usages.component';
import { ITSystemsComponent } from './it-systems.component';
import { ITSystemsRouterModule } from './it-systems.routes';
import { ItSystemHierarchyTableComponent } from './shared/it-system-hierarchy-table/it-system-hierarchy-table.component';
import { ItSystemInterfacesTableComponent } from './shared/it-system-interfaces-table/it-system-interfaces-table.component';
import { ItSystemKleOverviewComponent } from './shared/it-system-kle-overview/it-system-kle-overview.component';
import { KleTableComponent } from './shared/kle-table/kle-table.component';
import { ItSystemInterfacesComponent } from './it-system-interfaces/it-system-interfaces.component';
import { ItSystemInterfacesDetailsComponent } from './it-system-interfaces/it-system-interfaces-details/it-system-interfaces-details.component';
import { ItSystemInterfacesDetailsFrontpageComponent } from './it-system-interfaces/it-system-interfaces-details/it-system-interfaces-details-frontpage/it-system-interfaces-details-frontpage.component';
import { InterfaceDataWriteDialogComponent } from './it-system-interfaces/it-system-interfaces-details/it-system-interfaces-details-frontpage/interface-data-write-dialog/interface-data-write-dialog.component';

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
    ItSystemUsageDetailsHierarchyComponent,
    ItSystemHierarchyTableComponent,
    ItSystemUsageDetailsOrganizationComponent,
    UsageOrganizationCreateDialogComponent,
    ItSystemUsageDetailsRolesComponent,
    ItSystemUsageDetailsKleComponent,
    KleTableComponent,
    ItSystemKleOverviewComponent,
    ItSystemUsageDetailsRelationsComponent,
    RelationTableComponent,
    ModifyRelationDialogComponent,
    CreateRelationDialogComponent,
    SystemRelationDialogComponent,
    ItSystemUsageDetailsExternalReferencesComponent,
    ItSystemUsageDetailsArchivingComponent,
    ItSystemUsageDetailsJournalPeriodWriteDialogComponent,
    ItSystemUsageDetailsGdprComponent,
    EditUrlDialogComponent,
    EditUrlSectionComponent,
    GeneralInfoSectionComponent,
    DataSensitivitySectionComponent,
    RegisteredDataCategoriesSectionComponent,
    GdprBaseDateUrlSectionComponent,
    GdprUserSupervisionSectionComponent,
    GdprDpiaConductedSectionComponent,
    GdprRiskAssessmentSectionComponent,
    GdprRetentionPeriodSectionComponent,
    GdprTechnicalPrecautionsSectionComponent,
    ItSystemCatalogComponent,
    ItSystemCatalogDetailsFrontpageComponent,
    ItSystemCatalogDetailsComponent,
    ItSystemCatalogKleComponent,
    ItSystemCatalogInterfacesComponent,
    ItSystemCatalogReferencesComponent,
    ItSystemCatalogInterfacesComponent,
    ItSystemInterfacesComponent,
    ItSystemInterfacesDetailsComponent,
    ItSystemInterfacesDetailsFrontpageComponent,
    InterfaceDataWriteDialogComponent
  ],
  imports: [CommonModule, SharedModule, ITSystemsRouterModule, MatInputModule],
})
export class ItSystemsModule {}
