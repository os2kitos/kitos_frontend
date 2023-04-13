import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MAT_DIALOG_DEFAULT_OPTIONS, MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterModule } from '@angular/router';
import { NgSelectModule } from '@ng-select/ng-select';
import { ButtonsModule } from '@progress/kendo-angular-buttons';
import { DatePickerModule } from '@progress/kendo-angular-dateinputs';
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';
import { GridModule } from '@progress/kendo-angular-grid';
import { IndicatorsModule } from '@progress/kendo-angular-indicators';
import { InputsModule } from '@progress/kendo-angular-inputs';
import { LabelModule } from '@progress/kendo-angular-label';
import { RippleModule } from '@progress/kendo-angular-ripple';
import { DIALOG_DEFAULT_WIDTH } from '../constants';
import { DirectivesModule } from '../directives/directives.module';
import { PipesModule } from '../pipes/pipes.module';
import { BreadcrumbComponent } from './breadcrumb/breadcrumb.component';
import { BreadcrumbsComponent } from './breadcrumbs/breadcrumbs.component';
import { ButtonComponent } from './button/button.component';
import { CardHeaderComponent } from './card-header/card-header.component';
import { CardComponent } from './card/card.component';
import { CheckboxComponent } from './checkbox/checkbox.component';
import { ChipComponent } from './chip/chip.component';
import { ConfirmationDialogComponent } from './confirmation-dialog/confirmation-dialog.component';
import { ContentBoxComponent } from './contentbox/contentbox.component';
import { DatePickerComponent } from './datepicker/datepicker.component';
import { DetailsPageLinkComponent } from './details-page-link/details-page-link.component';
import { DialogActionsComponent } from './dialog-actions/dialog-actions.component';
import { DialogComponent } from './dialog/dialog.component';
import { DropdownComponent } from './dropdown/dropdown.component';
import { EmptyStateAddNewComponent } from './empty-states/empty-state-add-new/empty-state-add-new.component';
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
import { OrgUnitSelectComponent } from './org-unit-select/org-unit-select.component';
import { ParagraphComponent } from './paragraph/paragraph.component';
import { RoleTableComponent } from './role-table/role-table.component';
import { SegmentComponent } from './segment/segment.component';
import { SelectedOptionTypeTextComponent } from './selected-option-type-text/selected-option-type-text.component';
import { SpacerComponent } from './spacer/spacer.component';
import { StatusChipComponent } from './status-chip/status-chip.component';
import { TextAreaComponent } from './textarea/textarea.component';
import { TextBoxInfoComponent } from './textbox-info/textbox-info.component';
import { TextBoxComponent } from './textbox/textbox.component';
import { TooltipComponent } from './tooltip/tooltip.component';
import { TreeNodeDropdownComponent } from './tree-node-dropdown/tree-node-dropdown.component';
import { YesNoStatusComponent } from './yes-no-status/yes-no-status.component';
import { RoleTableCreateDialogComponent } from './role-table/role-table.create-dialog/role-table.create-dialog.component';
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
    BreadcrumbComponent,
    EmptyStateAddNewComponent,
    OrgUnitSelectComponent,
    TreeNodeDropdownComponent,
    ConfirmationDialogComponent,
    RoleTableComponent,
    RoleTableCreateDialogComponent,
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
    MatInputModule,
    GridModule,
    IndicatorsModule,
    RippleModule,
    MatDialogModule,
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
    BreadcrumbComponent,
    EmptyStateAddNewComponent,
    OrgUnitSelectComponent,
    TreeNodeDropdownComponent,
    RoleTableComponent,
  ],
  providers: [
    {
      provide: MAT_DIALOG_DEFAULT_OPTIONS,
      useValue: { panelClass: 'mat-typography', autoFocus: false, width: DIALOG_DEFAULT_WIDTH },
    },
  ],
})
export class ComponentsModule {}
