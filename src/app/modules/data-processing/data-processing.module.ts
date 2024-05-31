import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatSelectModule } from '@angular/material/select';
import { NgSelectModule } from '@ng-select/ng-select';
import { SharedModule } from 'src/app/shared/shared.module';
import { DataProcessingDetailsComponent } from './data-processing-details/data-processing-details.component';
import { DataProcessingFrontpageComponent } from './data-processing-details/data-processing-frontpage/data-processing-frontpage.component';
import { CreateProcessorDialogComponent } from './data-processing-details/data-processing-frontpage/processors-table/create-processor-dialog/create-processor-dialog.component';
import { ProcessorsTableComponent } from './data-processing-details/data-processing-frontpage/processors-table/processors-table.component';
import { CreateSubProcessorDialogComponent } from './data-processing-details/data-processing-frontpage/sub-processors-table/create-sub-processor-dialog/create-sub-processor-dialog.component';
import { SubProcessorsTableComponent } from './data-processing-details/data-processing-frontpage/sub-processors-table/sub-processors-table.component';
import { CountryCreateDialogComponent } from './data-processing-details/data-processing-frontpage/third-countries-table/country-create-dialog/country-create-dialog.component';
import { ThirdCountriesTableComponent } from './data-processing-details/data-processing-frontpage/third-countries-table/third-countries-table.component';
import { CreateDprSystemUsageComponent } from './data-processing-details/data-processing-it-systems/create-dpr-system-usage/create-dpr-system-usage.component';
import { DataProcessingItSystemsComponent } from './data-processing-details/data-processing-it-systems/data-processing-it-systems.component';
import { DataProcessingNotificationsComponent } from './data-processing-details/data-processing-notifications/data-processing-notifications.component';
import { DataProcessingReferencesComponent } from './data-processing-details/data-processing-references/data-processing-references.component';
import { DataProcessingRolesComponent } from './data-processing-details/data-processing-roles/data-processing-roles.component';
import { DataProcessingOverviewComponent } from './data-processing-overview/data-processing-overview.component';
import { DataProcessingComponent } from './data-processing.component';
import { DataProcessingRouterModule } from './data-processing.routes';

@NgModule({
  declarations: [
    DataProcessingComponent,
    DataProcessingOverviewComponent,
    DataProcessingDetailsComponent,
    DataProcessingFrontpageComponent,
    ThirdCountriesTableComponent,
    CountryCreateDialogComponent,
    ProcessorsTableComponent,
    CreateProcessorDialogComponent,
    SubProcessorsTableComponent,
    CreateSubProcessorDialogComponent,
    DataProcessingNotificationsComponent,
    DataProcessingItSystemsComponent,
    CreateDprSystemUsageComponent,
    DataProcessingRolesComponent,
    DataProcessingReferencesComponent
  ],
  imports: [
    DataProcessingRouterModule,
    CommonModule,
    SharedModule,
    MatSelectModule,
    NgSelectModule,
  ],
})
export class DataProcessingModule { }
