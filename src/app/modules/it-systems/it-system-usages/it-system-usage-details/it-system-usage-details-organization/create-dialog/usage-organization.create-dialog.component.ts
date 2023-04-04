import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { DialogRef } from '@progress/kendo-angular-dialog';
import { first, map } from 'rxjs';
import { BaseComponent } from 'src/app/shared/base/base.component';
import { TreeNodeModel } from 'src/app/shared/models/tree-node.model';
import { filterNullish } from 'src/app/shared/pipes/filter-nullish';
import { ITSystemUsageActions } from 'src/app/store/it-system-usage/actions';
import { selectItSystemUsageUsingOrganizationUnits } from 'src/app/store/it-system-usage/selectors';

@Component({
  selector: 'app-usage-organization.create-dialog',
  templateUrl: './usage-organization.create-dialog.component.html',
  styleUrls: ['./usage-organization.create-dialog.component.scss'],
})
export class UsageOrganizationCreateDialogComponent extends BaseComponent implements OnInit {
  public readonly usingUnitForm = new FormGroup({
    unit: new FormControl<TreeNodeModel | undefined>({ value: undefined, disabled: false }),
  });

  public readonly usedUnitUuids$ = this.store.select(selectItSystemUsageUsingOrganizationUnits).pipe(
    filterNullish(),
    map((units) => {
      return units.map((x) => x.uuid);
    })
  );

  constructor(private readonly store: Store, private readonly dialog: DialogRef) {
    super();
  }

  ngOnInit(): void {
    //add null validation
    this.usingUnitForm.controls.unit.validator = Validators.required;
  }

  onSave() {
    if (!this.usingUnitForm.valid) return;

    this.usedUnitUuids$.pipe(first()).subscribe((unitUuids) => {
      const selectedUnit = this.usingUnitForm.get('unit')?.value;
      if (!selectedUnit) return;

      const uuids = unitUuids.map((uuid) => uuid);

      uuids.push(selectedUnit.id);

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
}
