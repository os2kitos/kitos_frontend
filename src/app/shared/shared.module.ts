import { CommonModule } from '@angular/common';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgSelectModule } from '@ng-select/ng-select';
import { ButtonsModule } from '@progress/kendo-angular-buttons';
import { DatePickerModule } from '@progress/kendo-angular-dateinputs';
import { DialogModule } from '@progress/kendo-angular-dialog';
import { GridModule } from '@progress/kendo-angular-grid';
import { IndicatorsModule } from '@progress/kendo-angular-indicators';
import { InputsModule } from '@progress/kendo-angular-inputs';
import { LabelModule } from '@progress/kendo-angular-label';
import { NotificationModule } from '@progress/kendo-angular-notification';
import { RippleModule } from '@progress/kendo-angular-ripple';
import { CookieModule } from 'ngx-cookie';
import { ButtonComponent } from './components/button/button.component';
import { CheckboxComponent } from './components/checkbox/checkbox.component';
import { BooleanFilterComponent } from './components/grid/boolean-filter/boolean-filter.component';
import { DateFilterComponent } from './components/grid/date-filter/date-filter.component';
import { GridComponent } from './components/grid/grid.component';
import { NumericFilterComponent } from './components/grid/numeric-filter/numeric-filter.component';
import { StringFilterComponent } from './components/grid/string-filter/string-filter.component';
import { IconModule } from './components/icons/icons.module';
import { LoadingComponent } from './components/loading/loading.component';
import { NotificationComponent } from './components/notification/notification.component';
import { TextBoxComponent } from './components/textbox/textbox.component';
import { AfterValueChangedDirective } from './directives/after-value-changed.directive';
import { HideInProdDirective } from './directives/hide-in-prod.directive';
import { HttpXSRFInterceptor } from './interceptors/HttpXSRF.interceptor';

@NgModule({
  declarations: [
    ButtonComponent,
    GridComponent,
    LoadingComponent,
    HideInProdDirective,
    AfterValueChangedDirective,
    NotificationComponent,
    TextBoxComponent,
    StringFilterComponent,
    BooleanFilterComponent,
    NumericFilterComponent,
    DateFilterComponent,
    CheckboxComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,
    ButtonsModule,
    InputsModule,
    LabelModule,
    FormsModule,
    ReactiveFormsModule,
    GridModule,
    IndicatorsModule,
    RippleModule,
    DialogModule,
    IconModule,
    DatePickerModule,
    NotificationModule,
    NgSelectModule,
    CookieModule.withOptions(),
  ],
  exports: [
    CommonModule,
    ButtonComponent,
    CheckboxComponent,
    GridComponent,
    LoadingComponent,
    HideInProdDirective,
    AfterValueChangedDirective,
    DialogModule,
    IconModule,
    TextBoxComponent,
    NgSelectModule,
  ],
  providers: [{ provide: HTTP_INTERCEPTORS, useClass: HttpXSRFInterceptor, multi: true }],
})
export class SharedModule {}
