import { Component, Input, OnInit } from '@angular/core';
import { Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { BehaviorSubject, first, map, Observable } from 'rxjs';
import { RoleSelectionBaseComponent } from 'src/app/shared/base/base-role-selection.component';
import { userHasAnyRights } from 'src/app/shared/helpers/user-role.helpers';
import { OrganizationUserV2 } from 'src/app/shared/models/organization/organization-user/organization-user-v2.model';
import { ODataOrganizationUser } from 'src/app/shared/models/organization/organization-user/organization-user.model';
import { RoleSelectionService } from 'src/app/shared/services/role-selector-service';
import { OrganizationUserActions } from 'src/app/store/organization/organization-user/actions';

@Component({
  selector: 'app-copy-roles-dialog',
  templateUrl: './copy-roles-dialog.component.html',
  styleUrl: './copy-roles-dialog.component.scss',
  providers: [RoleSelectionService],
})
export class CopyRolesDialogComponent extends RoleSelectionBaseComponent implements OnInit {
  @Input() user!: ODataOrganizationUser;

  constructor(private store: Store, selectionService: RoleSelectionService, actions$: Actions) {
    super(
      selectionService,
      actions$,
      ofType(OrganizationUserActions.copyRolesError, OrganizationUserActions.copyRolesSuccess)
    );
  }

  ngOnInit(): void {
    this.subscriptions.add(
      this.actions$.pipe(ofType(OrganizationUserActions.copyRolesSuccess)).subscribe(() => {
        this.selectionService.deselectAll();
        this.selectedUser$.next(undefined);
      })
    );
    this.disabledUuids = [this.user.Uuid];
  }

  public disabledUuids!: string[];

  public selectedUser$: BehaviorSubject<OrganizationUserV2 | undefined> = new BehaviorSubject<
    OrganizationUserV2 | undefined
  >(undefined);

  public selectedUserChanged(user: OrganizationUserV2 | undefined | null): void {
    this.selectedUser$.next(user ?? undefined);
  }

  public getSnackbarText(): string {
    return $localize`Vælg handling for valgte roller ${this.buttonNumberText()}`;
  }

  public onCopyRoles(): void {
    this.selectedUser$.pipe(first()).subscribe((selectedUser) => {
      if (!selectedUser) return;
      const request = this.getRequest(this.user);
      this.isLoading = true;
      this.store.dispatch(OrganizationUserActions.copyRoles(this.user.Uuid, selectedUser.uuid, request));
    });
  }

  public isUserSelected(): Observable<boolean> {
    return this.selectedUser$.pipe(map((user) => user !== undefined));
  }

  public userHasAnyRight(): boolean {
    return userHasAnyRights(this.user);
  }

  private buttonNumberText(): string {
    const noOfSelectedRights = this.getSelectedUserRights().length;
    return noOfSelectedRights > 0 ? `(${noOfSelectedRights})` : '';
  }
}
