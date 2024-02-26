import { Component, Input } from '@angular/core';
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';

@Component({
  selector: 'app-icon-confirmation-dialog',
  templateUrl: './icon-confirmation-dialog.component.html',
  styleUrl: './icon-confirmation-dialog.component.scss',
})
export class IconConfirmationDialogComponent extends ConfirmationDialogComponent {
  @Input() icon: 'not-in-use' | 'take-into-use' = 'not-in-use';
}
