import { Component, EventEmitter, Input, Output } from '@angular/core';
import { OrganizationUserDropdownComponentStore } from './organization-user-dropdown.component-store';
import { map } from 'rxjs';
import { OrganizationUserV2 } from '../../models/organization/organization-user/organization-user-v2.model';

@Component({
  selector: 'app-organization-user-dropdown',
  templateUrl: './organization-user-dropdown.component.html',
  styleUrl: './organization-user-dropdown.component.scss',
  providers: [OrganizationUserDropdownComponentStore],
})
export class OrganizationUserDropdownComponent {

  @Input() public text: string | undefined;
  @Input() public disabledUuids: string[] = [];

  public value: OrganizationUserV2 | undefined;

  @Output() public userChange = new EventEmitter<OrganizationUserV2 | undefined | null>();

  constructor(private componentStore: OrganizationUserDropdownComponentStore) {}

  public readonly users$ = this.componentStore.users$.pipe(
    map((users) => users.filter((user) => !this.disabledUuids.includes(user.uuid)))
  );
  public readonly usersIsLoading$ = this.componentStore.usersIsLoading$;

  public searchUsers(search?: string) {
    this.componentStore.searchUsersInOrganization(search);
  }

  public onUserChange(user: OrganizationUserV2 | undefined | null) {
    this.userChange.emit(user);
  }
}
