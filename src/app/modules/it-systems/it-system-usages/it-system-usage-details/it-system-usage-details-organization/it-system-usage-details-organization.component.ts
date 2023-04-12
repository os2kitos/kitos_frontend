import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Store } from '@ngrx/store';
import { DialogCloseResult, DialogService } from '@progress/kendo-angular-dialog';
import { sortBy, toLower } from 'lodash';
import { combineLatestWith, filter, first, map } from 'rxjs';
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
  public readonly usedByUnits$ = this.store.select(selectItSystemUsageUsingOrganizationUnits).pipe(
    filterNullish(),
    //LocaleCompare
    map((units) => sortBy(units, (x) => toLower(x.name)))
  );
  public readonly anyUsedByUnits$ = this.usedByUnits$.pipe(matchEmptyArray(), invertBooleanValue());
  public hasModifyPermission$ = this.store.select(selectITSystemUsageHasModifyPermission);

  public readonly responsibleUnitForm = new FormGroup({
    responsibleUnit: new FormControl<APIIdentityNamePairResponseDTO | undefined>(undefined),
  });

  constructor(private readonly store: Store, private readonly dialogService: DialogService) {
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
    this.dialogService.open({ content: UsageOrganizationCreateDialogComponent });
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
      const dialogRef = this.dialogService.open({ content: ConfirmationDialogComponent });
      const confirmationDialog = dialogRef.content.instance as ConfirmationDialogComponent;
      if (responsibleUnit?.uuid === unit.uuid) {
        confirmationDialog.bodyText =
          $localize`Are you sure you want to delete the responsible unit` + ` ${unit.name}?`;
      } else {
        confirmationDialog.bodyText = $localize`Er du sikker på at du vil slette ${unit.name}?`;
      }
      confirmationDialog.confirmationType = 'Custom';
      confirmationDialog.customDeclineText = 'Annuler';
      confirmationDialog.customConfirmText = 'Slet';

      dialogRef.result.subscribe((result) => {
        if (!(result instanceof DialogCloseResult)) {
          this.store.dispatch(ITSystemUsageActions.removeItSystemUsageUsingUnit(unit.uuid));
        }
      });
    });
  }
}
