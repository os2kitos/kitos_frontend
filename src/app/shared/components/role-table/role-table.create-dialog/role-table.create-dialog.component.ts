import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { concatLatestFrom } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { map } from 'rxjs';
import { APIOrganizationUserResponseDTO, APIRoleOptionResponseDTO } from 'src/app/api/v2';
import { BaseComponent } from 'src/app/shared/base/base.component';
import { filterNullish } from 'src/app/shared/pipes/filter-nullish';
import { selectRoleOptionTypes } from 'src/app/store/roles-option-type-store/selectors';
import { RoleTableComponentStore } from '../role-table.component-store';

@Component({
  selector: 'app-role-table.create-dialog',
  templateUrl: './role-table.create-dialog.component.html',
  styleUrls: ['./role-table.create-dialog.component.scss'],
  providers: [RoleTableComponentStore],
})
export class RoleTableCreateDialogComponent extends BaseComponent implements OnInit {
  public readonly users$ = this.componentStore.users$;
  public readonly isLoading$ = this.componentStore.usersIsLoading$;

  public readonly roles$ = this.store.select(selectRoleOptionTypes('it-system-usage')).pipe(
    filterNullish(),
    concatLatestFrom(() => this.userRoles$),
    map(([roles, userRoles]) => {})
  );

  public readonly showSearchHelpText$ = this.componentStore.users$.pipe(
    filterNullish(),
    map((users) => users.length >= this.componentStore.PAGE_SIZE)
  );

  private readonly userRoles$ = this.componentStore.roles$;

  public readonly roleForm = new FormGroup({
    user: new FormControl<APIOrganizationUserResponseDTO | undefined>(
      { value: undefined, disabled: false },
      Validators.required
    ),
    role: new FormControl<APIRoleOptionResponseDTO | undefined>(
      { value: undefined, disabled: false },
      Validators.required
    ),
  });

  public isUserSelected = false;
  public availableRoles = undefined;

  constructor(
    private readonly store: Store,
    private readonly componentStore: RoleTableComponentStore,
    private readonly dialog: MatDialogRef<RoleTableCreateDialogComponent>
  ) {
    super();
  }

  ngOnInit() {
    this.componentStore.getUsers(undefined);
  }

  public filterChange(filter?: string) {
    this.componentStore.getUsers(filter);
  }

  public userChange(user?: APIOrganizationUserResponseDTO | null) {
    if (!user) {
      this.isUserSelected = false;
      this.roleForm.value.role = null;
      return;
    }

    //TODO: map roles based on the currently selected user
    /* this.roles$.pipe(concatLatestFrom(() => this.userRoles$), map(([roles, userRoles]) => (userRoles ? {roles, userRoles} : roles)), first()).subscribe((params) => {
      if(params)
      const user = this.roleForm.value.user;
      if (!user) return params.roles;

      const rolesAssignedToUserUuids = userRoles.filter((x) => x.user.uuid === user.uuid).map((x) => x.role.uuid);
      return roles.filter((x) => !rolesAssignedToUserUuids.includes(x.uuid));
    }) */
    this.isUserSelected = true;
  }

  public onSave() {
    console.log('SAVE');
  }

  onCancel() {
    this.dialog.close();
  }
}
