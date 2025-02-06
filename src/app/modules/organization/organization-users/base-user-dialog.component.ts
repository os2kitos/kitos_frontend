import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { BaseComponent } from 'src/app/shared/base/base.component';
import { userRoleChoiceOptions } from 'src/app/shared/models/organization/organization-user/user-role.model';
import { selectOrganizationUserIsCreateLoading } from 'src/app/store/organization/organization-user/selectors';
import { selectUserIsGlobalAdmin } from 'src/app/store/user-store/selectors';
import { CreateUserDialogComponentStore } from './create-user-dialog/create-user-dialog.component-store';
import { UserService } from 'src/app/shared/services/user.service';

@Component({
  template: '',
})
export class BaseUserDialogComponent extends BaseComponent {
  public startPreferenceOptions = this.userService.getAvailableStartPreferenceOptions();
  public roleOptions = userRoleChoiceOptions;

  public readonly isGlobalAdmin$ = this.store.select(selectUserIsGlobalAdmin);

  public readonly isLoadingAlreadyExists$ = this.componentStore.isLoading$;
  public readonly alreadyExists$ = this.componentStore.alreadyExists$;
  public readonly isLoading$ = this.store.select(selectOrganizationUserIsCreateLoading);

  constructor(public store: Store, public componentStore: CreateUserDialogComponentStore, protected userService: UserService) {
    super();
  }
}
