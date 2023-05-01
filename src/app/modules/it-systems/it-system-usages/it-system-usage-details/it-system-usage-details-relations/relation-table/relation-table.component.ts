import { Component, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { APIIdentityNamePairResponseDTO } from 'src/app/api/v2';
import { BaseComponent } from 'src/app/shared/base/base.component';
import { ConfirmationDialogComponent } from 'src/app/shared/components/confirmation-dialog/confirmation-dialog.component';
import { ITSystemUsageActions } from 'src/app/store/it-system-usage/actions';
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

  constructor(private readonly dialog: MatDialog, private readonly store: Store) {
    super();
  }

  public onEdit(relation: SystemRelationModel) {
    const dialogRef = this.dialog.open(ModifyRelationDialogComponent);
    const modifyDialog = dialogRef.componentInstance as ModifyRelationDialogComponent;
    modifyDialog.relationModel = relation;
  }

  public onRemove(relation: SystemRelationModel) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent);
    const confirmationDialog = dialogRef.componentInstance as ConfirmationDialogComponent;
    confirmationDialog.bodyText = $localize`Er du sikker på at du vil fjerne denne relation`;
    confirmationDialog.confirmColor = 'warn';

    this.subscriptions.add(
      dialogRef.afterClosed().subscribe((result) => {
        if (result === true) {
          this.store.dispatch(ITSystemUsageActions.removeItSystemUsageRelation(relation.uuid));
        }
      })
    );
  }
}
