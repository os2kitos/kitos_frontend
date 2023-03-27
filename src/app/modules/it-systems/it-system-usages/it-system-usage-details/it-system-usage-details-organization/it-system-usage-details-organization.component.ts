import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Store } from '@ngrx/store';
import { DialogService } from '@progress/kendo-angular-dialog';
import { combineLatestWith, first } from 'rxjs';
import { APIIdentityNamePairResponseDTO } from 'src/app/api/v2';
import { BaseComponent } from 'src/app/shared/base/base.component';
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
import { ItSystemUsageDetailsOrganizationComponentStore } from './it-system-usage-details-organization.component-store';

@Component({
  selector: 'app-it-system-usage-details-organization',
  templateUrl: './it-system-usage-details-organization.component.html',
  styleUrls: ['./it-system-usage-details-organization.component.scss'],
  providers: [ItSystemUsageDetailsOrganizationComponentStore],
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
    //TODO: Should confirm delete?
    this.responsibleUnit$.pipe(first()).subscribe((responsibleUnit) => {
      if (responsibleUnit?.uuid === uuid) {
        this.notificationService.showError(
          'Selected unit is set as responsible, change the responsible unit, and try again'
        );
        return;
      }

      this.usedByUnits$.pipe(first()).subscribe((units) => {
        var unitUuids = units.filter((x) => x.uuid !== uuid).map((x) => x.uuid);
        this.store.dispatch(
          ITSystemUsageActions.patchItSystemUsage({
            organizationUsage: {
              usingOrganizationUnitUuids: unitUuids,
            },
          })
        );
      });
    });
  }
}
