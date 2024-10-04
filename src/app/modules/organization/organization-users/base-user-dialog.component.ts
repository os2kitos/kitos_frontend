import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { BaseComponent } from 'src/app/shared/base/base.component';
import { startPreferenceChoiceOptions } from 'src/app/shared/models/organization/organization-user/start-preference.model';
import { userRoleChoiceOptions } from 'src/app/shared/models/organization/organization-user/user-role.model';
import { selectOrganizationUserIsCreateLoading } from 'src/app/store/organization/organization-user/selectors';
import { selectUserIsGlobalAdmin } from 'src/app/store/user-store/selectors';
import { CreateUserDialogComponentStore } from './create-user-dialog/create-user-dialog.component-store';

@Component({
  template: '',
  providers: [CreateUserDialogComponentStore],
})
export class BaseUserDialogComponent extends BaseComponent {
  public startPreferenceOptions = startPreferenceChoiceOptions;
  public roleOptions = userRoleChoiceOptions;

  public readonly isGlobalAdmin$ = this.store.select(selectUserIsGlobalAdmin);

  public readonly isLoadingAlreadyExists$ = this.componentStore.isLoading$;
  public readonly alreadyExists$ = this.componentStore.alreadyExists$;
  public readonly isLoading$ = this.store.select(selectOrganizationUserIsCreateLoading);

  constructor(public store: Store, public componentStore: CreateUserDialogComponentStore) {
    super();
  }
}
