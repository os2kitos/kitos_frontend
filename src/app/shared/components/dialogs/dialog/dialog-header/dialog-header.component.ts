import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { ButtonComponent } from '../../../buttons/button/button.component';
import { HelpButtonComponent } from '../../../help-button/help-button.component';
import { ArrowLeftIconComponent } from '../../../icons/arrow-left-icon.component';
import { XIconComponent } from '../../../icons/x-icon.component';
import { DialogComponent } from '../dialog.component';

@Component({
  selector: 'app-dialog-header',
  templateUrl: './dialog-header.component.html',
  styleUrl: './dialog-header.component.scss',
  imports: [CommonModule, ButtonComponent, ArrowLeftIconComponent, HelpButtonComponent, XIconComponent],
})
export class DialogHeaderComponent {
  @Input() public title?: string;
  @Input() public url?: string;
  @Input() public dialog!: MatDialogRef<DialogComponent>;
  @Input() public closable = true;
  @Input() public helpText?: string;
  @Input() public nested = false;

  public close() {
    this.dialog.close();
  }
}
