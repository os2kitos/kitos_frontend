import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { RoleSelectionBaseComponent } from 'src/app/shared/base/base-role-selection.component';
import { userHasAnyRights } from 'src/app/shared/helpers/user-role.helpers';
import { ODataOrganizationUser } from 'src/app/shared/models/organization/organization-user/organization-user.model';
import { ShallowUser } from 'src/app/shared/models/userV2.model';
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

  public formGroup = new FormGroup({
    user: new FormControl<ShallowUser | undefined>(undefined, Validators.required),
  });

  public disabledUuids$!: Observable<string[]>;

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
        this.formGroup.reset();
      })
    );
    this.disabledUuids$ = of([this.user.Uuid]);
  }

  public getSnackbarText(): string {
    return $localize`Vælg handling for valgte roller ${this.buttonNumberText()}`;
  }

  public onCopyRoles(): void {
    const selectedUserUuid = this.formGroup.value.user?.uuid;
    if (!selectedUserUuid) throw new Error('No user selected');
    const request = this.getRequest(this.user);
    this.isLoading = true;
    this.store.dispatch(OrganizationUserActions.copyRoles(this.user.Uuid, selectedUserUuid, request));
  }

  public userHasAnyRight(): boolean {
    return userHasAnyRights(this.user);
  }

  private buttonNumberText(): string {
    const noOfSelectedRights = this.getSelectedUserRights().length;
    return noOfSelectedRights > 0 ? `(${noOfSelectedRights})` : '';
  }
}
