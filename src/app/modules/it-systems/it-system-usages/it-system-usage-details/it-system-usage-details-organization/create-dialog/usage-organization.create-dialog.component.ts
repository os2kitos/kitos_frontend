import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidationErrors, ValidatorFn } from '@angular/forms';
import { Store } from '@ngrx/store';
import { DialogRef } from '@progress/kendo-angular-dialog';
import { first, map, Observable } from 'rxjs';
import { APIOrganizationUnitResponseDTO } from 'src/app/api/v2';
import { BaseComponent } from 'src/app/shared/base/base.component';
import { filterNullish } from 'src/app/shared/pipes/filter-nullish';
import { ITSystemUsageActions } from 'src/app/store/it-system-usage/actions';
import { selectItSystemUsageUsingOrganizationUnits } from 'src/app/store/it-system-usage/selectors';
import { OrganizationUnitActions } from 'src/app/store/organization-unit/actions';
import { selectOrganizationUnits } from 'src/app/store/organization-unit/selectors';
import { selectOrganizationUuid } from 'src/app/store/user-store/selectors';

@Component({
  selector: 'app-usage-organization.create-dialog',
  templateUrl: './usage-organization.create-dialog.component.html',
  styleUrls: ['./usage-organization.create-dialog.component.scss'],
})
export class UsageOrganizationCreateDialogComponent extends BaseComponent implements OnInit {
  public readonly usingUnitForm = new FormGroup({
    unit: new FormControl<APIOrganizationUnitResponseDTO | undefined>({ value: undefined, disabled: false }),
  });

  public readonly usedUnits$ = this.store.select(selectItSystemUsageUsingOrganizationUnits).pipe(filterNullish());
  public readonly organizationUnits$ = this.store.select(selectOrganizationUnits).pipe(filterNullish());

  constructor(private readonly store: Store, private readonly dialog: DialogRef) {
    super();
  }

  ngOnInit(): void {
    //Get organization units
    this.subscriptions.add(
      this.store
        .select(selectOrganizationUuid)
        .pipe(filterNullish())
        .subscribe((organizationUuid) =>
          this.store.dispatch(OrganizationUnitActions.getOrganizationUnits(organizationUuid))
        )
    );

    //add unit validation
    this.usingUnitForm.controls.unit.validator = this.uuidAlreadySelectedValidator(
      this.usedUnits$.pipe(map((units) => units.map((unit) => unit.uuid)))
    );
  }

  onSave() {
    if (!this.usingUnitForm.valid) return;

    this.usedUnits$.pipe(first()).subscribe((units) => {
      var selectedUnit = this.usingUnitForm.get('unit')?.value;
      if (!selectedUnit) return;

      var uuids = units.map((unit) => unit.uuid);

      uuids.push(selectedUnit.uuid);

      this.store.dispatch(
        ITSystemUsageActions.patchItSystemUsage({
          organizationUsage: {
            usingOrganizationUnitUuids: uuids,
          },
        })
      );
    });

    this.dialog.close();
  }

  onCancel() {
    this.dialog.close();
  }

  private uuidAlreadySelectedValidator(uuids$: Observable<string[]>): ValidatorFn {
    return (endControl: AbstractControl): ValidationErrors | null => {
      const selectedUnit: APIOrganizationUnitResponseDTO = endControl.value;
      if (!selectedUnit) {
        return { empty: true };
      }
      var result: ValidationErrors | null = null;
      uuids$.pipe(first()).subscribe((uuids) => {
        if (uuids.find((x) => x === selectedUnit.uuid)) {
          result = { alreadyContains: true };
        }
      });
      return result;
    };
  }
}
