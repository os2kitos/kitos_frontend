import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { BehaviorSubject, map } from 'rxjs';
import { APIStsOrganizationOrgUnitDTO } from 'src/app/api/v2';
import { ItSystemHierarchyTableComponentStore } from 'src/app/modules/it-systems/shared/it-system-hierarchy-table/it-system-hierarchy-table.component-store';
import { BaseComponent } from 'src/app/shared/base/base.component';
import { mapFkOrgSnapshotUnits } from 'src/app/shared/helpers/hierarchy.helpers';
import { EntityTreeNode } from 'src/app/shared/models/structure/entity-tree-node.model';
import { filterNullish } from 'src/app/shared/pipes/filter-nullish';
import { FkOrgActions } from 'src/app/store/local-admin/fk-org/actions';
import {
  selectHasSnapshotFailed,
  selectIsSynchronizationDialogLoading,
  selectSnapshot,
} from 'src/app/store/local-admin/fk-org/selectors';

@Component({
  selector: 'app-fk-org-write-dialog',
  templateUrl: './fk-org-write-dialog.component.html',
  styleUrl: './fk-org-write-dialog.component.scss',
  providers: [ItSystemHierarchyTableComponentStore],
})
export class FkOrgWriteDialogComponent extends BaseComponent implements OnInit {
  @Input() isEdit: boolean = false;

  public readonly snapshot$ = this.store.select(selectSnapshot).pipe(filterNullish());
  public readonly snapshotTree$ = this.snapshot$.pipe(map((snapshot) => mapFkOrgSnapshotUnits([snapshot])));
  public readonly isLoading$ = this.store.select(selectIsSynchronizationDialogLoading);
  public readonly hasFailed$ = this.store.select(selectHasSnapshotFailed);

  public readonly fkOrgFormGroup = new FormGroup({
    levels: new FormControl<number | undefined>(undefined),
    subscribeToUpdates: new FormControl<boolean>(false),
  });

  public readonly levelsSubject$ = new BehaviorSubject<number | undefined>(undefined);
  public readonly levelsText$ = this.levelsSubject$.pipe(
    map((level) => {
      if (level === undefined)
        return $localize`Alle niveauer i organisationen synkroniseres fra FK Organisation. Angiv antal niveauer for at begrænse hierarkiet.`;

      return $localize`KITOS synkroniserer ${level} niveauer fra organisationshierarkiet i FK Organisation. Slet indtastningen for at synkronisere det fulde organisationshierarki.`;
    })
  );

  constructor(
    private readonly store: Store,
    private readonly actions$: Actions,
    private readonly dialog: MatDialogRef<FkOrgWriteDialogComponent>
  ) {
    super();
  }

  public title = '';
  ngOnInit(): void {
    this.store.dispatch(FkOrgActions.getSnapshot());

    this.title = this.isEdit
      ? $localize`Redigér forbindelsen til FK Organisation`
      : $localize`Opret forbindelse til FK Organisation`;

    this.subscriptions.add(
      this.actions$.pipe(ofType(FkOrgActions.createConnectionSuccess)).subscribe(() => this.cancel())
    );
  }

  nodeExpandClick(node: EntityTreeNode<APIStsOrganizationOrgUnitDTO>): void {
    node.isExpanded = !node.isExpanded;
  }

  levelChange(level: number | undefined) {
    let nextLevel = undefined;
    if (level === 0) {
      nextLevel = 1;
    } else if (level !== undefined && level > 0) {
      nextLevel = level;
    }
    this.levelsSubject$.next(nextLevel);
  }

  synchronize() {
    const request = {
      synchronizationDepth: this.fkOrgFormGroup.controls.levels.value ?? undefined,
      subscribeToUpdates: this.fkOrgFormGroup.controls.subscribeToUpdates.value ?? false,
    };
    this.store.dispatch(FkOrgActions.createConnection(request));
  }

  cancel() {
    this.dialog.close();
  }
}
MOCK CHANGE
