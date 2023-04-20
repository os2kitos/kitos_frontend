import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { Observable, first, map } from 'rxjs';
import {
  APIExtendedRoleAssignmentResponseDTO,
  APIOrganizationUserResponseDTO,
  APIRoleOptionResponseDTO,
} from 'src/app/api/v2';
import { BaseComponent } from 'src/app/shared/base/base.component';
import { DropdownOption, mapRoleToDropdownOptions, mapUserToOption } from 'src/app/shared/models/dropdown-option.model';
import { RoleOptionTypes } from 'src/app/shared/models/options/role-option-types.model';
import { Dictionary } from 'src/app/shared/models/primitives/dictionary.model';
import { filterNullish } from 'src/app/shared/pipes/filter-nullish';
import { ITSystemUsageActions } from 'src/app/store/it-system-usage/actions';
import { selectRoleOptionTypes } from 'src/app/store/roles-option-type-store/selectors';
import { RoleTableComponentStore } from '../role-table.component-store';

@Component({
  selector: 'app-role-table.create-dialog[userRoles][optionType][entityUuid][title]',
  templateUrl: './role-table.create-dialog.component.html',
  styleUrls: ['./role-table.create-dialog.component.scss'],
  providers: [RoleTableComponentStore],
})
export class RoleTableCreateDialogComponent extends BaseComponent implements OnInit {
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

  @Input() public userRoles: Array<APIExtendedRoleAssignmentResponseDTO> = [];
  @Input() public optionType!: RoleOptionTypes;
  @Input() public entityUuid!: string;
  @Input() public title!: string;

  public readonly users$ = this.componentStore.users$.pipe(
    filterNullish(),
    map((users) => users?.map((user) => mapUserToOption(user)))
  );
  public readonly isLoading$ = this.componentStore.usersIsLoading$;

  public roles$?: Observable<DropdownOption[]>;

  //if the number of users equals max PAGE_SIZE display the help text
  public readonly showSearchHelpText$ = this.componentStore.users$.pipe(
    filterNullish(),
    map((users) => users.length >= this.componentStore.PAGE_SIZE)
  );

  public isUserSelected = false;
  public availableRoles: Array<DropdownOption> = [];

  private userRoleUuidsDictionary: Dictionary<string[]> = {};

  constructor(
    private readonly store: Store,
    private readonly componentStore: RoleTableComponentStore,
    private readonly dialog: MatDialogRef<RoleTableCreateDialogComponent>
  ) {
    super();
  }

  ngOnInit() {
    //Get initial users
    this.componentStore.getUsers(undefined);

    //assign roles onInit, because optionType is not available before
    this.roles$ = this.store.select(selectRoleOptionTypes(this.optionType)).pipe(
      filterNullish(),
      map((roles) => roles.map((role) => mapRoleToDropdownOptions(role)))
    );

    //map assigned roles for each user to enable quick lookup
    this.userRoles.forEach((role) => {
      const userUuid = role.user.uuid;
      let rolesUuids = this.userRoleUuidsDictionary[userUuid];
      if (!rolesUuids) {
        rolesUuids = [];
        this.userRoleUuidsDictionary[userUuid] = rolesUuids;
      }
      rolesUuids.push(role.role.uuid);
    });
  }

  public filterChange(filter?: string) {
    this.componentStore.getUsers(filter);
  }

  public userChange(userUuid?: string | null) {
    //if user is null disable the role dropdown
    if (!userUuid) {
      this.isUserSelected = false;
      this.roleForm.value.role = null;
      return;
    }

    //get roles not assigned to the user
    this.roles$?.pipe(first()).subscribe((roles) => {
      const rolesAssignedToUserUuids = this.userRoleUuidsDictionary[userUuid];
      this.availableRoles = roles.filter((x) => !rolesAssignedToUserUuids?.includes(x.uuid));
    });

    //enable role dropdown
    this.isUserSelected = true;
  }

  public onSave() {
    if (!this.roleForm.valid) return;

    const userUuid = this.roleForm.value.user?.uuid;
    const roleUuid = this.roleForm.value.role?.uuid;
    if (!userUuid || !roleUuid) return;

    switch (this.optionType) {
      case 'it-system-usage':
        this.store.dispatch(ITSystemUsageActions.addItSystemUsageRole(userUuid, roleUuid));
        break;
    }

    this.dialog.close();
  }

  onCancel() {
    this.dialog.close();
  }
}
