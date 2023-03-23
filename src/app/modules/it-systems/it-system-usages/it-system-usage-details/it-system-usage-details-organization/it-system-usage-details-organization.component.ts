import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { DialogService } from '@progress/kendo-angular-dialog';
import { APIIdentityNamePairResponseDTO } from 'src/app/api/v2';
import { BaseComponent } from 'src/app/shared/base/base.component';
import { invertBooleanValue } from 'src/app/shared/pipes/invert-boolean-value';
import { matchEmptyArray } from 'src/app/shared/pipes/match-empty-array';
import { UsageOrganizationCreateDialogComponent } from './create-dialog/usage-organization.create-dialog.component';
import { ItSystemUsageDetailsOrganizationComponentStore } from './it-system-usage-details-organization.component-store';

@Component({
  selector: 'app-it-system-usage-details-organization',
  templateUrl: './it-system-usage-details-organization.component.html',
  styleUrls: ['./it-system-usage-details-organization.component.scss'],
  providers: [ItSystemUsageDetailsOrganizationComponentStore],
})
export class ItSystemUsageDetailsOrganizationComponent extends BaseComponent {
  public readonly responsibleUnit$ = this.usageOrganizationStore.responsibleUnit$;
  public readonly usedByUnits$ = this.usageOrganizationStore.usedByUnits$;
  public readonly anyUsedByUnits$ = this.usedByUnits$.pipe(matchEmptyArray(), invertBooleanValue());

  constructor(
    private store: Store,
    private usageOrganizationStore: ItSystemUsageDetailsOrganizationComponentStore,
    private dialogService: DialogService
  ) {
    super();
  }

  onResponsibleUnitSelected(selectedUnit: APIIdentityNamePairResponseDTO | null | undefined) {
    if (selectedUnit) {
      console.log(selectedUnit.name);
      console.log(selectedUnit.uuid);
    }
  }

  onAddNew() {
    this.dialogService.open({ content: UsageOrganizationCreateDialogComponent });
  }
}
