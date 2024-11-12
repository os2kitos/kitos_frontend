import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { APIUserReferenceResponseDTO } from 'src/app/api/v2';
import { BaseComponent } from 'src/app/shared/base/base.component';
import { ConfirmActionCategory, ConfirmActionService } from 'src/app/shared/services/confirm-action.service';
import { GlobalAdminOtherUserShutdownComponentStore } from './global-admin-other-user-shutdown.component-store';

@Component({
  selector: 'app-global-admin-other-user-shutdown',
  templateUrl: './global-admin-other-user-shutdown.component.html',
  styleUrl: './global-admin-other-user-shutdown.component.scss',
  providers: [GlobalAdminOtherUserShutdownComponentStore],
})
export class GlobalAdminOtherUserShutdownComponent extends BaseComponent {
  public readonly isLoading$ = this.componentStore.isLoading$;
  public readonly users$ = this.componentStore.users$;
  public readonly userOrganizations$ = this.componentStore.userOrganizations$;

  public formGroup = new FormGroup({
    user: new FormControl<APIUserReferenceResponseDTO | undefined>(undefined, [Validators.required]),
  });

  constructor(
    private readonly componentStore: GlobalAdminOtherUserShutdownComponentStore,
    private readonly confirmationService: ConfirmActionService
  ) {
    super();
  }

  public searchUsers(search?: string) {
    this.componentStore.searchUsers(search);
  }

  public getUserOrganizations(userUuid?: string) {
    if (!userUuid) {
      this.resetShutdown();
      return;
    }
    this.componentStore.getUserOrganizations(userUuid);
  }

  public deleteUser() {
    const user = this.formGroup.value.user;
    if (!user) {
      return;
    }
    this.confirmationService.confirmAction({
      category: ConfirmActionCategory.Warning,
      message: 'Are you sure you want to delete this user?',
      onConfirm: () => {
        this.componentStore.deleteUser(user.uuid);
        this.resetShutdown();
      },
    });
  }

  private resetShutdown() {
    this.formGroup.reset();
    this.componentStore.resetUserOrganizations();
  }
}
