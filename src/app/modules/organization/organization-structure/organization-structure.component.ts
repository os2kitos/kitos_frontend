import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { combineLatestWith, filter, map, switchMap } from 'rxjs';
import { BaseComponent } from 'src/app/shared/base/base.component';
import { mapUnitsToTree } from 'src/app/shared/helpers/hierarchy.helpers';
import { OrganizationUnitActions } from 'src/app/store/organization-unit/actions';
import { selectOrganizationUnits } from 'src/app/store/organization-unit/selectors';
import { EditOrganizationDialogComponent } from '../edit-organization-dialog/edit-organization-dialog.component';

@Component({
  selector: 'app-organization-structure',
  templateUrl: './organization-structure.component.html',
  styleUrl: './organization-structure.component.scss',
})
export class OrganizationStructureComponent extends BaseComponent implements OnInit {
  public readonly unitTree$ = this.store.select(selectOrganizationUnits).pipe(map((units) => mapUnitsToTree(units)));
  public readonly curentUnitUuid$ = this.route.params.pipe(
    map((params) => params['uuid']),
    switchMap((uuid) => (uuid ? [uuid] : this.rootUnitUuid$))
  );

  private readonly organizationUnits$ = this.store.select(selectOrganizationUnits);
  public readonly currentUnitName$ = this.curentUnitUuid$.pipe(
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

  constructor(private store: Store, private route: ActivatedRoute, private dialog: MatDialog) {
    super();
  }

  ngOnInit(): void {
    this.store.dispatch(OrganizationUnitActions.getOrganizationUnits());
  }

  onClickEdit() {
    const dialogRef = this.dialog.open(EditOrganizationDialogComponent);
    const dialogInstance = dialogRef.componentInstance;
    dialogInstance.unitName$ = this.currentUnitName$;
  }
}
