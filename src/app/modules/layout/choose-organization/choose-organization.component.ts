import { Component, Input } from '@angular/core';
import { Store } from '@ngrx/store';
import { DialogRef } from '@progress/kendo-angular-dialog';
import { APIOrganizationResponseDTO } from 'src/app/api/v2';
import { selectOrganizations } from 'src/app/store/organization/selectors';
import { UserActions } from 'src/app/store/user-store/actions';

@Component({
  templateUrl: 'choose-organization.component.html',
  styleUrls: ['choose-organization.component.scss'],
})
export class ChooseOrganizationComponent {
  @Input() public closable = true;

  public readonly organizations$ = this.store.select(selectOrganizations);

  constructor(private dialog: DialogRef, private store: Store) {}

  public didChange(organization?: APIOrganizationResponseDTO) {
    if (organization === undefined) return;

    this.store.dispatch(UserActions.updateOrganization(organization));
    this.dialog.close();
  }
}
