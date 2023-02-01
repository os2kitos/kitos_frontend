import { Component, Input } from '@angular/core';
import { Store } from '@ngrx/store';
import { DialogRef } from '@progress/kendo-angular-dialog';
import { APIOrganizationResponseDTO } from 'src/app/api/v2';
import { adaptOrganization } from 'src/app/shared/models/organization.model';
import { OrganizationService } from 'src/app/store/organization/organization.service';
import { UserActions } from 'src/app/store/user-store/actions';

@Component({
  templateUrl: 'choose-organization.component.html',
  styleUrls: ['choose-organization.component.scss'],
})
export class ChooseOrganizationComponent {
  @Input() public enableClose = true;

  public organizations$ = this.organizationService.entities$;
  public organizationsLoading$ = this.organizationService.loading$;

  constructor(private dialog: DialogRef, private store: Store, private organizationService: OrganizationService) {}

  public didChange(organization: APIOrganizationResponseDTO) {
    this.store.dispatch(UserActions.updateOrganization(adaptOrganization(organization)));
    this.dialog.close();
  }

  public close() {
    this.dialog.close();
  }
}
