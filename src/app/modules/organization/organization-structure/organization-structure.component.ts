import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';

import { BehaviorSubject, combineLatestWith, filter, first, map, switchMap } from 'rxjs';

import { APIOrganizationUnitResponseDTO } from 'src/app/api/v2';
import { CreateSubunitDialogComponent } from 'src/app/modules/organization/organization-structure/create-subunit-dialog/create-subunit-dialog.component';
import { BaseComponent } from 'src/app/shared/base/base.component';
import {
  findNodeByUuid,
  getUuidsOfEntityTreeNodeAndhildren,
  mapUnitsToTree,
} from 'src/app/shared/helpers/hierarchy.helpers';
import { EntityTreeNode, EntityTreeNodeMoveResult } from 'src/app/shared/models/structure/entity-tree-node.model';
import { filterNullish } from 'src/app/shared/pipes/filter-nullish';

import { MatDialog } from '@angular/material/dialog';
import { OrganizationUnitActions } from 'src/app/store/organization/organization-unit/actions';
import { selectOrganizationUuid, selectUserDefaultUnitUuid } from 'src/app/store/user-store/selectors';

import {
  selectCurrentUnitUuid,
  selectExpandedNodeUuids,
  selectOrganizationUnits,
  selectUnitPermissions,
} from 'src/app/store/organization/organization-unit/selectors';

import { AppPath } from 'src/app/shared/enums/app-path';
import { EditOrganizationUnitDialogComponent } from './edit-organization-unit-dialog/edit-organization-unit-dialog.component';

@Component({
  selector: 'app-organization-structure',
  templateUrl: './organization-structure.component.html',
  styleUrl: './organization-structure.component.scss',
})
export class OrganizationStructureComponent extends BaseComponent implements OnInit {
  public readonly organizationUuid$ = this.store.select(selectOrganizationUuid).pipe(filterNullish());
  public readonly organizationUnits$ = this.store.select(selectOrganizationUnits);

  public readonly unitPermissions$ = this.store.select(selectUnitPermissions);
  public readonly modificationPermission$ = this.unitPermissions$.pipe(
    map((permissions) => permissions?.canBeModified ?? false)
  );

  public readonly currentUnitUuid$ = this.store.select(selectCurrentUnitUuid);

  public readonly unitTree$ = this.organizationUnits$.pipe(
    combineLatestWith(this.store.select(selectExpandedNodeUuids)),
    map(([units, expandedNodeUuids]) => mapUnitsToTree(units, expandedNodeUuids))
  );

  public readonly disabledUnitsUuids$ = this.unitTree$.pipe(
    combineLatestWith(this.store.select(selectCurrentUnitUuid)),
    map(([organizationUnits, currentUuid]) => {
      if (organizationUnits.length === 0) throw new Error('No units found');
      return findNodeByUuid(organizationUnits[0], currentUuid);
    }),
    map((node) => {
      if (!node) throw new Error('Node not found');
      return getUuidsOfEntityTreeNodeAndhildren(node);
    })
  );

  public readonly currentOrganizationUnit$ = this.organizationUnits$.pipe(
    combineLatestWith(this.currentUnitUuid$),
    map(([organizationUnits, currentUuid]) => {
      const unit = organizationUnits.find((unit) => unit.uuid === currentUuid);
      return unit ?? { uuid: '', name: '' };
    })
  );

  public readonly currentUnitName$ = this.currentOrganizationUnit$.pipe(map((unit) => unit.name));

  private readonly rootUnitUuid$ = this.unitTree$.pipe(
    map((units) => units.filter((unit) => unit.isRoot)),
    filter((rootUnits) => rootUnits.length > 0),
    map((rootUnits) => rootUnits[0].uuid)
  );

  public readonly isRootUnitSelected$ = this.currentUnitUuid$.pipe(
    combineLatestWith(this.rootUnitUuid$),
    map(([uuid, rootUuid]) => uuid === rootUuid)
  );

  private dragDisabledSubject: BehaviorSubject<boolean> = new BehaviorSubject(true);
  public isDragDisabled$ = this.dragDisabledSubject.pipe(filterNullish());

  public includeSubnits$: BehaviorSubject<boolean> = new BehaviorSubject(false);

  public readonly hasFkOrg$ = this.organizationUnits$.pipe(
    map((organizationUnits) => organizationUnits.some((unit) => unit.origin === 'STSOrganisation'))
  );

  constructor(
    private store: Store,
    private route: ActivatedRoute,
    private actions$: Actions,
    private matDialog: MatDialog,
    private router: Router
  ) {
    super();
  }

  ngOnInit(): void {
    this.subscribeToDefaultOrgUnitRedirect();
    this.store.dispatch(OrganizationUnitActions.getOrganizationUnits());
    this.subscriptions.add(
      this.rootUnitUuid$
        .pipe(first())
        .subscribe((uuid) => this.store.dispatch(OrganizationUnitActions.addExpandedNodes([uuid])))
    );

    this.subscriptions.add(
      this.currentUnitUuid$.subscribe((uuid) => {
        this.store.dispatch(OrganizationUnitActions.getPermissions(uuid));
      })
    );

    this.subscriptions.add(
      this.route.params
        .pipe(
          map((params) => params['uuid']),
          switchMap((uuid) => (uuid ? [uuid] : this.rootUnitUuid$))
        )
        .subscribe((uuid) => {
          this.store.dispatch(OrganizationUnitActions.updateCurrentUnitUuid(uuid));
        })
    );
  }

  public changeDragState(): void {
    this.dragDisabledSubject.next(!this.dragDisabledSubject.value);
  }

  public moveNode(event: EntityTreeNodeMoveResult): void {
    this.subscriptions.add(
      this.actions$
        .pipe(
          ofType(OrganizationUnitActions.patchOrganizationUnitSuccess),
          first(),
          combineLatestWith(this.organizationUnits$),
          first()
        )
        .subscribe(([{ unit }, units]) => {
          this.store.dispatch(OrganizationUnitActions.updateHierarchy(unit, units));
        })
    );

    this.store.dispatch(
      OrganizationUnitActions.patchOrganizationUnit(event.movedNodeUuid, {
        parentUuid: event.targetParentNodeUuid,
      })
    );
  }

  public nodeExpandClick(node: EntityTreeNode<APIOrganizationUnitResponseDTO>): void {
    if (node.isExpanded) {
      this.store.dispatch(OrganizationUnitActions.removeExpandedNode(node.uuid));
    } else {
      this.store.dispatch(OrganizationUnitActions.addExpandedNodes([node.uuid]));
    }
  }

  public openCreateSubUnitDialog(): void {
    const dialogRef = this.matDialog.open(CreateSubunitDialogComponent);
    const dialogInstance = dialogRef.componentInstance;
    dialogInstance.parentUnitUuid$ = this.currentUnitUuid$;
    dialogInstance.parentUnitName$ = this.currentUnitName$;
  }

  public onClickEdit() {
    this.setupEditDialog();
  }

  public checkboxChange(value: boolean | undefined) {
    if (value === undefined) {
      return;
    }
    this.includeSubnits$.next(value);
  }

  private setupEditDialog() {
    const dialogRef = this.matDialog.open(EditOrganizationUnitDialogComponent, { height: '95%', width: '95%' });
    const dialogInstance = dialogRef.componentInstance;
    dialogInstance.unit$ = this.currentOrganizationUnit$;
    dialogInstance.rootUnitUuid$ = this.rootUnitUuid$;
    dialogInstance.disabledUnitsUuids$ = this.disabledUnitsUuids$;
  }

  private findParentUuids(units: APIOrganizationUnitResponseDTO[], uuid: string): string[] {
    const unit = units.find((u) => u.uuid === uuid);
    if (!unit || !unit.parentOrganizationUnit) {
      return [];
    }

    const parentUuid = unit.parentOrganizationUnit.uuid;
    return [parentUuid, ...this.findParentUuids(units, parentUuid)];
  }

  private subscribeToDefaultOrgUnitRedirect() {
    this.subscriptions.add(
      this.actions$.pipe(ofType(OrganizationUnitActions.getOrganizationUnitsSuccess)).subscribe(() => {
        this.store
          .select(selectUserDefaultUnitUuid)
          .pipe(combineLatestWith(this.organizationUnits$), first())
          .subscribe(([uuid, units]) => {
            if (uuid) {
              this.router.navigate([`${AppPath.organization}/${AppPath.structure}/${uuid}`]);
              this.store.dispatch(OrganizationUnitActions.addExpandedNodes(this.findParentUuids(units, uuid)));
            }
          });
      })
    );
  }
}
