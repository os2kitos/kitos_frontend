import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Actions, concatLatestFrom, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { Subject, map } from 'rxjs';
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
import { RoleOptionTypeService } from 'src/app/shared/services/role-option-type.service';
import { ITSystemUsageActions } from 'src/app/store/it-system-usage/actions';
import { selectRoleOptionTypes } from 'src/app/store/roles-option-type-store/selectors';
import { RoleTableComponentStore } from '../role-table.component-store';

@Component({
  selector: 'app-role-table.create-dialog[userRoles][entityType][entityUuid][title]',
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
      { value: undefined, disabled: true },
      Validators.required
    ),
  });

  @Input() public userRoles: Array<APIExtendedRoleAssignmentResponseDTO> = [];
  @Input() public entityType!: RoleOptionTypes;
  @Input() public entityUuid!: string;
  @Input() public title!: string;

  public readonly users$ = this.componentStore.users$.pipe(
    filterNullish(),
    map((users) => users?.map((user) => mapUserToOption(user)))
  );
  public readonly isLoading$ = this.componentStore.usersIsLoading$;

  public roles$ = new Subject<Array<DropdownOption>>();
  public selectedUserUuid$ = new Subject<string>();

  public readonly selectUserResultIsLimited$ = this.componentStore.selectUserResultIsLimited$;

  public isBusy = false;

  private userRoleUuidsDictionary: Dictionary<string[]> = {};

  constructor(
    private readonly store: Store,
    private readonly componentStore: RoleTableComponentStore,
    private readonly dialog: MatDialogRef<RoleTableCreateDialogComponent>,
    private readonly roleOptionTypeService: RoleOptionTypeService,
    private readonly actions$: Actions
  ) {
    super();
  }

  ngOnInit() {
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

    //assign roles onInit, because optionType is not available before
    this.subscriptions.add(
      this.selectedUserUuid$
        .pipe(
          concatLatestFrom(() =>
            this.store.select(selectRoleOptionTypes(this.entityType)).pipe(
              filterNullish(),
              map((roles) => roles.map((role) => mapRoleToDropdownOptions(role)))
            )
          )
        )
        .subscribe(([userUuid, roles]) => {
          const rolesAssignedToUserUuids = this.userRoleUuidsDictionary[userUuid];
          const availableRoles = roles.filter((x) => !rolesAssignedToUserUuids?.includes(x.uuid));
          this.roles$.next(availableRoles);
        })
    );

    this.subscriptions.add(
      this.actions$.pipe(ofType(ITSystemUsageActions.addItSystemUsageRoleSuccess)).subscribe(() => {
        this.dialog.close();
      })
    );

    this.subscriptions.add(
      this.actions$.pipe(ofType(ITSystemUsageActions.addItSystemUsageRoleError)).subscribe(() => {
        this.isBusy = false;
      })
    );
  }

  public userFilterChange(filter?: string) {
    this.componentStore.getUsers(filter);
  }

  public userChange(userUuid?: string | null) {
    this.roleForm.value.role = null;
    const roleControl = this.roleForm.controls['role'];
    //if user is null disable the role dropdown
    if (!userUuid) {
      roleControl.disable();
      roleControl.reset();
      return;
    }

    //enable role dropdown
    roleControl.enable();
    this.selectedUserUuid$.next(userUuid);
  }

  public loadAllUsers() {
    this.componentStore.getUsers(undefined);
  }

  public onSave() {
    if (!this.roleForm.valid) return;

    const userUuid = this.roleForm.value.user?.uuid;
    const roleUuid = this.roleForm.value.role?.uuid;
    if (!userUuid || !roleUuid) return;

    this.isBusy = true;
    this.roleOptionTypeService.dispatchAddEntityRoleAction(userUuid, roleUuid, this.entityType);
  }

  public onCancel() {
    this.dialog.close();
  }
}
