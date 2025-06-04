import { Component, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { first } from 'rxjs';
import { APIIdentityNamePairResponseDTO } from 'src/app/api/v2';
import { BaseComponent } from 'src/app/shared/base/base.component';
import { ConfirmationDialogComponent } from 'src/app/shared/components/dialogs/confirmation-dialog/confirmation-dialog.component';
import { filterNullish } from 'src/app/shared/pipes/filter-nullish';
import { ITSystemUsageActions } from 'src/app/store/it-system-usage/actions';
import { selectRegularOptionTypesDictionary } from 'src/app/store/regular-option-type-store/selectors';
import { ModifyRelationDialogComponent } from '../modify-relation-dialog/modify-relation-dialog.component';
import { StandardVerticalContentGridComponent } from '../../../../../../shared/components/standard-vertical-content-grid/standard-vertical-content-grid.component';
import { NgIf, NgFor, AsyncPipe } from '@angular/common';
import { NativeTableComponent } from '../../../../../../shared/components/native-table/native-table.component';
import { DetailsPageLinkComponent } from '../../../../../../shared/components/details-page-link/details-page-link.component';
import { ParagraphComponent } from '../../../../../../shared/components/paragraph/paragraph.component';
import { ExternalPageLinkComponent } from '../../../../../../shared/components/external-page-link/external-page-link.component';
import { ContentSpaceBetweenComponent } from '../../../../../../shared/components/content-space-between/content-space-between.component';
import { SelectedOptionTypeTextComponent } from '../../../../../../shared/components/selected-option-type-text/selected-option-type-text.component';
import { TableRowActionsComponent } from '../../../../../../shared/components/table-row-actions/table-row-actions.component';
import { IconButtonComponent } from '../../../../../../shared/components/buttons/icon-button/icon-button.component';
import { PencilIconComponent } from '../../../../../../shared/components/icons/pencil-icon.compnent';
import { TrashcanIconComponent } from '../../../../../../shared/components/icons/trashcan-icon.component';
import { EmptyStateComponent } from '../../../../../../shared/components/empty-states/empty-state.component';

export interface SystemRelationModel {
  uuid: string;
  systemUsage: APIIdentityNamePairResponseDTO;
  relationInterface?: APIIdentityNamePairResponseDTO;
  associatedContract?: APIIdentityNamePairResponseDTO;
  relationFrequency?: APIIdentityNamePairResponseDTO;
  description?: string;
  urlReference?: string;
}

@Component({
  selector: 'app-relation-table[relations][emptyText]',
  templateUrl: './relation-table.component.html',
  styleUrls: ['./relation-table.component.scss'],
  imports: [
    StandardVerticalContentGridComponent,
    NgIf,
    NativeTableComponent,
    NgFor,
    DetailsPageLinkComponent,
    ParagraphComponent,
    ExternalPageLinkComponent,
    ContentSpaceBetweenComponent,
    SelectedOptionTypeTextComponent,
    TableRowActionsComponent,
    IconButtonComponent,
    PencilIconComponent,
    TrashcanIconComponent,
    EmptyStateComponent,
    AsyncPipe,
  ],
})
export class RelationTableComponent extends BaseComponent {
  @Input() public relations!: Array<SystemRelationModel>;
  @Input() public isOutgoing = false;
  @Input() public emptyText!: string;
  @Input() public hasModifyPermissions = false;

  public readonly availableReferenceFrequencyTypes$ = this.store
    .select(selectRegularOptionTypesDictionary('it-system_usage-relation-frequency-type'))
    .pipe(filterNullish());

  constructor(
    private readonly store: Store,
    private readonly dialog: MatDialog,
  ) {
    super();
  }

  public onEdit(relation: SystemRelationModel) {
    const modifyDialogRef = this.dialog.open(ModifyRelationDialogComponent);
    const modifyDialogInstance = modifyDialogRef.componentInstance as ModifyRelationDialogComponent;
    modifyDialogInstance.relationModel = relation;
  }

  public onRemove(relation: SystemRelationModel) {
    const confirmationDialogRef = this.dialog.open(ConfirmationDialogComponent);
    const confirmationDialogInstance = confirmationDialogRef.componentInstance as ConfirmationDialogComponent;
    confirmationDialogInstance.bodyText = $localize`Er du sikker på at du vil fjerne denne relation`;
    confirmationDialogInstance.confirmColor = 'warn';

    confirmationDialogRef
      .afterClosed()
      .pipe(first())
      .subscribe((result) => {
        if (result === true) {
          this.store.dispatch(ITSystemUsageActions.removeItSystemUsageRelation(relation.uuid));
        }
      });
  }
}
