import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Actions, ofType } from '@ngrx/effects';

import { AsyncPipe } from '@angular/common';
import { Store } from '@ngrx/store';
import { BehaviorSubject, Subject, combineLatest, map } from 'rxjs';
import { APIRoleOptionResponseDTO } from 'src/app/api/v2';
import { BaseComponent } from 'src/app/shared/base/base.component';
import { mapUserToOption } from 'src/app/shared/models/dropdown-option.model';
import { RoleAssignment } from 'src/app/shared/models/helpers/read-model-role-assignments';
import { RoleOptionTypes } from 'src/app/shared/models/options/role-option-types.model';
import { Dictionary } from 'src/app/shared/models/primitives/dictionary.model';
import { filterNullish } from 'src/app/shared/pipes/filter-nullish';
import { RoleOptionTypeService } from 'src/app/shared/services/role-option-type.service';
import { DataProcessingActions } from 'src/app/store/data-processing/actions';
import { ITContractActions } from 'src/app/store/it-contract/actions';
import { ITSystemUsageActions } from 'src/app/store/it-system-usage/actions';
import { OrganizationUnitActions } from 'src/app/store/organization/organization-unit/actions';
import { selectRoleOptionTypes } from 'src/app/store/roles-option-type-store/selectors';
import { ButtonComponent } from '../../buttons/button/button.component';
import { DialogActionsComponent } from '../../dialogs/dialog-actions/dialog-actions.component';
import { DialogComponent } from '../../dialogs/dialog/dialog.component';
import { DropdownComponent } from '../../dropdowns/dropdown/dropdown.component';
import { MultiSelectDropdownComponent } from '../../dropdowns/multi-select-dropdown/multi-select-dropdown.component';
import { StandardVerticalContentGridComponent } from '../../standard-vertical-content-grid/standard-vertical-content-grid.component';
import { RoleTableComponentStore } from '../role-table.component-store';

@Component({
  selector: 'app-role-table.create-dialog[userRoles][entityType][entityUuid][title]',
  templateUrl: './role-table.create-dialog.component.html',
  styleUrls: ['./role-table.create-dialog.component.scss'],
  providers: [RoleTableComponentStore],
  imports: [
    DialogComponent,
    FormsModule,
    ReactiveFormsModule,
    StandardVerticalContentGridComponent,
    DropdownComponent,
    MultiSelectDropdownComponent,
    DialogActionsComponent,
    ButtonComponent,
    AsyncPipe,
  ],
})
export class RoleTableCreateDialogComponent extends BaseComponent implements OnInit {
  public readonly roleForm = new FormGroup({
    role: new FormControl<APIRoleOptionResponseDTO | undefined>(
      { value: undefined, disabled: false },
      Validators.required,
    ),
  });

  @Input() public userRoles: Array<RoleAssignment> = [];
  @Input() public entityType!: RoleOptionTypes;
  @Input() public entityUuid!: string;
  @Input() public title!: string;

  public readonly availableRoles$ = new BehaviorSubject<APIRoleOptionResponseDTO[]>([]);

  private readonly existingUserUuids$ = new BehaviorSubject<string[]>([]);
  private readonly mappedUsers$ = this.componentStore.users$.pipe(
    filterNullish(),
    map((users) => users?.map((user) => mapUserToOption(user))),
  );
  public readonly filteredUsers$ = combineLatest([this.mappedUsers$, this.existingUserUuids$]).pipe(
    map(([users, existingUserUuids]) => users.filter((user) => !existingUserUuids.includes(user.value))),
  );

  public readonly isLoading$ = this.componentStore.usersIsLoading$;
  public resetSubject$ = new Subject<void>();

  public isBusy = false;
  public isRoleSelected = false;

  private readonly selectedRoleUuid$ = new Subject<string>();
  private selectedUserUuids: string[] = [];
  private roleUserUuidsDictionary: Dictionary<string[]> = {};

  constructor(
    private readonly store: Store,
    private readonly componentStore: RoleTableComponentStore,
    private readonly dialog: MatDialogRef<RoleTableCreateDialogComponent>,
    private readonly roleOptionTypeService: RoleOptionTypeService,
    private readonly actions$: Actions,
  ) {
    super();
  }

  ngOnInit() {
    this.userFilterChange(undefined);
    this.setupExistingUsersPerRoleDictionary();

    this.selectRoleOptions();

    this.subscribeToRoleSelectionChanges();
    this.subscribeToRoleOptionTypeActions();
  }

  public userFilterChange(filter?: string) {
    this.componentStore.getUsers(filter);
  }

  public userChange(userUuids?: string[]) {
    this.selectedUserUuids = userUuids ?? [];
  }

  public roleChange(roleUuid?: string | null) {
    if (!roleUuid) {
      this.isRoleSelected = false;
      return;
    }

    this.isRoleSelected = true;
    this.selectedUserUuids = [];
    this.resetSubject$.next();
    this.selectedRoleUuid$.next(roleUuid);
  }

  public onSave() {
    if (!this.roleForm.valid) return;

    const roleUuid = this.roleForm.value.role?.uuid;
    if (this.selectedUserUuids.length === 0 || !roleUuid) return;

    this.isBusy = true;
    this.roleOptionTypeService.dispatchAddEntityRoleAction(this.selectedUserUuids, roleUuid, this.entityType);
  }

  public onCancel() {
    this.dialog.close();
  }

  public isValid() {
    return this.roleForm.valid && this.selectedUserUuids.length > 0;
  }

  private setupExistingUsersPerRoleDictionary() {
    this.userRoles.forEach((role) => {
      const roleUuid = role.assignment.role.uuid;
      let existingUserUuids = this.roleUserUuidsDictionary[roleUuid];
      if (!existingUserUuids) {
        existingUserUuids = [];
        this.roleUserUuidsDictionary[roleUuid] = existingUserUuids;
      }
      if (role.unitUuid && role.unitUuid != this.entityUuid) {
        return;
      }
      existingUserUuids.push(role.assignment.user.uuid);
    });
  }

  private selectRoleOptions() {
    this.subscriptions.add(
      this.store
        .select(selectRoleOptionTypes(this.entityType))
        .pipe(filterNullish())
        .subscribe((roles) => {
          this.availableRoles$.next(roles);
        }),
    );
  }

  private subscribeToRoleSelectionChanges() {
    this.subscriptions.add(
      this.selectedRoleUuid$.subscribe((roleUuid) => {
        const userUuids = this.roleUserUuidsDictionary[roleUuid];
        this.existingUserUuids$.next(userUuids ?? []);
      }),
    );
  }

  private subscribeToRoleOptionTypeActions() {
    this.subscriptions.add(
      this.actions$
        .pipe(
          ofType(
            ITSystemUsageActions.bulkAddItSystemUsageRoleSuccess,
            ITContractActions.bulkAddItContractRoleSuccess,
            DataProcessingActions.bulkAddDataProcessingRoleSuccess,
            OrganizationUnitActions.bulkAddOrganizationUnitRoleSuccess,
          ),
        )
        .subscribe(() => {
          this.dialog.close();
        }),
    );

    this.subscriptions.add(
      this.actions$
        .pipe(
          ofType(
            ITSystemUsageActions.bulkAddItSystemUsageRoleError,
            ITContractActions.bulkAddItContractRoleError,
            DataProcessingActions.bulkAddDataProcessingRoleError,
            OrganizationUnitActions.bulkAddOrganizationUnitRoleError,
          ),
        )
        .subscribe(() => {
          this.isBusy = false;
        }),
    );
  }
}
