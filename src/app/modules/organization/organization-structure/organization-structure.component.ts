import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { combineLatestWith, filter, first, map, switchMap } from 'rxjs';
import { BaseComponent } from 'src/app/shared/base/base.component';
import { mapUnitToTree } from 'src/app/shared/helpers/hierarchy.helpers';
import { ConfirmActionCategory, ConfirmActionService } from 'src/app/shared/services/confirm-action.service';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { OrganizationUnitActions } from 'src/app/store/organization-unit/actions';
import { selectOrganizationUnits } from 'src/app/store/organization-unit/selectors';

@Component({
  selector: 'app-organization-structure',
  templateUrl: './organization-structure.component.html',
  styleUrl: './organization-structure.component.scss',
})
export class OrganizationStructureComponent extends BaseComponent implements OnInit {
  public readonly unitTree$ = this.store.select(selectOrganizationUnits).pipe(map((units) => mapUnitToTree(units)));
  public readonly curentUnitUuid$ = this.route.params.pipe(
    map((params) => params['uuid']),
    switchMap((uuid) => (uuid ? [uuid] : this.rootUnitUuid$))
  );

  private readonly organizationUnits$ = this.store.select(selectOrganizationUnits);
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

  constructor(private store: Store, private route: ActivatedRoute, private notificationSerivce: NotificationService, private confirmActionService: ConfirmActionService, private actions$: Actions) {
    super();
  }

  ngOnInit(): void {
    this.store.dispatch(OrganizationUnitActions.getOrganizationUnits());

    this.actions$.pipe(ofType(OrganizationUnitActions.deleteOrganizationUnitSuccess)).subscribe(() => {
      this.unitName$.pipe(first()).subscribe((unitName) => {
        this.notificationSerivce.showDefault($localize`${unitName} blev slettet!`);
      });
      //Dispatch update hierarchy action here
    });

    this.actions$.pipe(ofType(OrganizationUnitActions.deleteOrganizationUnitError)).subscribe(() => {
      this.notificationSerivce.showError($localize`Der skete en fejl under sletning af enheden`);
    });
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
}
