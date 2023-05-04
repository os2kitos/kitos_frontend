import { Component, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { first } from 'rxjs';
import { APIIdentityNamePairResponseDTO } from 'src/app/api/v2';
import { BaseComponent } from 'src/app/shared/base/base.component';
import { ConfirmationDialogComponent } from 'src/app/shared/components/confirmation-dialog/confirmation-dialog.component';
import { filterNullish } from 'src/app/shared/pipes/filter-nullish';
import { ITSystemUsageActions } from 'src/app/store/it-system-usage/actions';
import { selectRegularOptionTypesDictionary } from 'src/app/store/regular-option-type-store/selectors';
import { ModifyRelationDialogComponent } from '../modify-relation-dialog/modify-relation-dialog.component';

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
  selector: 'app-relation-table[relations][isLoading][emptyText]',
  templateUrl: './relation-table.component.html',
  styleUrls: ['./relation-table.component.scss'],
})
export class RelationTableComponent extends BaseComponent {
  @Input() public relations!: Array<SystemRelationModel>;
  @Input() public isLoading!: boolean;
  @Input() public isOutgoing = false;
  @Input() public emptyText!: string;
  @Input() public hasModifyPermissions = false;

  public readonly availableReferenceFrequencyTypes$ = this.store
    .select(selectRegularOptionTypesDictionary('it-system_usage-relation-frequency-type'))
    .pipe(filterNullish());

  constructor(private readonly store: Store, private readonly dialog: MatDialog) {
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
