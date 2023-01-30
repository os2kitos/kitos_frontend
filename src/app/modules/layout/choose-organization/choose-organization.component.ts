import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { DialogRef } from '@progress/kendo-angular-dialog';
import { APIOrganizationResponseDTO } from 'src/app/api/v2';
import { adaptOrganization } from 'src/app/shared/models/organization.model';
import { UserActions } from 'src/app/store/user-store/actions';
import { ChooseOrganizationComponentStore } from './choose-organization.component-store';

@Component({
  templateUrl: 'choose-organization.component.html',
  styleUrls: ['choose-organization.component.scss'],
})
export class ChooseOrganizationComponent implements OnInit {
  public organizations$ = this.chooseOrganizationComponentStore.organizations$;
  public organizationsLoading$ = this.chooseOrganizationComponentStore.loading$;

  constructor(
    private dialog: DialogRef,
    private store: Store,
    private chooseOrganizationComponentStore: ChooseOrganizationComponentStore
  ) {}

  ngOnInit(): void {
    this.chooseOrganizationComponentStore.getOrganizations();
  }

  public didChange(organization: APIOrganizationResponseDTO) {
    this.store.dispatch(UserActions.updateOrganization(adaptOrganization(organization)));
    this.dialog.close();
  }
}
