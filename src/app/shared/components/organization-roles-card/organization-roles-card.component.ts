import { Component, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { first, Observable } from 'rxjs';
import { AddOrganizationRoleDialogComponent } from '../add-organization-role-dialog/add-organization-role-dialog.component';

@Component({
  selector: 'app-organization-roles-card',
  templateUrl: './organization-roles-card.component.html',
  styleUrl: './organization-roles-card.component.scss',
})
export class OrganizationRolesCardComponent {
  @Input() public currentUnitUuid$!: Observable<string>;
  @Input() public unitName$!: Observable<string>;

  constructor(private store: Store, private matDialog: MatDialog) {}

  //public readonly hasModifcationPermission$ = this.store.select();

  public onNewRoleClick(): void {
    this.unitName$.pipe(first()).subscribe((unitName) => {
      this.matDialog.open(AddOrganizationRoleDialogComponent, {
        data: {
          unitName,
        },
      });
    });
  }

  public onEditClick(): void {}
}
