import { Component, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { HelpDialogComponent } from '../help-dialog/help-dialog.component';

@Component({
  selector: 'app-help-button',
  templateUrl: 'help-button.component.html',
  styleUrls: ['help-button.component.scss'],
})
export class HelpButtonComponent {
  @Input() public helpTextKey?: string;

  constructor(private dialog: MatDialog) {}

  public openHelpTextDialog() {
    const dialogRef = this.dialog.open(HelpDialogComponent);
    (dialogRef.componentInstance as HelpDialogComponent).helpTextKey = this.helpTextKey;
  }
}
