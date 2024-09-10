import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';

import { combineLatestWith, filter, first, map, switchMap } from 'rxjs';
import { ConfirmActionCategory, ConfirmActionService } from 'src/app/shared/services/confirm-action.service';

import { BehaviorSubject } from 'rxjs';
import { APIOrganizationUnitResponseDTO } from 'src/app/api/v2';
import { CreateSubunitDialogComponent } from 'src/app/modules/organization/organization-structure/create-subunit-dialog/create-subunit-dialog.component';
import { BaseComponent } from 'src/app/shared/base/base.component';
import { mapUnitToTree } from 'src/app/shared/helpers/hierarchy.helpers';
import { EntityTreeNode, EntityTreeNodeMoveResult } from 'src/app/shared/models/structure/entity-tree-node.model';
import { filterNullish } from 'src/app/shared/pipes/filter-nullish';

import { MatDialog } from '@angular/material/dialog';
import { OrganizationUnitActions } from 'src/app/store/organization-unit/actions';
import { selectExpandedNodeUuids, selectOrganizationUnits } from 'src/app/store/organization-unit/selectors';
import { Location } from '@angular/common';
import { AppPath } from 'src/app/shared/enums/app-path';

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

  public readonly isRootUnitSelected$ = this.curentUnitUuid$.pipe(
    combineLatestWith(this.rootUnitUuid$),
    map(([uuid, rootUuid]) => uuid === rootUuid)
  );

  private readonly rootUnitUrl$ = this.rootUnitUuid$.pipe(map((uuid) => `${AppPath.organization}/${AppPath.structure}/${uuid}`));

  private dragDisabledSubject: BehaviorSubject<boolean> = new BehaviorSubject(true);
  public isDragDisabled$ = this.dragDisabledSubject.pipe(filterNullish());

  public readonly hasFkOrg$ = this.organizationUnits$.pipe(
    map((organizationUnits) => organizationUnits.some((unit) => unit.origin === 'STSOrganisation'))
  );

  constructor(
    private store: Store,
    private route: ActivatedRoute,
    private actions$: Actions,
    private confirmActionService: ConfirmActionService,
    private matDialog: MatDialog,
    private router: Router
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
    this.subscriptions.add(
      this.actions$
        .pipe(ofType(OrganizationUnitActions.deleteOrganizationUnitSuccess), combineLatestWith(this.rootUnitUrl$))
        .subscribe(([_, rootUnitUrl]) => {
          this.router.navigateByUrl(rootUnitUrl);
        })
    );
  }

  public openDeleteDialog(): void {
    this.confirmActionService.confirmAction({
      category: ConfirmActionCategory.Warning,
      onConfirm: () => this.confirmDeleteHandler(),
      message: $localize`Er du sikker på at du vil slette denne enhed?`,
      title: $localize`Slet enhed`,
    });
  }

  private confirmDeleteHandler(): void {
    this.curentUnitUuid$.pipe(first()).subscribe((uuid) => {
      this.store.dispatch(OrganizationUnitActions.deleteOrganizationUnit(uuid));
    });
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
    dialogInstance.parentUnitUuid$ = this.curentUnitUuid$;
    dialogInstance.parentUnitName$ = this.unitName$;
  }
}
