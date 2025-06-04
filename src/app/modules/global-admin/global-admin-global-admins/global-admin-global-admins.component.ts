import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CreateGlobalAdminDialogComponent } from './create-global-admin-dialog/create-global-admin-dialog.component';
import { CardComponent } from '../../../shared/components/card/card.component';
import { OverviewHeaderComponent } from '../../../shared/components/overview-header/overview-header.component';
import { ButtonComponent } from '../../../shared/components/buttons/button/button.component';
import { GlobalAdminsTableComponent } from './global-admins-table/global-admins-table.component';

@Component({
  selector: 'app-global-admin-global-admins',
  templateUrl: './global-admin-global-admins.component.html',
  styleUrl: './global-admin-global-admins.component.scss',
  imports: [CardComponent, OverviewHeaderComponent, ButtonComponent, GlobalAdminsTableComponent],
})
export class GlobalAdminGlobalAdminsComponent {
  constructor(private dialog: MatDialog) {}

  public addGlobalAdmin(): void {
    this.dialog.open(CreateGlobalAdminDialogComponent);
  }
}
