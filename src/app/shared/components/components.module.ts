import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterModule } from '@angular/router';
import { NgSelectModule } from '@ng-select/ng-select';
import { ButtonsModule } from '@progress/kendo-angular-buttons';
import { DatePickerModule } from '@progress/kendo-angular-dateinputs';
import { DialogModule } from '@progress/kendo-angular-dialog';
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';
import { GridModule } from '@progress/kendo-angular-grid';
import { IndicatorsModule } from '@progress/kendo-angular-indicators';
import { InputsModule } from '@progress/kendo-angular-inputs';
import { LabelModule } from '@progress/kendo-angular-label';
import { BreadCrumbModule } from '@progress/kendo-angular-navigation';
import { RippleModule } from '@progress/kendo-angular-ripple';
import { DirectivesModule } from '../directives/directives.module';
import { PipesModule } from '../pipes/pipes.module';
import { BreadcrumbsComponent } from './breadcrumbs/breadcrumbs.component';
import { ButtonComponent } from './button/button.component';
import { CardHeaderComponent } from './card-header/card-header.component';
import { CardComponent } from './card/card.component';
import { CheckboxComponent } from './checkbox/checkbox.component';
import { ChipComponent } from './chip/chip.component';
import { ContentBoxComponent } from './contentbox/contentbox.component';
import { DatePickerComponent } from './datepicker/datepicker.component';
import { DetailsPageLinkComponent } from './details-page-link/details-page-link.component';
import { DialogActionsComponent } from './dialog-actions/dialog-actions.component';
import { DialogComponent } from './dialog/dialog.component';
import { DropdownComponent } from './dropdown/dropdown.component';
import { ExternalPageLinkComponent } from './external-page-link/external-page-link.component';
import { ExternalReferenceComponent } from './external-reference/external-reference.component';
import { BooleanFilterComponent } from './grid/boolean-filter/boolean-filter.component';
import { DateFilterComponent } from './grid/date-filter/date-filter.component';
import { GridComponent } from './grid/grid.component';
import { NumericFilterComponent } from './grid/numeric-filter/numeric-filter.component';
import { PagerComponent } from './grid/pager/pager.component';
import { StringFilterComponent } from './grid/string-filter/string-filter.component';
import { HelpButtonComponent } from './help-button/help-button.component';
import { HelpDialogComponent } from './help-dialog/help-dialog.component';
import { IconsModule } from './icons/icons.module';
import { LoadingComponent } from './loading/loading.component';
import { NativeTableComponent } from './native-table/native-table.component';
import { NavigationDrawerComponent } from './navigation-drawer/navigation-drawer.component';
import { NotificationComponent } from './notification/notification.component';
import { NotificationsComponent } from './notifications/notifications.component';
import { ParagraphComponent } from './paragraph/paragraph.component';
import { SegmentComponent } from './segment/segment.component';
import { SelectedOptionTypeTextComponent } from './selected-option-type-text/selected-option-type-text.component';
import { SpacerComponent } from './spacer/spacer.component';
import { StatusChipComponent } from './status-chip/status-chip.component';
import { TextAreaComponent } from './textarea/textarea.component';
import { TextBoxInfoComponent } from './textbox-info/textbox-info.component';
import { TextBoxComponent } from './textbox/textbox.component';
import { TooltipComponent } from './tooltip/tooltip.component';
import { YesNoStatusComponent } from './yes-no-status/yes-no-status.component';
@NgModule({
  declarations: [
    ButtonComponent,
    GridComponent,
    LoadingComponent,
    NotificationComponent,
    TextBoxComponent,
    TextAreaComponent,
    DropdownComponent,
    DatePickerComponent,
    StringFilterComponent,
    BooleanFilterComponent,
    NumericFilterComponent,
    DateFilterComponent,
    NavigationDrawerComponent,
    CheckboxComponent,
    PagerComponent,
    BreadcrumbsComponent,
    ChipComponent,
    CardComponent,
    CardHeaderComponent,
    StatusChipComponent,
    DialogComponent,
    DialogActionsComponent,
    SegmentComponent,
    TextBoxInfoComponent,
    ContentBoxComponent,
    ExternalReferenceComponent,
    ParagraphComponent,
    DetailsPageLinkComponent,
    NativeTableComponent,
    HelpButtonComponent,
    HelpDialogComponent,
    YesNoStatusComponent,
    SelectedOptionTypeTextComponent,
    ExternalPageLinkComponent,
    SpacerComponent,
    NotificationsComponent,
    TooltipComponent,
  ],
  imports: [
    CommonModule,
    MatButtonModule,
    ButtonsModule,
    InputsModule,
    LabelModule,
    NgSelectModule,
    FormsModule,
    ReactiveFormsModule,
    GridModule,
    BreadCrumbModule,
    IndicatorsModule,
    RippleModule,
    DialogModule,
    DropDownsModule,
    DatePickerModule,
    IconsModule,
    PipesModule,
    DirectivesModule,
    RouterModule,
    MatTooltipModule,
    MatButtonToggleModule,
    MatCheckboxModule,
  ],
  exports: [
    CommonModule,
    IconsModule,
    ButtonComponent,
    CheckboxComponent,
    GridComponent,
    LoadingComponent,
    TextBoxComponent,
    TextAreaComponent,
    DropdownComponent,
    DatePickerComponent,
    NavigationDrawerComponent,
    TextBoxComponent,
    BreadcrumbsComponent,
    ChipComponent,
    CardComponent,
    CardHeaderComponent,
    StatusChipComponent,
    DialogComponent,
    DialogActionsComponent,
    SegmentComponent,
    TextBoxInfoComponent,
    ContentBoxComponent,
    ExternalReferenceComponent,
    ParagraphComponent,
    DetailsPageLinkComponent,
    NativeTableComponent,
    HelpButtonComponent,
    YesNoStatusComponent,
    SelectedOptionTypeTextComponent,
    ExternalPageLinkComponent,
    SpacerComponent,
    NotificationsComponent,
    TooltipComponent,
  ],
})
export class ComponentsModule {}
