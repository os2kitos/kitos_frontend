import { Component, Input } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { OrganizationUser } from 'src/app/shared/models/organization-user/organization-user.model';
import { RoleSelectionService } from 'src/app/shared/services/role-selector-service';
import { selectAll } from 'src/app/store/organization-user/selectors';

@Component({
  selector: 'app-copy-roles-dialog',
  templateUrl: './copy-roles-dialog.component.html',
  styleUrl: './copy-roles-dialog.component.scss',
  providers: [RoleSelectionService],
})
export class CopyRolesDialogComponent {
  @Input() user!: OrganizationUser;

  constructor(private store: Store, private selectionService: RoleSelectionService) {}

  public users: Observable<OrganizationUser[]> = this.store.select(selectAll);
  public selectedUser: OrganizationUser | undefined = undefined;

  public selectedUserChanged(user: OrganizationUser): void {
    this.selectedUser = user;
  }

  public onCopyRoles(): void {}
}
