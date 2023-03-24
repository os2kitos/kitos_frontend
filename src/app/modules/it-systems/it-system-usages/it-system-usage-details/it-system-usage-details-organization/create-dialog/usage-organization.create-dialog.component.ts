import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidationErrors, ValidatorFn } from '@angular/forms';
import { Store } from '@ngrx/store';
import { DialogRef } from '@progress/kendo-angular-dialog';
import { first } from 'rxjs';
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

  private usedByUnitsWithUuids: string[] = [];

  constructor(
    private store: Store,
    private usingUnitsComponentStore: ItSystemUsageDetailsOrganizationComponentStore,
    private dialog: DialogRef
  ) {
    super();
  }

  ngOnInit(): void {
    this.usingUnitsComponentStore.getOrganizationUnits();
    this.usedUnits$.pipe(first()).subscribe((units) => {
      this.usedByUnitsWithUuids = units.map((usingUnit) => usingUnit.uuid);
    });

    this.usingUnitForm.controls.unit.validator = this.uuidAlreadySelectedValidator(this.usedByUnitsWithUuids);
  }

  onSave() {
    if (!this.usingUnitForm.valid) return;

    var selectedUnit = this.usingUnitForm.get('unit')?.value;
    if (!selectedUnit) return;

    var usedByUnitsUuids = this.usedByUnitsWithUuids;
    if (usedByUnitsUuids.find((x) => x === selectedUnit?.uuid)) {
      return;
    }

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

  uuidAlreadySelectedValidator(uuids: string[]): ValidatorFn {
    return (endControl: AbstractControl): ValidationErrors | null => {
      const selectedUnit: APIOrganizationUnitResponseDTO = endControl.value;
      if (!selectedUnit) {
        return null;
      }
      if (uuids.find((x) => x === selectedUnit.uuid)) {
        return { alreadyContains: true };
      }
      return null;
    };
  }
}
