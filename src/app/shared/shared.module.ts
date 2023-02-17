import { CommonModule } from '@angular/common';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ButtonsModule } from '@progress/kendo-angular-buttons';
import { DatePickerModule } from '@progress/kendo-angular-dateinputs';
import { DialogModule } from '@progress/kendo-angular-dialog';
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';
import { GridModule } from '@progress/kendo-angular-grid';
import { IconSettingsService, ICON_SETTINGS } from '@progress/kendo-angular-icons';
import { IndicatorsModule } from '@progress/kendo-angular-indicators';
import { InputsModule } from '@progress/kendo-angular-inputs';
import { LabelModule } from '@progress/kendo-angular-label';
import { BreadCrumbModule } from '@progress/kendo-angular-navigation';
import { NotificationModule } from '@progress/kendo-angular-notification';
import { RippleModule } from '@progress/kendo-angular-ripple';
import { CookieModule } from 'ngx-cookie';
import { BreadcrumbsComponent } from './components/breadcrumbs/breadcrumbs.component';
import { ButtonComponent } from './components/button/button.component';
import { CardHeaderComponent } from './components/card-header/card-header.component';
import { CardComponent } from './components/card/card.component';
import { CheckboxComponent } from './components/checkbox/checkbox.component';
import { DropdownComponent } from './components/dropdown/dropdown.component';
import { BooleanFilterComponent } from './components/grid/boolean-filter/boolean-filter.component';
import { DateFilterComponent } from './components/grid/date-filter/date-filter.component';
import { GridComponent } from './components/grid/grid.component';
import { NumericFilterComponent } from './components/grid/numeric-filter/numeric-filter.component';
import { PagerComponent } from './components/grid/pager/pager.component';
import { StringFilterComponent } from './components/grid/string-filter/string-filter.component';
import { IconModule } from './components/icons/icons.module';
import { LoadingComponent } from './components/loading/loading.component';
import { NotificationComponent } from './components/notification/notification.component';
import { TextBoxComponent } from './components/textbox/textbox.component';
import { AfterValueChangedDirective } from './directives/after-value-changed.directive';
import { HideInProdDirective } from './directives/hide-in-prod.directive';
import { HttpXSRFInterceptor } from './interceptors/HttpXSRF.interceptor';
import { AppDatePipe } from './pipes/app-date.pipe';
import { IconService } from './services/icon.service';

@NgModule({
  declarations: [
    ButtonComponent,
    GridComponent,
    LoadingComponent,
    HideInProdDirective,
    AfterValueChangedDirective,
    NotificationComponent,
    TextBoxComponent,
    DropdownComponent,
    StringFilterComponent,
    BooleanFilterComponent,
    NumericFilterComponent,
    DateFilterComponent,
    CheckboxComponent,
    PagerComponent,
    BreadcrumbsComponent,
    CardComponent,
    CardHeaderComponent,
    AppDatePipe,
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
    BreadCrumbModule,
    IndicatorsModule,
    RippleModule,
    DialogModule,
    DropDownsModule,
    IconModule,
    DatePickerModule,
    NotificationModule,
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
    TextBoxComponent,
    DropdownComponent,
    DialogModule,
    IconModule,
    LabelModule,
    ReactiveFormsModule,
    TextBoxComponent,
    BreadcrumbsComponent,
    CardComponent,
    CardHeaderComponent,
    AppDatePipe,
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: HttpXSRFInterceptor, multi: true },
    { provide: ICON_SETTINGS, useValue: { type: 'svg' } },
    { provide: IconSettingsService, useClass: IconService },
  ],
})
export class SharedModule {}
