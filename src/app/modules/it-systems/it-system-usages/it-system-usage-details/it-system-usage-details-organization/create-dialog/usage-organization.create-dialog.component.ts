import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Store } from '@ngrx/store';
import { DialogRef } from '@progress/kendo-angular-dialog';
import { APIOrganizationUnitResponseDTO } from 'src/app/api/v2';
import { BaseComponent } from 'src/app/shared/base/base.component';
import { filterNullish } from 'src/app/shared/pipes/filter-nullish';
import { selectItSystemUsageUuid } from 'src/app/store/it-system-usage/selectors';
import { ItSystemUsageDetailsOrganizationComponentStore } from '../it-system-usage-details-organization.component-store';

@Component({
  selector: 'app-it-system-usage-details-organization.create-dialog',
  templateUrl: './it-system-usage-details-organization.create-dialog.component.html',
  styleUrls: ['./it-system-usage-details-organization.create-dialog.component.scss'],
  providers: [ItSystemUsageDetailsOrganizationComponentStore],
})
export class ItSystemUsageDetailsOrganizationCreateDialogComponent extends BaseComponent implements OnInit {
  public readonly usingUnitForm = new FormGroup({
    unit: new FormControl<APIOrganizationUnitResponseDTO | undefined>({ value: undefined, disabled: false }),
  });

  public readonly organizationUnits$ = this.usingUnitsComponentStore.organizationUnits$;

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
    if (!this.usingUnitForm.valid) return;

    this.subscriptions.add(
      this.store
        .select(selectItSystemUsageUuid)
        .pipe(filterNullish())
        .subscribe((usageUuid) => this.usingUnitsComponentStore.updateUsageUsingUnitsState(usageUuid))
    );
    this.dialog.close();
  }

  onCancel() {
    this.dialog.close();
  }
}
