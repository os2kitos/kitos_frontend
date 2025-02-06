import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CreateGlobalAdminDialogComponent } from './create-global-admin-dialog/create-global-admin-dialog.component';

@Component({
  selector: 'app-global-admin-global-admins',
  templateUrl: './global-admin-global-admins.component.html',
  styleUrl: './global-admin-global-admins.component.scss',
})
export class GlobalAdminGlobalAdminsComponent {
  constructor(private dialog: MatDialog) {}

  public addGlobalAdmin(): void {
    this.dialog.open(CreateGlobalAdminDialogComponent);
  }
}
