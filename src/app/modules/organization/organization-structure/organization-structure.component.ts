import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { BehaviorSubject, combineLatestWith, filter, first, map, switchMap } from 'rxjs';
import { APIOrganizationUnitResponseDTO } from 'src/app/api/v2';
import { BaseComponent } from 'src/app/shared/base/base.component';
import { mapUnitToTree } from 'src/app/shared/helpers/hierarchy.helpers';
import { EntityTreeNode, EntityTreeNodeMoveResult } from 'src/app/shared/models/structure/entity-tree-node.model';
import { filterNullish } from 'src/app/shared/pipes/filter-nullish';
import { OrganizationUnitActions } from 'src/app/store/organization-unit/actions';
import { selectExpandedNodeUuids, selectOrganizationUnits } from 'src/app/store/organization-unit/selectors';

@Component({
  selector: 'app-organization-structure',
  templateUrl: './organization-structure.component.html',
  styleUrl: './organization-structure.component.scss',
})
export class OrganizationStructureComponent extends BaseComponent implements OnInit {
  public readonly organizationUnits$ = this.store.select(selectOrganizationUnits);
  public readonly unitTree$ = this.organizationUnits$.pipe(
    combineLatestWith(this.store.select(selectExpandedNodeUuids)),
    map(([units, expandedNodeUuids]) => mapUnitToTree(units, expandedNodeUuids))
  );
  public readonly curentUnitUuid$ = this.route.params.pipe(
    map((params) => params['uuid']),
    switchMap((uuid) => (uuid ? [uuid] : this.rootUnitUuid$))
  );

  public readonly unitName$ = this.curentUnitUuid$.pipe(
    combineLatestWith(this.organizationUnits$),
    map(([uuid, organizationUnits]) => {
      const unit = organizationUnits.find((unit) => unit.uuid === uuid);
      return unit ? unit.name : '';
    })
  );

  private readonly rootUnitUuid$ = this.unitTree$.pipe(
    map((units) => units.filter((unit) => unit.isRoot)),
    filter((rootUnits) => rootUnits.length > 0),
    map((rootUnits) => rootUnits[0].uuid)
  );

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
    this.subscriptions.add(
      this.rootUnitUuid$
        .pipe(first())
        .subscribe((uuid) => this.store.dispatch(OrganizationUnitActions.addExpandedNode(uuid)))
    );
    this.store.dispatch;
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
    this.unitName$.pipe(first()).subscribe((unitName) => {
      this.curentUnitUuid$.pipe(first()).subscribe((unitUuid) => {});
    });
  }
}
