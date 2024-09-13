import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';

import { combineLatestWith, filter, first, map, switchMap } from 'rxjs';

import { BehaviorSubject } from 'rxjs';
import { APIOrganizationUnitResponseDTO } from 'src/app/api/v2';
import { CreateSubunitDialogComponent } from 'src/app/modules/organization/organization-structure/create-subunit-dialog/create-subunit-dialog.component';
import { BaseComponent } from 'src/app/shared/base/base.component';
import {
  mapTreeToIdentityNamePairs,
  mapUnitsToTree,
  removeNodeAndChildren,
} from 'src/app/shared/helpers/hierarchy.helpers';
import { EntityTreeNode, EntityTreeNodeMoveResult } from 'src/app/shared/models/structure/entity-tree-node.model';
import { filterNullish } from 'src/app/shared/pipes/filter-nullish';

import { MatDialog } from '@angular/material/dialog';
import { OrganizationUnitActions } from 'src/app/store/organization-unit/actions';
import {
  selectCollectionPermissions,
  selectExpandedNodeUuids,
  selectOrganizationUnits,
  selectUnitPermissions,
} from 'src/app/store/organization-unit/selectors';
import { EditOrganizationDialogComponent } from './edit-organization-dialog/edit-organization-dialog.component';

@Component({
  selector: 'app-organization-structure',
  templateUrl: './organization-structure.component.html',
  styleUrl: './organization-structure.component.scss',
})
export class OrganizationStructureComponent extends BaseComponent implements OnInit {
  public readonly organizationUnits$ = this.store.select(selectOrganizationUnits);

  public readonly unitPermissions$ = this.store.select(selectUnitPermissions);
  public readonly collectionPermissions$ = this.store.select(selectCollectionPermissions);

  public readonly unitTree$ = this.organizationUnits$.pipe(
    combineLatestWith(this.store.select(selectExpandedNodeUuids)),
    map(([units, expandedNodeUuids]) => mapUnitsToTree(units, expandedNodeUuids))
  );

  public readonly currentUnitUuid$ = this.route.params.pipe(
    map((params) => params['uuid']),
    switchMap((uuid) => (uuid ? [uuid] : this.rootUnitUuid$))
  );

  public readonly currentOrganizationUnit$ = this.organizationUnits$.pipe(
    combineLatestWith(this.currentUnitUuid$),
    map(([organizationUnits, currentUuid]) => {
      const unit = organizationUnits.find((unit) => unit.uuid === currentUuid);
      return unit ?? { uuid: '', name: '' };
    })
  );

  private readonly rootUnitUuid$ = this.unitTree$.pipe(
    map((units) => units.filter((unit) => unit.isRoot)),
    filter((rootUnits) => rootUnits.length > 0),
    map((rootUnits) => rootUnits[0].uuid)
  );

  public readonly isRootUnitSelected$ = this.currentUnitUuid$.pipe(
    combineLatestWith(this.rootUnitUuid$),
    map(([uuid, rootUuid]) => uuid === rootUuid)
  );

  public readonly validParentOrganizationUnits$ = this.unitTree$.pipe(
    combineLatestWith(this.currentUnitUuid$),
    map(([unitTree, currentUnitUuid]) => {
      const filteredUnitTree = removeNodeAndChildren(unitTree, currentUnitUuid);
      return mapTreeToIdentityNamePairs(filteredUnitTree);
    })
  );

  public readonly currentUnitName$ = this.currentOrganizationUnit$.pipe(map((unit) => unit.name));

  private dragDisabledSubject: BehaviorSubject<boolean> = new BehaviorSubject(true);
  public isDragDisabled$ = this.dragDisabledSubject.pipe(filterNullish());

  public readonly hasFkOrg$ = this.organizationUnits$.pipe(
    map((organizationUnits) => organizationUnits.some((unit) => unit.origin === 'STSOrganisation'))
  );

  constructor(
    private store: Store,
    private route: ActivatedRoute,
    private actions$: Actions,
    private matDialog: MatDialog
  ) {
    super();
  }

  ngOnInit(): void {
    this.store.dispatch(OrganizationUnitActions.getOrganizationUnits());
    this.store.dispatch(OrganizationUnitActions.getCollectionPermissions());
    this.subscriptions.add(
      this.rootUnitUuid$
        .pipe(first())
        .subscribe((uuid) => this.store.dispatch(OrganizationUnitActions.addExpandedNode(uuid)))
    );

    this.subscriptions.add(
      this.currentUnitUuid$.subscribe((uuid) => {
        this.store.dispatch(OrganizationUnitActions.getPermissions(uuid));
      })
    );
  }

  changeDragState(): void {
    this.dragDisabledSubject.next(!this.dragDisabledSubject.value);
  }

  moveNode(event: EntityTreeNodeMoveResult): void {
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

  nodeExpandClick(node: EntityTreeNode<APIOrganizationUnitResponseDTO>): void {
    if (node.isExpanded) {
      this.store.dispatch(OrganizationUnitActions.removeExpandedNode(node.uuid));
    } else {
      this.store.dispatch(OrganizationUnitActions.addExpandedNode(node.uuid));
    }
  }

  public openCreateSubUnitDialog(): void {
    const dialogRef = this.matDialog.open(CreateSubunitDialogComponent);
    const dialogInstance = dialogRef.componentInstance;
    dialogInstance.parentUnitUuid$ = this.currentUnitUuid$;
    dialogInstance.parentUnitName$ = this.currentUnitName$;
  }

  onClickEdit() {
    this.setupEditDialog();
  }

  private setupEditDialog() {
    const dialogRef = this.matDialog.open(EditOrganizationDialogComponent, { height: '95%', width: '95%' });
    const dialogInstance = dialogRef.componentInstance;
    dialogInstance.unit$ = this.currentOrganizationUnit$;
    dialogInstance.rootUnitUuid$ = this.rootUnitUuid$;
    dialogInstance.validParentOrganizationUnits$ = this.validParentOrganizationUnits$;
  }
}
