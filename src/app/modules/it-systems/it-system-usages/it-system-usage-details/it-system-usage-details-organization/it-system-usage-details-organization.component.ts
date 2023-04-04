import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Store } from '@ngrx/store';
import { DialogCloseResult, DialogService } from '@progress/kendo-angular-dialog';
import { combineLatestWith, filter } from 'rxjs';
import { APIIdentityNamePairResponseDTO } from 'src/app/api/v2';
import { BaseComponent } from 'src/app/shared/base/base.component';
import { ConfirmationDialogComponent } from 'src/app/shared/components/confirmation-dialog/confirmation-dialog.component';
import { filterNullish } from 'src/app/shared/pipes/filter-nullish';
import { invertBooleanValue } from 'src/app/shared/pipes/invert-boolean-value';
import { matchEmptyArray } from 'src/app/shared/pipes/match-empty-array';
import { NotificationService } from 'src/app/shared/services/notification.service';
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
  public hasModifyPermission = true;

  public readonly responsibleUnitForm = new FormGroup({
    responsibleUnit: new FormControl<APIIdentityNamePairResponseDTO | undefined>(undefined),
  });

  constructor(
    private readonly store: Store,
    private readonly dialogService: DialogService,
    private readonly notificationService: NotificationService
  ) {
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
      this.store
        .select(selectITSystemUsageHasModifyPermission)
        .pipe(filter((hasModifyPermission) => hasModifyPermission === false))
        .subscribe(() => {
          this.hasModifyPermission = false;
          this.responsibleUnitForm.disable();
        })
    );
  }

  public onAddNew() {
    this.dialogService.open({ content: UsageOrganizationCreateDialogComponent });
  }

  public patchResponsibleUnit(uuid?: string) {
    if (this.responsibleUnitForm.valid) {
      this.store.dispatch(
        ITSystemUsageActions.patchItSystemUsage({
          organizationUsage: {
            responsibleOrganizationUnitUuid: uuid,
          },
        })
      );
    } else {
      this.notificationService.showError($localize`Valg af ansvarlig organisationsenhed er ugyldig`);
    }
  }

  public deleteUsedByUnit(unit: APIIdentityNamePairResponseDTO) {
    const dialogRef = this.dialogService.open({ content: ConfirmationDialogComponent });
    const confirmationDialog = dialogRef.content.instance as ConfirmationDialogComponent;
    confirmationDialog.bodyText = $localize`Er du sikker på at du vil slette` + ` ${unit.name}?`;

    dialogRef.result.subscribe((result) => {
      if (!(result instanceof DialogCloseResult)) {
        this.store.dispatch(ITSystemUsageActions.removeItSystemUsageUsingUnit(unit.uuid));
      }
    });
  }
}
