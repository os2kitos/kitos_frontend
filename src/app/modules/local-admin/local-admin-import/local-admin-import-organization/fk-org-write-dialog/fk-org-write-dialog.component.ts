import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { BehaviorSubject, first, map } from 'rxjs';
import { APIStsOrganizationOrgUnitDTO } from 'src/app/api/v2';
import { BaseComponent } from 'src/app/shared/base/base.component';
import { mapFkOrgSnapshotUnits } from 'src/app/shared/helpers/hierarchy.helpers';
import { fkOrgChangelogGridColumns } from 'src/app/shared/models/local-admin/fk-org-changelog-columns';
import { EntityTreeNode } from 'src/app/shared/models/structure/entity-tree-node.model';
import { filterNullish } from 'src/app/shared/pipes/filter-nullish';
import { GridActions } from 'src/app/store/grid/actions';
import { FkOrgActions } from 'src/app/store/local-admin/fk-org/actions';
import {
  selectHasSnapshotFailed,
  selectIsSynchronizationDialogLoading,
  selectSnapshot,
  selectSynchronizationStatus,
  selectUpdateConsequences,
} from 'src/app/store/local-admin/fk-org/selectors';
import { OrganizationUnitActions } from 'src/app/store/organization/organization-unit/actions';

@Component({
  selector: 'app-fk-org-write-dialog',
  templateUrl: './fk-org-write-dialog.component.html',
  styleUrl: './fk-org-write-dialog.component.scss',
})
export class FkOrgWriteDialogComponent extends BaseComponent implements OnInit {
  @Input() isEdit: boolean = false;

  public readonly snapshot$ = this.store.select(selectSnapshot).pipe(filterNullish());
  public readonly snapshotTree$ = this.snapshot$.pipe(map((snapshot) => mapFkOrgSnapshotUnits([snapshot])));

  public readonly isLoading$ = this.store.select(selectIsSynchronizationDialogLoading);
  public readonly hasFailed$ = this.store.select(selectHasSnapshotFailed);

  public readonly updateConsequences$ = this.store.select(selectUpdateConsequences);
  public readonly updateConsequencesLength$ = this.updateConsequences$.pipe(
    map((consequences) => (consequences ? consequences.length : 0))
  );

  public readonly synchronizationStatus$ = this.store.select(selectSynchronizationStatus);

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

  public readonly gridColumns = fkOrgChangelogGridColumns;

  constructor(
    private readonly store: Store,
    private readonly actions$: Actions,
    private readonly dialog: MatDialogRef<FkOrgWriteDialogComponent>
  ) {
    super();
  }

  public title = '';
  public proceedText = '';

  ngOnInit(): void {
    this.store.dispatch(FkOrgActions.getSnapshot());

    this.title = this.isEdit
      ? $localize`Redigér forbindelsen til FK Organisation`
      : $localize`Opret forbindelse til FK Organisation`;
    this.proceedText = this.isEdit ? $localize`Vis konsekvenser` : $localize`Opret forbindelse`;

    if (this.isEdit) {
      this.subscriptions.add(
        this.synchronizationStatus$.pipe(first()).subscribe((status) => {
          this.fkOrgFormGroup.controls.levels.setValue(status?.synchronizationDepth);
          this.fkOrgFormGroup.controls.subscribeToUpdates.setValue(status?.subscribesToUpdates ?? false);
        })
      );
    }

    this.subscriptions.add(
      this.actions$
        .pipe(ofType(FkOrgActions.createConnectionSuccess, FkOrgActions.updateConnectionSuccess))
        .subscribe(() => {
          this.store.dispatch(OrganizationUnitActions.getOrganizationUnits());
          this.cancel();
        })
    );

    this.subscriptions.add(
      this.updateConsequences$.subscribe((consequences) => {
        if (consequences === undefined) {
          this.fkOrgFormGroup.controls.levels.enable();
        } else {
          this.fkOrgFormGroup.controls.levels.disable();
        }
      })
    );
  }

  public nodeExpandClick(node: EntityTreeNode<APIStsOrganizationOrgUnitDTO>): void {
    node.isExpanded = !node.isExpanded;
  }

  public levelChange(level: number | undefined) {
    let nextLevel = undefined;
    if (level === 0) {
      nextLevel = 1;
    } else if (level !== undefined && level > 0) {
      nextLevel = level;
    }
    this.levelsSubject$.next(nextLevel);
  }

  public proceedSynchronization() {
    const request = this.getRequest();
    if (this.isEdit) {
      this.store.dispatch(FkOrgActions.previewConnectionUpdate(request.synchronizationDepth));
      return;
    }
    this.store.dispatch(FkOrgActions.createConnection(request));
  }

  public updateSynchronization() {
    this.store.dispatch(FkOrgActions.updateConnection(this.getRequest()));
  }

  public cancelUpdate() {
    this.store.dispatch(FkOrgActions.cancelUpdate());
  }

  public cancel() {
    this.dialog.close();
  }

  public exportToExcel() {
    this.store.dispatch(GridActions.exportLocalData());
  }

  private getRequest() {
    return {
      synchronizationDepth: this.fkOrgFormGroup.controls.levels.value ?? undefined,
      subscribeToUpdates: this.fkOrgFormGroup.controls.subscribeToUpdates.value ?? false,
    };
  }
}
