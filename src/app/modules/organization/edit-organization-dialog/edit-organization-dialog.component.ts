import { Component, Input } from '@angular/core';
import { ThemePalette } from '@angular/material/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { BaseComponent } from 'src/app/shared/base/base.component';
import { ConfirmationDialogComponent } from 'src/app/shared/components/dialogs/confirmation-dialog/confirmation-dialog.component';

@Component({
  selector: 'app-edit-organization-dialog',
  templateUrl: './edit-organization-dialog.component.html',
  styleUrl: './edit-organization-dialog.component.scss',
})
export class EditOrganizationDialogComponent extends BaseComponent {
  @Input() public unitName$!: Observable<string>;

  public readonly confirmColor: ThemePalette = 'primary';

  constructor(private readonly dialog: MatDialogRef<ConfirmationDialogComponent>) {
    super();
  }

  public SaveResult() {
    this.dialog.close(true);
  }

  public CancelResult() {
    this.dialog.close(false);
  }
}
