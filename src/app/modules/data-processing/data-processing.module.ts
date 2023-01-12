import { NgModule } from '@angular/core';
import { DataProcessingComponent } from './data-processing.component';
import { DataProcessingRouterModule } from './data-processing.routes';

@NgModule({
  declarations: [DataProcessingComponent],
  imports: [DataProcessingRouterModule],
})
export class DataProcessingModule {}
