import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Store } from '@ngrx/store';
import { DialogService } from '@progress/kendo-angular-dialog';
import { combineLatestWith } from 'rxjs';
import { APIIdentityNamePairResponseDTO } from 'src/app/api/v2';
import { BaseComponent } from 'src/app/shared/base/base.component';
import { ConfirmationDialogComponent } from 'src/app/shared/components/confirmation-dialog/confirmation-dialog.component';
import { filterNullish } from 'src/app/shared/pipes/filter-nullish';
import { invertBooleanValue } from 'src/app/shared/pipes/invert-boolean-value';
import { matchEmptyArray } from 'src/app/shared/pipes/match-empty-array';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { ITSystemUsageActions } from 'src/app/store/it-system-usage/actions';
import {
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

  public deleteUsedByUnit(uuid: string) {
    const dialogRef = this.dialogService.open({ content: ConfirmationDialogComponent });
    dialogRef.result.subscribe((result) => {
      if (result === true) {
        this.store.dispatch(ITSystemUsageActions.removeItSystemUsageUsingUnit(uuid));
      }
    });
    //TODO: Should confirm delete?
  }
}
