import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppPath } from 'src/app/shared/enums/app-path';
import { ItSystemCatalogDetailsFrontpageComponent } from './it-system-catalog/it-system-catalog-details/it-system-catalog-details-frontpage/it-system-catalog-details-frontpage.component';
import { ItSystemCatalogDetailsComponent } from './it-system-catalog/it-system-catalog-details/it-system-catalog-details.component';
import { ItSystemCatalogInterfacesComponent } from './it-system-catalog/it-system-catalog-details/it-system-catalog-interfaces/it-system-catalog-interfaces.component';
import { ItSystemCatalogKleComponent } from './it-system-catalog/it-system-catalog-details/it-system-catalog-kle/it-system-catalog-kle.component';
import { ItSystemCatalogComponent } from './it-system-catalog/it-system-catalog.component';
import { ItSystemUsageDetailsArchivingComponent } from './it-system-usages/it-system-usage-details/it-system-usage-details-archiving/it-system-usage-details-archiving.component';
import { ITSystemUsageDetailsContractsComponent } from './it-system-usages/it-system-usage-details/it-system-usage-details-contracts/it-system-usage-details-contracts.component';
import { ItSystemUsageDetailsDataProcessingComponent } from './it-system-usages/it-system-usage-details/it-system-usage-details-data-processing/it-system-usage-details-data-processing.component';
import { ItSystemUsageDetailsExternalReferencesComponent } from './it-system-usages/it-system-usage-details/it-system-usage-details-external-references/it-system-usage-details-external-references.component';
import { ITSystemUsageDetailsFrontpageComponent } from './it-system-usages/it-system-usage-details/it-system-usage-details-frontpage/it-system-usage-details-frontpage.component';
import { ItSystemUsageDetailsGdprComponent } from './it-system-usages/it-system-usage-details/it-system-usage-details-gdpr/it-system-usage-details-gdpr.component';
import { ItSystemUsageDetailsHierarchyComponent } from './it-system-usages/it-system-usage-details/it-system-usage-details-hierarchy/it-system-usage-details-hierarchy.component';
import { ItSystemUsageDetailsInterfacesComponent } from './it-system-usages/it-system-usage-details/it-system-usage-details-interfaces/it-system-usage-details-interfaces.component';
import { ItSystemUsageDetailsKleComponent } from './it-system-usages/it-system-usage-details/it-system-usage-details-kle/it-system-usage-details-kle.component';
import { ItSystemUsageDetailsOrganizationComponent } from './it-system-usages/it-system-usage-details/it-system-usage-details-organization/it-system-usage-details-organization.component';
import { ItSystemUsageDetailsRelationsComponent } from './it-system-usages/it-system-usage-details/it-system-usage-details-relations/it-system-usage-details-relations.component';
import { ItSystemUsageDetailsRolesComponent } from './it-system-usages/it-system-usage-details/it-system-usage-details-roles/it-system-usage-details-roles.component';
import { ITSystemUsageDetailsComponent } from './it-system-usages/it-system-usage-details/it-system-usage-details.component';
import { ITSystemUsagesComponent } from './it-system-usages/it-system-usages.component';
import { ITSystemsComponent } from './it-systems.component';

const routes: Routes = [
  {
    path: AppPath.root,
    component: ITSystemsComponent,
    children: [
      { path: AppPath.itSystemUsages, component: ITSystemUsagesComponent },
      {
        path: AppPath.itSystemUsagesDetails,
        component: ITSystemUsageDetailsComponent,
        children: [
          {
            path: AppPath.frontpage,
            component: ITSystemUsageDetailsFrontpageComponent,
          },
          {
            path: AppPath.contracts,
            component: ITSystemUsageDetailsContractsComponent,
          },
          {
            path: AppPath.dataProcessing,
            component: ItSystemUsageDetailsDataProcessingComponent,
          },
          {
            path: AppPath.gdpr,
            component: ItSystemUsageDetailsGdprComponent,
          },
          {
            path: AppPath.organization,
            component: ItSystemUsageDetailsOrganizationComponent,
          },
          {
            path: AppPath.itInterfaces,
            component: ItSystemUsageDetailsInterfacesComponent,
          },
          {
            path: AppPath.hierarchy,
            component: ItSystemUsageDetailsHierarchyComponent,
          },
          {
            path: AppPath.roles,
            component: ItSystemUsageDetailsRolesComponent,
          },
          {
            path: AppPath.kle,
            component: ItSystemUsageDetailsKleComponent,
          },
          {
            path: AppPath.relations,
            component: ItSystemUsageDetailsRelationsComponent,
          },
          {
            path: AppPath.externalReferences,
            component: ItSystemUsageDetailsExternalReferencesComponent,
          },
          {
            path: AppPath.archiving,
            component: ItSystemUsageDetailsArchivingComponent,
          },
          { path: AppPath.root, pathMatch: 'full', redirectTo: AppPath.frontpage },
        ],
      },
      { path: AppPath.itSystemCatalog, component: ItSystemCatalogComponent },
      {
        path: AppPath.itSystemCatalogDetails,
        component: ItSystemCatalogDetailsComponent,
        children: [
          { path: AppPath.frontpage, component: ItSystemCatalogDetailsFrontpageComponent },
          { path: AppPath.itInterfaces, component: ItSystemCatalogInterfacesComponent },
          { path: AppPath.kle, component: ItSystemCatalogKleComponent },
          { path: AppPath.root, pathMatch: 'full', redirectTo: AppPath.frontpage },
        ],
      },
      { path: AppPath.root, pathMatch: 'full', redirectTo: AppPath.itSystemUsages },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ITSystemsRouterModule {}
