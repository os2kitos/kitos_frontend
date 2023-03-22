import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { DialogRef } from '@progress/kendo-angular-dialog';
import { find, switchMap } from 'rxjs';
import { APIOrganizationUnitResponseDTO } from 'src/app/api/v2';
import { BaseComponent } from 'src/app/shared/base/base.component';
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

  constructor(
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

    const doesContain = this.usingUnitsComponentStore.usedByUnits$.pipe(
      switchMap((units) => units),
      find((x) => x.uuid === selectedUnit?.uuid)
    );

    //this.usingUnitsComponentStore.getUsageUsingUnitsState();
    this.usingUnitsComponentStore.addUsedByUnit(selectedUnit);
    this.dialog.close();
  }

  onCancel() {
    this.dialog.close();
  }
}
