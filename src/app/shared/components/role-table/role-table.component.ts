import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Actions, ofType } from '@ngrx/effects';
import { Dictionary } from '@ngrx/entity';
import { Store } from '@ngrx/store';
import { BehaviorSubject, combineLatest, combineLatestWith, first, map, Observable } from 'rxjs';
import { APIExtendedRoleAssignmentResponseDTO, APIRoleOptionResponseDTO } from 'src/app/api/v2';
import { RoleAssignmentActions } from 'src/app/store/role-assignment/actions';
import { RoleOptionTypeActions } from 'src/app/store/roles-option-type-store/actions';
import { selectHasValidCache, selectRoleOptionTypesDictionary } from 'src/app/store/roles-option-type-store/selectors';
import { BaseComponent } from '../../base/base.component';
import { RoleOptionTypeTexts } from '../../models/options/role-option-texts.model';
import { RoleOptionTypes } from '../../models/options/role-option-types.model';
import { filterNullish } from '../../pipes/filter-nullish';
import { invertBooleanValue } from '../../pipes/invert-boolean-value';
import { matchEmptyArray } from '../../pipes/match-empty-array';
import { ConfirmActionCategory, ConfirmActionService } from '../../services/confirm-action.service';
import { RoleOptionTypeService } from '../../services/role-option-type.service';
import { RoleTableComponentStore } from './role-table.component-store';
import { RoleTableCreateDialogComponent } from './role-table.create-dialog/role-table.create-dialog.component';

@Component({
  selector: 'app-role-table[entityUuid][entityType][hasModifyPermission]',
  templateUrl: './role-table.component.html',
  styleUrls: ['./role-table.component.scss'],
  providers: [RoleTableComponentStore],
})
export class RoleTableComponent extends BaseComponent implements OnInit {
  @Input() public entityUuid!: Observable<string>;
  @Input() public entityType!: RoleOptionTypes;
  @Input() public hasModifyPermission!: boolean;
  public entityName = '';

  public availableRolesDictionary$ = new BehaviorSubject<Dictionary<APIRoleOptionResponseDTO> | undefined>(undefined);

  public readonly availableRolesLoading = this.availableRolesDictionary$.pipe(
    map((availableRoles) => {
      return availableRoles ? false : true;
    })
  );

  public readonly roles$ = this.componentStore.roles$;
  public readonly isLoading$ = combineLatest([
    this.componentStore.rolesIsLoading$,
    this.store.select(selectHasValidCache(this.entityType)),
    this.availableRolesLoading,
  ]).pipe(
    map(([isLoading, hasInvalidCache, availableRolesLoading]) => isLoading || hasInvalidCache || availableRolesLoading)
  );
  public readonly anyRoles$ = this.roles$.pipe(matchEmptyArray(), invertBooleanValue());

  constructor(
    private readonly store: Store,
    private readonly componentStore: RoleTableComponentStore,
    private readonly roleOptionTypeService: RoleOptionTypeService,
    private readonly dialog: MatDialog,
    private readonly actions$: Actions,
    private readonly confirmationService: ConfirmActionService
  ) {
    super();
  }

  ngOnInit(): void {
    this.entityName = RoleOptionTypeTexts[this.entityType].name;
    //get role options (in order to get description and write access)
    this.store.dispatch(RoleOptionTypeActions.getOptions(this.entityType));

    this.subscriptions.add(
      this.store
        .select(selectRoleOptionTypesDictionary(this.entityType))
        .pipe(filterNullish())
        .subscribe((roles) => {
          this.availableRolesDictionary$.next(roles);
        })
    );

    //get roles
    this.getRoles();

    //on role add/remove update the list
    this.subscriptions.add(
      this.actions$
        .pipe(ofType(RoleAssignmentActions.addRoleSuccess, RoleAssignmentActions.removeRoleSuccess))
        .subscribe(() => {
          this.getRoles();
        })
    );

    this.subscriptions.add(
      this.entityUuid.subscribe((uuid) => {
        this.componentStore.getRolesByEntityUuid({ entityUuid: uuid, entityType: this.entityType });
      })
    );
  }

  public onAddNew() {
    this.subscriptions.add(
      this.roles$.pipe(combineLatestWith(this.entityUuid), first()).subscribe(([userRoles, entityUuid]) => {
        const dialogRef = this.dialog.open(RoleTableCreateDialogComponent);
        dialogRef.componentInstance.userRoles = userRoles;
        dialogRef.componentInstance.entityType = this.entityType;
        dialogRef.componentInstance.entityUuid = entityUuid;
        dialogRef.componentInstance.title = $localize`Tilføj ${this.entityName.toLocaleLowerCase()}`;
      })
    );
  }

  public onRemove(role: APIExtendedRoleAssignmentResponseDTO) {
    this.confirmationService.confirmAction({
      category: ConfirmActionCategory.Warning,
      message: $localize`Er du sikker på at du vil fjerne tildelingen af rollen "${role.role.name}" til brugeren "${role.user.name}"?`,
      onConfirm: () =>
        this.roleOptionTypeService.dispatchRemoveEntityRoleAction(role.user.uuid, role.role.uuid, this.entityType),
    });
  }

  private getRoles() {
    this.entityUuid.pipe(first()).subscribe((entityUuid) => {
      this.componentStore.getRolesByEntityUuid({ entityUuid, entityType: this.entityType });
    });
  }
}
