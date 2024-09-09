import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { combineLatestWith, filter, map, switchMap, tap } from 'rxjs';
import { BaseComponent } from 'src/app/shared/base/base.component';
import {
  mapTreeToIdentityNamePairs,
  mapUnitsToTree,
  removeNodeAndChildren,
} from 'src/app/shared/helpers/hierarchy.helpers';
import { OrganizationUnitActions } from 'src/app/store/organization-unit/actions';
import { selectOrganizationUnits } from 'src/app/store/organization-unit/selectors';
import { EditOrganizationDialogComponent } from '../edit-organization-dialog/edit-organization-dialog.component';

@Component({
  selector: 'app-organization-structure',
  templateUrl: './organization-structure.component.html',
  styleUrl: './organization-structure.component.scss',
})
export class OrganizationStructureComponent extends BaseComponent implements OnInit {
  public readonly currentUnitUuid$ = this.route.params.pipe(
    map((params) => params['uuid']),
    switchMap((uuid) => (uuid ? [uuid] : this.rootUnitUuid$))
  );

  private readonly organizationUnits$ = this.store.select(selectOrganizationUnits);

  public readonly unitTree$ = this.organizationUnits$.pipe(map((units) => mapUnitsToTree(units)));

  public readonly currentOrganizationUnit$ = this.organizationUnits$.pipe(
    combineLatestWith(this.currentUnitUuid$),
    map(([organizationUnits, currentUuid]) => {
      const unit = organizationUnits.find((unit) => unit.uuid === currentUuid);
      return unit ?? { uuid: '', name: '' };
    })
  );

  public readonly validParentOrganizationUnits$ = this.unitTree$.pipe(
    combineLatestWith(this.currentUnitUuid$),
    map(([unitTree, currentUnitUuid]) => {
      const filteredUnitTree = removeNodeAndChildren(unitTree, currentUnitUuid);
      return mapTreeToIdentityNamePairs(filteredUnitTree);
    })
  );

  public readonly currentUnitName$ = this.currentOrganizationUnit$.pipe(map((unit) => unit.name));

  private readonly rootUnitUuid$ = this.unitTree$.pipe(
    map((units) => units.filter((unit) => unit.isRoot)),
    filter((rootUnits) => rootUnits.length > 0),
    map((rootUnits) => rootUnits[0].uuid)
  );

  constructor(private store: Store, private route: ActivatedRoute, private dialog: MatDialog) {
    super();
  }

  ngOnInit(): void {
    this.store.dispatch(OrganizationUnitActions.getOrganizationUnits());
  }

  onClickEdit() {
    this.setupEditDialog();
  }

  private setupEditDialog() {
    const dialogRef = this.dialog.open(EditOrganizationDialogComponent);
    const dialogInstance = dialogRef.componentInstance;
    dialogInstance.unit$ = this.currentOrganizationUnit$;
    dialogInstance.rootUnitUuid$ = this.rootUnitUuid$;
    dialogInstance.validParentOrganizationUnits$ = this.validParentOrganizationUnits$;
  }
}
