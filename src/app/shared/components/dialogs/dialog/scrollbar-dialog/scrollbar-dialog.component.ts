import { Component, Input } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { DialogComponent } from '../dialog.component';

@Component({
  selector: 'app-scrollbar-dialog',
  templateUrl: './scrollbar-dialog.component.html',
  styleUrl: './scrollbar-dialog.component.scss',
})
export class ScrollbarDialogComponent {
  @Input() public title?: string;
  @Input() public icon?: 'help';
  @Input() public loading = false;
  @Input() public closable = true;
  @Input() public overflow: 'auto' | 'none' = 'auto';
  @Input() public nested: boolean = false;
  @Input() public backgroundColor: 'white' | 'grey' = 'white';
  @Input() public helpText?: string;

  constructor(protected dialog: MatDialogRef<DialogComponent>) {}

  public close() {
    this.dialog.close();
  }
}
