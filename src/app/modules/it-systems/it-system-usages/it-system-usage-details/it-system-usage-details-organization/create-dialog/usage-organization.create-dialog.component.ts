import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Store } from '@ngrx/store';
import { DialogRef } from '@progress/kendo-angular-dialog';
import { map } from 'rxjs';
import { APIOrganizationUnitResponseDTO } from 'src/app/api/v2';
import { BaseComponent } from 'src/app/shared/base/base.component';
import { filterNullish } from 'src/app/shared/pipes/filter-nullish';
import { ITSystemUsageActions } from 'src/app/store/it-system-usage/actions';
import { selectItSystemUsageUsingOrganizationUnits } from 'src/app/store/it-system-usage/selectors';
import { ItSystemUsageDetailsOrganizationComponentStore } from '../it-system-usage-details-organization.component-store';

@Component({
  selector: 'app-usage-organization.create-dialog',
  templateUrl: './usage-organization.create-dialog.component.html',
  styleUrls: ['./usage-organization.create-dialog.component.scss'],
  providers: [ItSystemUsageDetailsOrganizationComponentStore],
})
export class UsageOrganizationCreateDialogComponent extends BaseComponent implements OnInit {
  public readonly usingUnitForm = new FormGroup({
    unit: new FormControl<APIOrganizationUnitResponseDTO | undefined>({ value: undefined, disabled: false }),
  });

  public readonly organizationUnits$ = this.usingUnitsComponentStore.organizationUnits$;
  public readonly usedUnits$ = this.store.select(selectItSystemUsageUsingOrganizationUnits).pipe(filterNullish());

  constructor(
    private store: Store,
    private usingUnitsComponentStore: ItSystemUsageDetailsOrganizationComponentStore,
    private dialog: DialogRef
  ) {
    super();
  }

  ngOnInit(): void {
    this.usingUnitsComponentStore.getOrganizationUnits();
  }

  onSave() {
    var selectedUnit = this.usingUnitForm.get('unit')?.value;
    if (!selectedUnit) return;

    var usedByUnitsUuids = [] as string[];
    this.usedUnits$.forEach((units) => {
      usedByUnitsUuids = units.map((usingUnit) => usingUnit.uuid);
    });

    this.usedUnits$.pipe(
      map((units) => {
        console.log("It's here: " + units);
      })
    );

    if (usedByUnitsUuids.filter((x) => x === selectedUnit?.uuid).length > 0) return;

    usedByUnitsUuids.push(selectedUnit.uuid);

    this.store.dispatch(
      ITSystemUsageActions.patchItSystemUsage({
        organizationUsage: {
          usingOrganizationUnitUuids: usedByUnitsUuids,
        },
      })
    );

    this.dialog.close();
  }

  onCancel() {
    this.dialog.close();
  }
}
