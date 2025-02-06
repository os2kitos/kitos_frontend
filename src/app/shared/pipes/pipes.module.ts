import { NgModule } from '@angular/core';
import { AppDatePipe } from './app-date.pipe';
import { SearchPropertyPipe } from './column-property.pipe';

@NgModule({
  declarations: [AppDatePipe, SearchPropertyPipe],
  exports: [AppDatePipe, SearchPropertyPipe],
})
export class PipesModule {}
