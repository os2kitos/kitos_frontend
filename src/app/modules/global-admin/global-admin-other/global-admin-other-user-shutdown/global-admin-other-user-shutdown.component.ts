import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { APIUserReferenceResponseDTO } from 'src/app/api/v2';
import { BaseComponent } from 'src/app/shared/base/base.component';
import { ConfirmActionCategory, ConfirmActionService } from 'src/app/shared/services/confirm-action.service';
import { GlobalAdminOtherUserShutdownComponentStore } from './global-admin-other-user-shutdown.component-store';
import { CardComponent } from '../../../../shared/components/card/card.component';
import { CardHeaderComponent } from '../../../../shared/components/card-header/card-header.component';
import { StandardVerticalContentGridComponent } from '../../../../shared/components/standard-vertical-content-grid/standard-vertical-content-grid.component';
import { ConnectedDropdownComponent } from '../../../../shared/components/dropdowns/connected-dropdown/connected-dropdown.component';
import { ButtonComponent } from '../../../../shared/components/buttons/button/button.component';
import { NgIf, NgFor, AsyncPipe } from '@angular/common';
import { NativeTableComponent } from '../../../../shared/components/native-table/native-table.component';
import { ParagraphComponent } from '../../../../shared/components/paragraph/paragraph.component';

@Component({
  selector: 'app-global-admin-other-user-shutdown',
  templateUrl: './global-admin-other-user-shutdown.component.html',
  styleUrl: './global-admin-other-user-shutdown.component.scss',
  providers: [GlobalAdminOtherUserShutdownComponentStore],
  imports: [
    CardComponent,
    CardHeaderComponent,
    FormsModule,
    ReactiveFormsModule,
    StandardVerticalContentGridComponent,
    ConnectedDropdownComponent,
    ButtonComponent,
    NgIf,
    NativeTableComponent,
    NgFor,
    ParagraphComponent,
    AsyncPipe,
  ],
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
    private readonly confirmationService: ConfirmActionService,
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
      message: $localize`Er du sikker på at du vil fjerne denne bruger?`,
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
