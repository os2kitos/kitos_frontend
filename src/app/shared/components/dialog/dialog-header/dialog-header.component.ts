import { Component, Input } from '@angular/core';
import { DialogComponent } from '../dialog.component';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog-header',
  templateUrl: './dialog-header.component.html',
  styleUrl: './dialog-header.component.scss'
})
export class DialogHeaderComponent {
  @Input() public title?: string;
  @Input() public icon?: 'help';
  @Input() public dialog!: MatDialogRef<DialogComponent>;
  @Input() public closable = true;

  public close() {
    this.dialog.close();
  }
}
