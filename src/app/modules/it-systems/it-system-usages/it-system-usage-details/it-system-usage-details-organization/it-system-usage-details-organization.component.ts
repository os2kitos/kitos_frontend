import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { DialogService } from '@progress/kendo-angular-dialog';
import { APIIdentityNamePairResponseDTO } from 'src/app/api/v2';
import { BaseComponent } from 'src/app/shared/base/base.component';
import { filterNullish } from 'src/app/shared/pipes/filter-nullish';
import { invertBooleanValue } from 'src/app/shared/pipes/invert-boolean-value';
import { matchEmptyArray } from 'src/app/shared/pipes/match-empty-array';
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
export class ItSystemUsageDetailsOrganizationComponent extends BaseComponent {
  public readonly responsibleUnit$ = this.store.select(selectItSystemUsageResponsibleUnit).pipe(filterNullish());
  public readonly usedByUnits$ = this.store.select(selectItSystemUsageUsingOrganizationUnits).pipe(filterNullish());
  public readonly anyUsedByUnits$ = this.usedByUnits$.pipe(matchEmptyArray(), invertBooleanValue());

  constructor(private store: Store, private dialogService: DialogService) {
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
