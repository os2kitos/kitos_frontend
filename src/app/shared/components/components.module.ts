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
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorIntl, MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatTreeModule } from '@angular/material/tree';
import { RouterModule } from '@angular/router';
import { NgSelectModule } from '@ng-select/ng-select';
import { DIALOG_DEFAULT_WIDTH } from '../constants';
import { DirectivesModule } from '../directives/directives.module';
import { PipesModule } from '../pipes/pipes.module';
import { BreadcrumbComponent } from './breadcrumb/breadcrumb.component';
import { BreadcrumbsComponent } from './breadcrumbs/breadcrumbs.component';
import { ButtonComponent } from './buttons/button/button.component';
import { CardHeaderComponent } from './card-header/card-header.component';
import { CardComponent } from './card/card.component';
import { CheckboxComponent } from './checkbox/checkbox.component';
import { ChipComponent } from './chip/chip.component';
import { CollectionExtensionButtonComponent } from './collection-extension-button/collection-extension-button.component';
import { ConfirmationDialogComponent } from './confirmation-dialog/confirmation-dialog.component';
import { ContentSpaceBetweenComponent } from './content-space-between/content-space-between.component';
import { ContentWithTooltipComponent } from './content-with-tooltip/content-with-tooltip.component';
import { ContentBoxComponent } from './contentbox/contentbox.component';
import { DatePickerComponent } from './datepicker/datepicker.component';
import { DetailsPageLinkComponent } from './details-page-link/details-page-link.component';
import { DialogActionsComponent } from './dialog-actions/dialog-actions.component';
import { DialogComponent } from './dialog/dialog.component';
import { DividerComponent } from './divider/divider.component';
import { ConnectedDropdownComponent } from './dropdowns/connected-dropdown/connected-dropdown.component';
import { DropdownComponent } from './dropdowns/dropdown/dropdown.component';
import { TreeNodeDropdownComponent } from './dropdowns/tree-node-dropdown/tree-node-dropdown.component';
import { EmptyStateComponent } from './empty-states/empty-state.component';
import { ExternalPageLinkComponent } from './external-page-link/external-page-link.component';
import { ExternalReferenceComponent } from './external-reference/external-reference.component';
import { GridPaginatorIntl } from './grid/grid-paginator/grid-paginator-intl';
import { GridPaginatorComponent } from './grid/grid-paginator/grid-paginator.component';
import { GridComponent } from './grid/grid.component';
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
import { RoleTableCreateDialogComponent } from './role-table/role-table.create-dialog/role-table.create-dialog.component';
import { SegmentComponent } from './segment/segment.component';
import { SelectKleDialogComponent } from './select-kle-dialog/select-kle-dialog.component';
import { SelectedOptionTypeTextComponent } from './selected-option-type-text/selected-option-type-text.component';
import { SpacerComponent } from './spacer/spacer.component';
import { StatusChipComponent } from './status-chip/status-chip.component';
import { TextAreaComponent } from './textarea/textarea.component';
import { TextBoxInfoComponent } from './textbox-info/textbox-info.component';
import { TextBoxComponent } from './textbox/textbox.component';
import { TooltipComponent } from './tooltip/tooltip.component';
import { EntityTreeComponent } from './tree/entity-tree.component';
import { YesNoStatusComponent } from './yes-no-status/yes-no-status.component';

import { Overlay, RepositionScrollStrategy } from '@angular/cdk/overlay';
import { OnInvalidErrorStateMatcher } from '../helpers/on-invalid-error-state-matcher';
import { IconButtonComponent } from './buttons/icon-button/icon-button.component';
import { CreateExternalReferenceDialogComponent } from './external-references-management/create-external-reference-dialog/create-external-reference-dialog.component';
import { EditExternalReferenceDialogComponent } from './external-references-management/edit-external-reference-dialog/edit-external-reference-dialog.component';
import { ExternalReferenceDialogComponent } from './external-references-management/external-reference-dialog/external-reference-dialog.component';
import { ExternalReferencesManagementComponent } from './external-references-management/external-references-management.component';
import { StandardVerticalContentGridComponent } from './standard-vertical-content-grid/standard-vertical-content-grid.component';

export function scrollFactory(overlay: Overlay): () => RepositionScrollStrategy {
  return () => overlay.scrollStrategies.reposition();
}

@NgModule({
  declarations: [
    ButtonComponent,
    GridComponent,
    GridPaginatorComponent,
    LoadingComponent,
    NotificationComponent,
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
    NotificationsComponent,
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
    { provide: MatPaginatorIntl, useClass: GridPaginatorIntl },
  ],
})
export class ComponentsModule {}
