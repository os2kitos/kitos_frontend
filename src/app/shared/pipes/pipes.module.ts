import { NgModule } from '@angular/core';
import { AppDatePipe } from './app-date.pipe';

@NgModule({
  declarations: [AppDatePipe],
  exports: [AppDatePipe],
})
export class PipesModule { }
