import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatSelectModule } from '@angular/material/select';
import { NgSelectModule } from '@ng-select/ng-select';
import { SharedModule } from 'src/app/shared/shared.module';
import { DataProcessingOverviewComponent } from './data-processing-overview/data-processing-overview.component';
import { DataProcessingComponent } from './data-processing.component';
import { DataProcessingRouterModule } from './data-processing.routes';
import { DataProcessingDetailsComponent } from './data-processing-details/data-processing-details.component';
import { DataProcessingFrontpageComponent } from './data-processing-details/data-processing-frontpage/data-processing-frontpage.component';
import { ThirdCountriesTableComponent } from './data-processing-details/data-processing-frontpage/third-countries-table/third-countries-table.component';
import { CountryCreateDialogComponent } from './data-processing-details/data-processing-frontpage/third-countries-table/country-create-dialog/country-create-dialog.component';
import { ProcessorsTableComponent } from './data-processing-details/data-processing-frontpage/processors-table/processors-table.component';
import { CreateProcessorDialogComponent } from './data-processing-details/data-processing-frontpage/processors-table/create-processor-dialog/create-processor-dialog.component';
import { SubProcessorsTableComponent } from './data-processing-details/data-processing-frontpage/sub-processors-table/sub-processors-table.component';
import { CreateSubProcessorDialogComponent } from './data-processing-details/data-processing-frontpage/sub-processors-table/create-sub-processor-dialog/create-sub-processor-dialog.component';
import { DataProcessingItSystemsComponent } from './data-processing-details/data-processing-it-systems/data-processing-it-systems.component';
import { CreateDprSystemUsageComponent } from './data-processing-details/data-processing-it-systems/create-dpr-system-usage/create-dpr-system-usage.component';

@NgModule({
  declarations: [DataProcessingComponent, DataProcessingOverviewComponent, DataProcessingDetailsComponent, DataProcessingFrontpageComponent, ThirdCountriesTableComponent, CountryCreateDialogComponent, ProcessorsTableComponent, CreateProcessorDialogComponent, SubProcessorsTableComponent, CreateSubProcessorDialogComponent, DataProcessingItSystemsComponent, CreateDprSystemUsageComponent],
  imports: [DataProcessingRouterModule, CommonModule, SharedModule, MatSelectModule, NgSelectModule],
})
export class DataProcessingModule {}
