import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { BehaviorSubject, combineLatestWith, filter, map, switchMap } from 'rxjs';
import { APIOrganizationUnitResponseDTO } from 'src/app/api/v2';
import { BaseComponent } from 'src/app/shared/base/base.component';
import { mapUnitToTree } from 'src/app/shared/helpers/hierarchy.helpers';
import { EntityTreeNodeMoveResult } from 'src/app/shared/models/structure/entity-tree-node.model';
import { filterNullish } from 'src/app/shared/pipes/filter-nullish';
import { OrganizationUnitActions } from 'src/app/store/organization-unit/actions';
import { selectOrganizationUnits } from 'src/app/store/organization-unit/selectors';

@Component({
  selector: 'app-organization-structure',
  templateUrl: './organization-structure.component.html',
  styleUrl: './organization-structure.component.scss',
})
export class OrganizationStructureComponent extends BaseComponent implements OnInit {
  public readonly organizationUnits$ = this.store.select(selectOrganizationUnits);
  public readonly unitTree$ = this.organizationUnits$.pipe(map((units) => mapUnitToTree(units)));
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

  constructor(private store: Store, private route: ActivatedRoute, private actions$: Actions) {
    super();
  }

  ngOnInit(): void {
    this.store.dispatch(OrganizationUnitActions.getOrganizationUnits());

    this.subscriptions.add(
      this.actions$.pipe(ofType(OrganizationUnitActions.patchOrganizationUnitSuccess)).subscribe((unit) => {
        //TODO: Dispatch an action to update the tree
      })
    );
  }

  changeDragState(): void {
    this.dragDisabledSubject.next(!this.dragDisabledSubject.value);
  }

  moveNode(event: EntityTreeNodeMoveResult<APIOrganizationUnitResponseDTO>): void {
    this.store.dispatch(
      OrganizationUnitActions.patchOrganizationUnit(event.movedNode.uuid, {
        parentUuid: event.targetParentNode.uuid,
      })
    );
  }
}
