import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { BaseComponent } from 'src/app/shared/base/base.component';
import { UserService } from 'src/app/shared/services/user.service';
import { selectOrganizationUserIsCreateLoading } from 'src/app/store/organization/organization-user/selectors';
import { selectAvailableRoleDropdownValues, selectUserIsGlobalAdmin } from 'src/app/store/user-store/selectors';
import { CreateUserDialogComponentStore } from './create-user-dialog/create-user-dialog.component-store';

@Component({
  template: '',
  standalone: false,
})
export class BaseUserDialogComponent extends BaseComponent {
  public startPreferenceOptions = this.userService.getAvailableStartPreferenceOptions();
  public roleOptions$ = this.store.select(selectAvailableRoleDropdownValues);

  public readonly isGlobalAdmin$ = this.store.select(selectUserIsGlobalAdmin);

  public readonly isLoadingAlreadyExists$ = this.componentStore.isLoading$;
  public readonly alreadyExists$ = this.componentStore.alreadyExists$;
  public readonly isLoading$ = this.store.select(selectOrganizationUserIsCreateLoading);

  constructor(
    public store: Store,
    public componentStore: CreateUserDialogComponentStore,
    protected userService: UserService,
  ) {
    super();
  }
}
