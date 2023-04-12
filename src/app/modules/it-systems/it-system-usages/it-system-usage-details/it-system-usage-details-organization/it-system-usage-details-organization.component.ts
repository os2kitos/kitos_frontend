import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { combineLatestWith, filter, first } from 'rxjs';
import { APIIdentityNamePairResponseDTO } from 'src/app/api/v2';
import { BaseComponent } from 'src/app/shared/base/base.component';
import { ConfirmationDialogComponent } from 'src/app/shared/components/confirmation-dialog/confirmation-dialog.component';
import { filterNullish } from 'src/app/shared/pipes/filter-nullish';
import { invertBooleanValue } from 'src/app/shared/pipes/invert-boolean-value';
import { matchEmptyArray } from 'src/app/shared/pipes/match-empty-array';
import { ITSystemUsageActions } from 'src/app/store/it-system-usage/actions';
import {
  selectITSystemUsageHasModifyPermission,
  selectItSystemUsageResponsibleUnit,
  selectItSystemUsageUsingOrganizationUnits,
} from 'src/app/store/it-system-usage/selectors';
import { UsageOrganizationCreateDialogComponent } from './create-dialog/usage-organization.create-dialog.component';

@Component({
  selector: 'app-it-system-usage-details-organization',
  templateUrl: './it-system-usage-details-organization.component.html',
  styleUrls: ['./it-system-usage-details-organization.component.scss'],
})
export class ItSystemUsageDetailsOrganizationComponent extends BaseComponent implements OnInit {
  public readonly responsibleUnit$ = this.store.select(selectItSystemUsageResponsibleUnit);
  public readonly usedByUnits$ = this.store.select(selectItSystemUsageUsingOrganizationUnits).pipe(filterNullish());
  public readonly anyUsedByUnits$ = this.usedByUnits$.pipe(matchEmptyArray(), invertBooleanValue());
  public hasModifyPermission$ = this.store.select(selectITSystemUsageHasModifyPermission);

  public readonly responsibleUnitForm = new FormGroup({
    responsibleUnit: new FormControl<APIIdentityNamePairResponseDTO | undefined>(undefined),
  });

  constructor(private readonly store: Store, private readonly dialog: MatDialog) {
    super();
  }

  public ngOnInit(): void {
    this.subscriptions.add(
      this.responsibleUnit$.pipe(combineLatestWith(this.usedByUnits$)).subscribe(([responsibleUnit, usedByUnits]) =>
        this.responsibleUnitForm.patchValue({
          responsibleUnit: usedByUnits.filter((unit) => unit.uuid === responsibleUnit?.uuid).pop(),
        })
      )
    );

    // Disable forms if user does not have rights to modify
    this.subscriptions.add(
      this.hasModifyPermission$.pipe(filter((hasModifyPermission) => hasModifyPermission === false)).subscribe(() => {
        this.responsibleUnitForm.disable();
      })
    );
  }

  public onAddNew() {
    this.dialog.open(UsageOrganizationCreateDialogComponent);
  }

  public patchResponsibleUnit(uuid?: string) {
    this.store.dispatch(
      ITSystemUsageActions.patchItSystemUsage({
        organizationUsage: {
          responsibleOrganizationUnitUuid: uuid,
        },
      })
    );
  }

  public deleteUsedByUnit(unit: APIIdentityNamePairResponseDTO) {
    this.responsibleUnit$.pipe(first()).subscribe((responsibleUnit) => {
      const dialogRef = this.dialog.open(ConfirmationDialogComponent);
      const confirmationDialog = dialogRef.componentInstance as ConfirmationDialogComponent;
      if (responsibleUnit?.uuid === unit.uuid) {
        confirmationDialog.bodyText =
          $localize`Are you sure you want to delete the responsible unit` + ` ${unit.name}?`;
      } else {
        confirmationDialog.bodyText = $localize`Er du sikker på at du vil slette ${unit.name}?`;
      }
      confirmationDialog.confirmationType = 'Custom';
      confirmationDialog.customDeclineText = 'Annuler';
      confirmationDialog.customConfirmText = 'Slet';

      dialogRef.afterClosed().subscribe((result) => {
        if (result === true) {
          this.store.dispatch(ITSystemUsageActions.removeItSystemUsageUsingUnit(unit.uuid));
        }
      });
    });
  }
}
