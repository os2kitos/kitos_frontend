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

@NgModule({
  declarations: [DataProcessingComponent, DataProcessingOverviewComponent, DataProcessingDetailsComponent, DataProcessingFrontpageComponent],
  imports: [DataProcessingRouterModule, CommonModule, SharedModule, MatSelectModule, NgSelectModule],
})
export class DataProcessingModule {}
