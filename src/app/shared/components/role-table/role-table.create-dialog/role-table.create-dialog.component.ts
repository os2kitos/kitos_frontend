import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { first, map } from 'rxjs';
import {
  APIExtendedRoleAssignmentResponseDTO,
  APIOrganizationUserResponseDTO,
  APIRoleOptionResponseDTO,
  APIV2ItSystemUsageService,
} from 'src/app/api/v2';
import { BaseComponent } from 'src/app/shared/base/base.component';
import { RoleOptionTypes } from 'src/app/shared/models/options/role-option-types.model';
import { filterNullish } from 'src/app/shared/pipes/filter-nullish';
import { selectRoleOptionTypes } from 'src/app/store/roles-option-type-store/selectors';
import { RoleTableComponentStore } from '../role-table.component-store';

@Component({
  selector: 'app-role-table.create-dialog[userRoles]',
  templateUrl: './role-table.create-dialog.component.html',
  styleUrls: ['./role-table.create-dialog.component.scss'],
  providers: [RoleTableComponentStore],
})
export class RoleTableCreateDialogComponent extends BaseComponent implements OnInit {
  @Input() public userRoles: Array<APIExtendedRoleAssignmentResponseDTO> = [];
  @Input() public optionType!: RoleOptionTypes;
  public readonly users$ = this.componentStore.users$;
  public readonly isLoading$ = this.componentStore.usersIsLoading$;

  public readonly roles$ = this.store.select(selectRoleOptionTypes('it-system-usage')).pipe(filterNullish());

  public readonly showSearchHelpText$ = this.componentStore.users$.pipe(
    filterNullish(),
    map((users) => users.length >= this.componentStore.PAGE_SIZE)
  );

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
  public availableRoles: Array<APIRoleOptionResponseDTO> = [];

  constructor(
    private readonly store: Store,
    private readonly componentStore: RoleTableComponentStore,
    private readonly dialog: MatDialogRef<RoleTableCreateDialogComponent>,
    private readonly usageRoleService: APIV2ItSystemUsageService
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

    this.roles$.pipe(first()).subscribe((roles) => {
      const rolesAssignedToUserUuids = this.userRoles.filter((x) => x.user.uuid !== user.uuid).map((x) => x.role.uuid);
      this.availableRoles = roles.filter((x) => !rolesAssignedToUserUuids.includes(x.uuid));
    });
    this.isUserSelected = true;
  }

  public onSave() {
    if(!this.roleForm.valid) return;

    const userUuid = this.roleForm.value.user?.uuid;
    const roleUuid = this.roleForm.value.role?.uuid;
    if(!userUuid || !roleUuid) return;

    switch(this.)
    console.log('SAVE');
  }

  onCancel() {
    this.dialog.close();
  }
}
