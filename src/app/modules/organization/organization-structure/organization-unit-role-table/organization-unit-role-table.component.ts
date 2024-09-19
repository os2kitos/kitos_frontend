import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Actions } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { BehaviorSubject, combineLatest, combineLatestWith, first, map } from 'rxjs';
import { BaseRoleTableComponent } from 'src/app/shared/base/base-role-table.component';
import { RoleTableComponentStore } from 'src/app/shared/components/role-table/role-table.component-store';
import { invertBooleanValue } from 'src/app/shared/pipes/invert-boolean-value';
import { matchEmptyArray } from 'src/app/shared/pipes/match-empty-array';
import { ConfirmActionService } from 'src/app/shared/services/confirm-action.service';
import { RoleOptionTypeService } from 'src/app/shared/services/role-option-type.service';

@Component({
  selector: 'app-org-unit-role-table',
  templateUrl: 'organization-unit-role-table.component.html',
  styleUrls: ['organization-unit-role-table.component.scss'],
  providers: [RoleTableComponentStore],
})
export class OrganizationUnitRoleTableComponent extends BaseRoleTableComponent implements OnInit {
  @Input() public unitName!: string;
  @Input() public checkboxSubject$!: BehaviorSubject<boolean>;

  private readonly includeSubunitsSubject$ = new BehaviorSubject<boolean>(false);

  public readonly roles$ = combineLatest([this.componentStore.roles$, this.includeSubunitsSubject$]).pipe(
    map(([roles, includeSubnits]) => {
      if (!includeSubnits) {
        return roles.filter((role) => role.unitName === this.unitName);
      } else {
        return roles;
      }
    })
  );

  public readonly anyRoles$ = this.roles$.pipe(matchEmptyArray(), invertBooleanValue());

  constructor(
    override readonly store: Store,
    override readonly componentStore: RoleTableComponentStore,
    override readonly roleOptionTypeService: RoleOptionTypeService,
    override readonly dialog: MatDialog,
    override readonly actions$: Actions,
    override readonly confirmationService: ConfirmActionService
  ) {
    super(store, componentStore, actions$, roleOptionTypeService, confirmationService, dialog);
  }

  override ngOnInit(): void {
    super.ngOnInit();

    this.checkboxSubject$.subscribe((includeSubunits) => {
      this.includeSubunitsSubject$.next(includeSubunits);
    });
  }

  public onAddNew() {
    this.subscriptions.add(
      this.roles$.pipe(combineLatestWith(this.entityUuid$), first()).subscribe(([userRoles, entityUuid]) => {
        this.openAddNewDialog(userRoles, entityUuid);
      })
    );
  }
}
