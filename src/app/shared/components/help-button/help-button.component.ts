import { Component, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { HelpDialogComponent } from '../help-dialog/help-dialog.component';
import { ButtonComponent } from '../buttons/button/button.component';
import { HelpIconComponent } from '../icons/help.component';

@Component({
  selector: 'app-help-button',
  templateUrl: 'help-button.component.html',
  styleUrls: ['help-button.component.scss'],
  imports: [ButtonComponent, HelpIconComponent],
})
export class HelpButtonComponent {
  @Input() public helpTextKey?: string;

  constructor(private dialog: MatDialog) {}

  public openHelpTextDialog() {
    const dialogRef = this.dialog.open(HelpDialogComponent, { maxHeight: '90vh', height: 'auto' });
    (dialogRef.componentInstance as HelpDialogComponent).helpTextKey = this.helpTextKey;
  }
}
