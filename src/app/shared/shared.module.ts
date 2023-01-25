import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ButtonsModule } from '@progress/kendo-angular-buttons';
import { GridModule } from '@progress/kendo-angular-grid';
import { IndicatorsModule } from '@progress/kendo-angular-indicators';
import { RippleModule } from '@progress/kendo-angular-ripple';
import { ButtonComponent } from './components/button/button.component';
import { GridComponent } from './components/grid/grid.component';
import { IconModule } from './components/icons/icons.module';
import { LoadingComponent } from './components/loading/loading.component';
import { HideInProdDirective } from './directives/hide-in-prod.directive';

@NgModule({
  declarations: [ButtonComponent, GridComponent, LoadingComponent, HideInProdDirective],
  imports: [CommonModule, RouterModule, ButtonsModule, GridModule, IndicatorsModule, RippleModule, IconModule],
  exports: [ButtonComponent, GridComponent, LoadingComponent, HideInProdDirective, IconModule],
  bootstrap: [],
})
export class SharedModule {}
