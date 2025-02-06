import { Component, Input } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { DialogComponent } from '../dialog.component';

@Component({
  selector: 'app-dialog-header',
  templateUrl: './dialog-header.component.html',
  styleUrl: './dialog-header.component.scss',
})
export class DialogHeaderComponent {
  @Input() public title?: string;
  @Input() public dialog!: MatDialogRef<DialogComponent>;
  @Input() public closable = true;
  @Input() public helpText?: string;
  @Input() public nested = false;

  public close() {
    this.dialog.close();
  }
}
