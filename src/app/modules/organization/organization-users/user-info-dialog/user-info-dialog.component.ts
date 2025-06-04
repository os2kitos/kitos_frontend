import { AsyncPipe, NgIf } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { BehaviorSubject, combineLatest, map, Observable } from 'rxjs';
import { BaseComponent } from 'src/app/shared/base/base.component';
import {
  ODataOrganizationUser,
  Right,
} from 'src/app/shared/models/organization/organization-user/organization-user.model';
import { filterNullish } from 'src/app/shared/pipes/filter-nullish';
import { DialogOpenerService } from 'src/app/shared/services/dialog-opener.service';
import { RoleOptionTypeService } from 'src/app/shared/services/role-option-type.service';
import { OrganizationUserActions } from 'src/app/store/organization/organization-user/actions';
import { selectRoleOptionTypes, selectRoleOptionTypesLoading } from 'src/app/store/roles-option-type-store/selectors';
import { ButtonComponent } from '../../../../shared/components/buttons/button/button.component';
import { ContentSpaceBetweenComponent } from '../../../../shared/components/content-space-between/content-space-between.component';
import { DialogActionsComponent } from '../../../../shared/components/dialogs/dialog-actions/dialog-actions.component';
import { ScrollbarDialogComponent } from '../../../../shared/components/dialogs/dialog/scrollbar-dialog/scrollbar-dialog.component';
import { TrashcanIconComponent } from '../../../../shared/components/icons/trashcan-icon.component';
import { LoadingComponent } from '../../../../shared/components/loading/loading.component';
import { ParagraphComponent } from '../../../../shared/components/paragraph/paragraph.component';
import { StandardVerticalContentGridComponent } from '../../../../shared/components/standard-vertical-content-grid/standard-vertical-content-grid.component';
import { AppDatePipe } from '../../../../shared/pipes/app-date.pipe';
import { UserRoleTableComponent } from './user-role-table/user-role-table.component';

@Component({
  selector: 'app-user-info-dialog',
  templateUrl: './user-info-dialog.component.html',
  styleUrl: './user-info-dialog.component.scss',
  imports: [
    NgIf,
    ScrollbarDialogComponent,
    StandardVerticalContentGridComponent,
    UserRoleTableComponent,
    ContentSpaceBetweenComponent,
    ParagraphComponent,
    DialogActionsComponent,
    ButtonComponent,
    TrashcanIconComponent,
    AsyncPipe,
    AppDatePipe,
    LoadingComponent,
  ],
})
export class UserInfoDialogComponent extends BaseComponent implements OnInit {
  @Input() user$!: Observable<ODataOrganizationUser>;
  @Input() hasModificationPermission$!: Observable<boolean | undefined>;

  public $sendingNotification = new BehaviorSubject(false);

  public readonly unitRoles$ = this.store.select(selectRoleOptionTypes('organization-unit')).pipe(filterNullish());
  public readonly contractRoles$ = this.store.select(selectRoleOptionTypes('it-contract')).pipe(filterNullish());
  public readonly usageRoles$ = this.store.select(selectRoleOptionTypes('it-system-usage')).pipe(filterNullish());
  public readonly dprRoles$ = this.store.select(selectRoleOptionTypes('data-processing')).pipe(filterNullish());

  private readonly unitIsLoading$ = this.store.select(selectRoleOptionTypesLoading('organization-unit'));
  private readonly contractIsLoading$ = this.store.select(selectRoleOptionTypesLoading('it-contract'));
  private readonly usageIsLoading$ = this.store.select(selectRoleOptionTypesLoading('it-system-usage'));
  private readonly dprIsLoading$ = this.store.select(selectRoleOptionTypesLoading('data-processing'));

  // Combine all loading observables into one
  public readonly rolesIsLoading$ = combineLatest([
    this.unitIsLoading$,
    this.contractIsLoading$,
    this.usageIsLoading$,
    this.dprIsLoading$,
  ]).pipe(map(([unit, contract, usage, dpr]) => unit || contract || usage || dpr));

  public readonly unitRolesSubject$ = new BehaviorSubject<Right[]>([]);
  public readonly contractRolesSubject$ = new BehaviorSubject<Right[]>([]);
  public readonly usageRolesSubject$ = new BehaviorSubject<Right[]>([]);
  public readonly dprRolesSubject$ = new BehaviorSubject<Right[]>([]);

  constructor(
    private store: Store,
    private dialogOpenerService: DialogOpenerService,
    private dialogRef: MatDialogRef<UserInfoDialogComponent>,
    private actions$: Actions,
    private roleService: RoleOptionTypeService
  ) {
    super();
  }

  ngOnInit(): void {
    this.roleService.dispatchAllGetAvailableOptions();

    // Subscribe to user$ to ensure the subscription is kept alive
    this.subscriptions.add(this.user$.subscribe());

    this.subscriptions.add(
      this.actions$
        .pipe(ofType(OrganizationUserActions.sendNotificationSuccess))
        .subscribe(() => this.$sendingNotification.next(false))
    );

    this.subscriptions.add(
      this.user$.subscribe((user) => {
        this.unitRolesSubject$.next(user.OrganizationUnitRights ?? []);
        this.contractRolesSubject$.next(user.ItContractRights ?? []);
        this.usageRolesSubject$.next(user.ItSystemRights ?? []);
        this.dprRolesSubject$.next(user.DataProcessingRegistrationRights ?? []);
      })
    );
  }

  public onDeleteUser(): void {
    this.subscriptions.add(
      this.actions$.pipe(ofType(OrganizationUserActions.deleteUserSuccess)).subscribe(() => {
        this.dialogRef.close();
      })
    );

    this.dialogOpenerService.openDeleteUserDialog(this.user$, true);
  }

  public onEditUser(user: ODataOrganizationUser): void {
    this.dialogOpenerService.openEditUserDialog(user, true);
  }

  public onSendAdvis(user: ODataOrganizationUser): void {
    this.$sendingNotification.next(true);
    this.store.dispatch(OrganizationUserActions.sendNotification(user.Uuid));
  }

  public getFullName(user: ODataOrganizationUser): string {
    return `${user.FirstName} ${user.LastName}`;
  }
}
