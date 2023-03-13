import { NgModule } from '@angular/core';
import { AfterValueChangedDirective } from './after-value-changed.directive';
import { HideInProdDirective } from './hide-in-prod.directive';

@NgModule({
  declarations: [AfterValueChangedDirective, HideInProdDirective],
  exports: [AfterValueChangedDirective, HideInProdDirective],
})
export class DirectivesModule {}
