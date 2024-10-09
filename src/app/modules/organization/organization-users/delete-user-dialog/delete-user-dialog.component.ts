import { Component, Input } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { userHasAnyRights } from 'src/app/shared/helpers/user-role.helpers';
import { OrganizationUser } from 'src/app/shared/models/organization/organization-user/organization-user.model';
import { RoleSelectionService } from 'src/app/shared/services/role-selector-service';
import { selectOrganizationName } from 'src/app/store/user-store/selectors';

@Component({
  selector: 'app-delete-user-dialog',
  templateUrl: './delete-user-dialog.component.html',
  styleUrl: './delete-user-dialog.component.scss',
  providers: [RoleSelectionService]
})
export class DeleteUserDialogComponent {
  @Input() user!: OrganizationUser;
  @Input() nested: boolean = false;

  constructor(private store: Store, private selectionService: RoleSelectionService) {}

  public readonly organizationName$: Observable<string | undefined> = this.store.select(selectOrganizationName);

  public hasRoles(): boolean {
    return userHasAnyRights(this.user); //TODO, use this method in copy roles dialog also
  }

  public onDeleteUser(): void {
    //TODO
  }

  public onTransferRoles(): void {
    //TODO
  }

  public getUserName(): string {
    return `${this.user.FirstName} ${this.user.LastName}`;
  }
}
