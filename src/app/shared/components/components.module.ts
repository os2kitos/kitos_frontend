import { Overlay, RepositionScrollStrategy } from '@angular/cdk/overlay';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { ErrorStateMatcher, MAT_DATE_FORMATS } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MAT_DIALOG_DEFAULT_OPTIONS, MAT_DIALOG_SCROLL_STRATEGY, MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatTreeModule } from '@angular/material/tree';
import { RouterModule } from '@angular/router';
import { NgSelectModule } from '@ng-select/ng-select';
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';
import { GridModule } from '@progress/kendo-angular-grid';
import '@progress/kendo-angular-intl/locales/da/all';
import { EditorModule } from '@tinymce/tinymce-angular';
import { DIALOG_DEFAULT_WIDTH } from '../constants';
import { DirectivesModule } from '../directives/directives.module';
import { OnInvalidErrorStateMatcher } from '../helpers/on-invalid-error-state-matcher';
import { PipesModule } from '../pipes/pipes.module';
import { AccordionComponent } from './accordion/accordion.component';
import { BreadcrumbComponent } from './breadcrumb/breadcrumb.component';
import { BreadcrumbsComponent } from './breadcrumbs/breadcrumbs.component';
import { ButtonComponent } from './buttons/button/button.component';
import { IconButtonComponent } from './buttons/icon-button/icon-button.component';
import { CardHeaderComponent } from './card-header/card-header.component';
import { CardComponent } from './card/card.component';
import { CheckboxComponent } from './checkbox/checkbox.component';
import { ChipComponent } from './chip/chip.component';
import { CollectionExtensionButtonComponent } from './collection-extension-button/collection-extension-button.component';
import { ContentSpaceBetweenComponent } from './content-space-between/content-space-between.component';
import { ContentVerticalCenterComponent } from './content-vertical-center/content-vertical-center.component';
import { ContentWithInfoComponent } from './content-with-info/content-with-info.component';
import { ContentWithTooltipComponent } from './content-with-tooltip/content-with-tooltip.component';
import { ContentBoxComponent } from './contentbox/contentbox.component';
import { DatePickerComponent } from './datepicker/datepicker.component';
import { DetailsHeaderComponent } from './details-header/details-header.component';
import { DetailsPageLinkComponent } from './details-page-link/details-page-link.component';
import { ConfirmationDialogComponent } from './dialogs/confirmation-dialog/confirmation-dialog.component';
import { ConnectedDropdownDialogComponent } from './dialogs/connected-dropdown-dialog/connected-dropdown-dialog.component';
import { DialogActionsComponent } from './dialogs/dialog-actions/dialog-actions.component';
import { DialogHeaderComponent } from './dialogs/dialog/dialog-header/dialog-header.component';
import { DialogComponent } from './dialogs/dialog/dialog.component';
import { ScrollbarDialogComponent } from './dialogs/dialog/scrollbar-dialog/scrollbar-dialog.component';
import { DropdownDialogComponent } from './dialogs/dropdown-dialog/dropdown-dialog.component';
import { IconConfirmationDialogComponent } from './dialogs/icon-confirmation-dialog/icon-confirmation-dialog.component';
import { InfoDialogComponent } from './dialogs/info-dialog/info-dialog.component';
import { LinkWriteDialogComponent } from './dialogs/link-write-dialog/link-write-dialog.component';
import { DividerComponent } from './divider/divider.component';
import { ConnectedDropdownComponent } from './dropdowns/connected-dropdown/connected-dropdown.component';
import { DropdownComponent } from './dropdowns/dropdown/dropdown.component';
import { TreeNodeDropdownComponent } from './dropdowns/tree-node-dropdown/tree-node-dropdown.component';
import { EmptyStateComponent } from './empty-states/empty-state.component';
import { CreateEntityButtonComponent } from './entity-creation/create-entity-button/create-entity-button.component';
import { CreateEntityDialogActionButtonsComponent } from './entity-creation/create-entity-dialog-action-buttons/create-entity-dialog-action-buttons.component';
import { CreateEntityWithNameDialogComponent } from './entity-creation/create-entity-with-name-dialog/create-entity-with-name-dialog.component';
import { ExternalPageLinkComponent } from './external-page-link/external-page-link.component';
import { ExternalReferenceComponent } from './external-reference/external-reference.component';
import { CreateExternalReferenceDialogComponent } from './external-references-management/create-external-reference-dialog/create-external-reference-dialog.component';
import { EditExternalReferenceDialogComponent } from './external-references-management/edit-external-reference-dialog/edit-external-reference-dialog.component';
import { ExternalReferenceDialogComponent } from './external-references-management/external-reference-dialog/external-reference-dialog.component';
import { ExternalReferencesManagementComponent } from './external-references-management/external-references-management.component';
import { FormGridComponent } from './form-grid/form-grid.component';
import { DateFilterComponent } from './grid/date-filter/date-filter.component';
import { DropdownFilterComponent } from './grid/dropdown-filter/dropdown-filter.component';
import { GridPaginatorComponent } from './grid/grid-paginator/grid-paginator.component';
import { GridComponent } from './grid/grid.component';
import { HideShowButtonComponent } from './grid/hide-show-button/hide-show-button.component';
import { HideShowDialogComponent } from './grid/hide-show-dialog/hide-show-dialog.component';
import { NumericFilterComponent } from './grid/numeric-filter/numeric-filter.component';
import { StringFilterComponent } from './grid/string-filter/string-filter.component';
import { HelpButtonComponent } from './help-button/help-button.component';
import { HelpDialogComponent } from './help-dialog/help-dialog.component';
import { IconsModule } from './icons/icons.module';
import { LinkTextboxComponent } from './link-textbox/link-textbox.component';
import { LoadingComponent } from './loading/loading.component';
import { NativeTableComponent } from './native-table/native-table.component';
import { NavigationDrawerComponent } from './navigation-drawer/navigation-drawer.component';
import { NotificationsTableDialogComponent } from './notifications-table/notifications-table-dialog/notifications-table-dialog.component';
import { NotificationsTableSentDialogComponent } from './notifications-table/notifications-table-sent-dialog/notifications-table-sent-dialog.component';
import { NotificationsTableComponent } from './notifications-table/notifications-table.component';
import { NumericInputComponent } from './numeric-input/numeric-input.component';
import { OrgUnitSelectComponent } from './org-unit-select/org-unit-select.component';
import { OverviewHeaderComponent } from './overview-header/overview-header.component';
import { ParagraphComponent } from './paragraph/paragraph.component';
import { PopupMessageComponent } from './popup-message/popup-message.component';
import { PopupMessagesComponent } from './popup-messages/popup-messages.component';
import { RadioButtonsComponent } from './radio-buttons/radio-buttons.component';
import { RoleTableComponent } from './role-table/role-table.component';
import { RoleTableCreateDialogComponent } from './role-table/role-table.create-dialog/role-table.create-dialog.component';
import { SegmentComponent } from './segment/segment.component';
import { SelectKleDialogComponent } from './select-kle-dialog/select-kle-dialog.component';
import { SelectedOptionTypeTextComponent } from './selected-option-type-text/selected-option-type-text.component';
import { SpacerComponent } from './spacer/spacer.component';
import { StandardVerticalContentGridComponent } from './standard-vertical-content-grid/standard-vertical-content-grid.component';
import { StatusChipComponent } from './status-chip/status-chip.component';
import { TableRowActionsComponent } from './table-row-actions/table-row-actions.component';
import { TextAreaComponent } from './textarea/textarea.component';
import { TextBoxInfoComponent } from './textbox-info/textbox-info.component';
import { TextBoxComponent } from './textbox/textbox.component';
import { TooltipComponent } from './tooltip/tooltip.component';
import { EntityTreeComponent } from './tree/entity-tree.component';
import { YesNoStatusComponent } from './yes-no-status/yes-no-status.component';
import { UnitDropdownFilterComponent } from './grid/unit-dropdown-filter/unit-dropdown-filter.component';
import { ChoiceTypeDropdownFilterComponent } from './grid/choice-type-dropdown-filter/choice-type-dropdown-filter.component';
import { UsagesComponent } from './usages/usages.component';


export function scrollFactory(overlay: Overlay): () => RepositionScrollStrategy {
  return () => overlay.scrollStrategies.reposition();
}

@NgModule({
  declarations: [
    ButtonComponent,
    GridComponent,
    GridPaginatorComponent,
    LoadingComponent,
    PopupMessageComponent,
    TextBoxComponent,
    TextAreaComponent,
    DropdownComponent,
    DatePickerComponent,
    NavigationDrawerComponent,
    CheckboxComponent,
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
    PopupMessageComponent,
    PopupMessagesComponent,
    TooltipComponent,
    BreadcrumbComponent,
    EntityTreeComponent,
    EmptyStateComponent,
    OrgUnitSelectComponent,
    TreeNodeDropdownComponent,
    ConfirmationDialogComponent,
    RoleTableComponent,
    RoleTableCreateDialogComponent,
    ContentWithTooltipComponent,
    ContentSpaceBetweenComponent,
    CollectionExtensionButtonComponent,
    ConnectedDropdownComponent,
    SelectKleDialogComponent,
    DividerComponent,
    StandardVerticalContentGridComponent,
    IconButtonComponent,
    ExternalReferencesManagementComponent,
    ExternalReferenceDialogComponent,
    CreateExternalReferenceDialogComponent,
    EditExternalReferenceDialogComponent,
    TableRowActionsComponent,
    RadioButtonsComponent,
    NumericInputComponent,
    FormGridComponent,
    ContentVerticalCenterComponent,
    NotificationsTableComponent,
    NotificationsTableDialogComponent,
    ScrollbarDialogComponent,
    AccordionComponent,
    LinkTextboxComponent,
    OverviewHeaderComponent,
    InfoDialogComponent,
    IconConfirmationDialogComponent,
    DialogHeaderComponent,
    LinkWriteDialogComponent,
    ConnectedDropdownDialogComponent,
    CreateEntityWithNameDialogComponent,
    CreateEntityButtonComponent,
    CreateEntityDialogActionButtonsComponent,
    NotificationsTableSentDialogComponent,
    DropdownDialogComponent,
    DetailsHeaderComponent,
    ContentWithInfoComponent,
    DateFilterComponent,
    NumericFilterComponent,
    StringFilterComponent,
    HideShowButtonComponent,
    HideShowDialogComponent,
    DropdownFilterComponent,
    UnitDropdownFilterComponent,
    ChoiceTypeDropdownFilterComponent,
    UsagesComponent
  ],
  imports: [
    CommonModule,
    MatButtonModule,
    NgSelectModule,
    FormsModule,
    MatSelectModule,
    ReactiveFormsModule,
    MatInputModule,
    MatTableModule,
    MatPaginatorModule,
    MatDialogModule,
    IconsModule,
    PipesModule,
    DirectivesModule,
    RouterModule,
    MatTooltipModule,
    MatButtonToggleModule,
    MatCheckboxModule,
    MatDatepickerModule,
    MatMomentDateModule,
    MatIconModule,
    MatTreeModule,
    MatDividerModule,
    MatExpansionModule,
    MatRadioModule,
    EditorModule,
    MatProgressSpinnerModule,
    GridModule,
    DropDownsModule,
  ],
  exports: [
    CommonModule,
    IconsModule,
    ButtonComponent,
    CheckboxComponent,
    GridComponent,
    GridPaginatorComponent,
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
    ScrollbarDialogComponent,
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
    PopupMessageComponent,
    PopupMessagesComponent,
    TooltipComponent,
    BreadcrumbComponent,
    EntityTreeComponent,
    EmptyStateComponent,
    OrgUnitSelectComponent,
    TreeNodeDropdownComponent,
    RoleTableComponent,
    ContentWithTooltipComponent,
    ContentSpaceBetweenComponent,
    CollectionExtensionButtonComponent,
    StandardVerticalContentGridComponent,
    ConnectedDropdownComponent,
    IconButtonComponent,
    ExternalReferencesManagementComponent,
    TableRowActionsComponent,
    AccordionComponent,
    RadioButtonsComponent,
    NumericInputComponent,
    FormGridComponent,
    ContentVerticalCenterComponent,
    NotificationsTableComponent,
    NotificationsTableDialogComponent,
    LinkTextboxComponent,
    LinkTextboxComponent,
    OverviewHeaderComponent,
    InfoDialogComponent,
    IconConfirmationDialogComponent,
    DialogHeaderComponent,
    LinkWriteDialogComponent,
    ConnectedDropdownDialogComponent,
    CreateEntityButtonComponent,
    CreateEntityDialogActionButtonsComponent,
    DropdownDialogComponent,
    DetailsHeaderComponent,
    ContentWithInfoComponent,
    HideShowButtonComponent,
  ],
  providers: [
    { provide: ErrorStateMatcher, useClass: OnInvalidErrorStateMatcher },
    {
      provide: MAT_DIALOG_SCROLL_STRATEGY,
      useFactory: scrollFactory,
      deps: [Overlay],
    },
    {
      provide: MAT_DIALOG_DEFAULT_OPTIONS,
      useValue: {
        panelClass: 'mat-typography',
        autoFocus: false,
        width: DIALOG_DEFAULT_WIDTH,
      },
    },
    {
      provide: MAT_DATE_FORMATS,
      useValue: {
        parse: {
          dateInput: ['DD-MM-yyyy', 'DDMMyyyy'],
        },
        display: {
          dateInput: 'DD-MM-yyyy',
          monthYearLabel: 'MMM YYYY',
          dateA11yLabel: 'LL',
          monthYearA11yLabel: 'MMMM YYYY',
        },
      },
    },
  ],
})
export class ComponentsModule {}
