/* eslint-disable @typescript-eslint/no-explicit-any */
import { AsyncPipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { combineLatest, filter, first, map, Observable } from 'rxjs';
import { BaseComponent } from 'src/app/shared/base/base.component';
import {
  BulkActionButton,
  BulkActionDialogComponent,
  BulkActionResult,
} from 'src/app/shared/components/dialogs/bulk-action-dialog/bulk-action-dialog.component';
import { getUserRoleSelectionDialogSections } from 'src/app/shared/helpers/bulk-action.helpers';
import { getRoleActionRequest, userHasAnyAvailableRights } from 'src/app/shared/helpers/user-role.helpers';
import {
  ODataOrganizationUser,
  Right,
} from 'src/app/shared/models/organization/organization-user/organization-user.model';
import { ConfirmActionCategory, ConfirmActionService } from 'src/app/shared/services/confirm-action.service';
import { DialogOpenerService } from 'src/app/shared/services/dialog-opener.service';
import { RoleOptionTypeService } from 'src/app/shared/services/role-option-type.service';
import { RoleSelectionService } from 'src/app/shared/services/role-selector-service';
import { OrganizationUserActions } from 'src/app/store/organization/organization-user/actions';
import { selectRoleOptionTypes } from 'src/app/store/roles-option-type-store/selectors';
import { selectOrganizationName } from 'src/app/store/user-store/selectors';
import { ButtonComponent } from '../../../../shared/components/buttons/button/button.component';
import { DialogActionsComponent } from '../../../../shared/components/dialogs/dialog-actions/dialog-actions.component';
import { DialogComponent } from '../../../../shared/components/dialogs/dialog/dialog.component';
import { LoadingComponent } from '../../../../shared/components/loading/loading.component';
import { ParagraphComponent } from '../../../../shared/components/paragraph/paragraph.component';
import { StandardVerticalContentGridComponent } from '../../../../shared/components/standard-vertical-content-grid/standard-vertical-content-grid.component';

@Component({
  selector: 'app-delete-user-dialog',
  templateUrl: './delete-user-dialog.component.html',
  styleUrl: './delete-user-dialog.component.scss',
  providers: [RoleSelectionService],
  imports: [
    DialogComponent,
    StandardVerticalContentGridComponent,
    ParagraphComponent,
    DialogActionsComponent,
    ButtonComponent,
    LoadingComponent,
    AsyncPipe
],
})
export class DeleteUserDialogComponent extends BaseComponent implements OnInit {
  @Input() user$!: Observable<ODataOrganizationUser>;
  @Input() nested: boolean = false;

  public readonly organizationName$: Observable<string | undefined> = this.store.select(selectOrganizationName);
  private readonly availableUnitRoles$ = this.store.select(selectRoleOptionTypes('organization-unit'));
  private readonly availableContractRoles$ = this.store.select(selectRoleOptionTypes('it-contract'));
  private readonly availableUsageRoles$ = this.store.select(selectRoleOptionTypes('it-system-usage'));
  private readonly availableDprRoles$ = this.store.select(selectRoleOptionTypes('data-processing'));

  public hasRoles$!: Observable<boolean>;

  public isLoading: boolean = false;

  constructor(
    private store: Store,
    private confirmActionService: ConfirmActionService,
    private dialogRef: MatDialogRef<DeleteUserDialogComponent>,
    private openerService: DialogOpenerService,
    private actions$: Actions,
    private roleService: RoleOptionTypeService
  ) {
    super();
  }

  ngOnInit(): void {
    this.hasRoles$ = combineLatest([
      this.user$,
      this.availableUnitRoles$,
      this.availableUsageRoles$,
      this.availableContractRoles$,
      this.availableDprRoles$,
    ]).pipe(
      map(([user, unitRoles, usageRoles, contractRoles, dprRoles]) =>
        userHasAnyAvailableRights(user, unitRoles, usageRoles, contractRoles, dprRoles)
      )
    );

    this.roleService.dispatchAllGetAvailableOptions();

    // Probably can be fixed with a better solution
    // Subscription is needed to keep the user$ observable alive
    // Otherwise the transfer dialog is flaky
    // https://os2web.atlassian.net/browse/KITOSUDV-5956
    this.subscriptions.add(this.user$.subscribe());

    this.subscriptions.add(
      this.actions$.pipe(ofType(OrganizationUserActions.deleteUserError)).subscribe(() => {
        this.isLoading = false;
      })
    );
    this.subscriptions.add(
      this.actions$.pipe(ofType(OrganizationUserActions.deleteUserSuccess)).subscribe(() => {
        this.onClose();
      })
    );
  }

  public onDeleteUser(user: ODataOrganizationUser): void {
    this.confirmActionService.confirmAction({
      category: ConfirmActionCategory.Warning,
      onConfirm: () => this.deleteUser(user),
      message: $localize`Er du sikker på, at du vil slette brugeren '${this.getUserName(user)}'?`,
    });
  }

  private deleteUser(user: ODataOrganizationUser): void {
    this.isLoading = true;
    this.store.dispatch(OrganizationUserActions.deleteUser(user.Uuid));
  }

  public onClose(): void {
    this.dialogRef.close();
  }

  public getUserName(user: ODataOrganizationUser): string {
    return `${user.FirstName} ${user.LastName}`;
  }

  public openTransferDialog(user: ODataOrganizationUser): void {
    const dialogRef = this.openerService.openUserRoleSelectionDialog(user);

    const dialogActions = [
      {
        text: $localize`Overfør roller`,
        color: 'secondary',
        buttonStyle: 'secondary',
        callback: (result) => this.transferRoles(result, user, dialogRef),
      },
    ] as BulkActionButton[];

    const instance = dialogRef.componentInstance;
    instance.title = $localize`Overfør roller`;
    instance.dropdownTitle = $localize`Overfør roller til`;
    instance.successActionTypes = OrganizationUserActions.transferRolesSuccess;
    instance.errorActionTypes = OrganizationUserActions.transferRolesError;
    instance.actionButtons = dialogActions;
    instance.sections = getUserRoleSelectionDialogSections(
      this.user$,
      this.availableUnitRoles$,
      this.availableContractRoles$,
      this.availableUsageRoles$,
      this.availableDprRoles$
    );
  }

  private transferRoles(
    result: BulkActionResult,
    user: ODataOrganizationUser,
    dialogRef: MatDialogRef<BulkActionDialogComponent<any>, any>
  ): void {
    const request = getRoleActionRequest(result, user);

    if (!result.selectedEntityId) {
      throw new Error('Selected entity ID is undefined');
    }
    this.store.dispatch(OrganizationUserActions.transferRoles(user.Uuid, result.selectedEntityId, request));

    this.closeDialogIfNoRightsLeftAfterTransfer(dialogRef);
  }

  private closeDialogIfNoRightsLeftAfterTransfer(dialogRef: MatDialogRef<BulkActionDialogComponent<any>, any>) {
    const organizationUnitRights$ = this.user$.pipe(map((user) => user.OrganizationUnitRights));
    const itContractRights$ = this.user$.pipe(map((user) => user.ItContractRights));
    const itSystemRights$ = this.user$.pipe(map((user) => user.ItSystemRights));
    const dprRights$ = this.user$.pipe(map((user) => user.DataProcessingRegistrationRights));

    this.subscriptions.add(
      combineLatest([organizationUnitRights$, itSystemRights$, itContractRights$, dprRights$])
        .pipe(
          filter(([unitRights, systemRights, contractRights, dprRights]) =>
            this.areAnyRightsLeft(unitRights, systemRights, contractRights, dprRights)
          ),
          first()
        )
        .subscribe(() => dialogRef.close())
    );
  }

  private areAnyRightsLeft(
    unitRights: Right[],
    systemRights: Right[],
    contractRights: Right[],
    dprRights: Right[]
  ): boolean {
    return unitRights.length < 1 && systemRights.length < 1 && contractRights.length < 1 && dprRights.length < 1;
  }
}
