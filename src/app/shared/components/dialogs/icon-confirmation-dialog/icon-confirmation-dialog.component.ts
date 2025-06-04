import { Component, Input } from '@angular/core';
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';
import { DialogComponent } from '../dialog/dialog.component';
import { StandardVerticalContentGridComponent } from '../../standard-vertical-content-grid/standard-vertical-content-grid.component';
import { NgIf } from '@angular/common';
import { TakeIntoUseIconComponent } from '../../icons/take-into-use-icon.component';
import { NotInUseIconComponent } from '../../icons/not-in-use-icon.component';
import { ParagraphComponent } from '../../paragraph/paragraph.component';
import { DialogActionsComponent } from '../dialog-actions/dialog-actions.component';
import { ButtonComponent } from '../../buttons/button/button.component';

@Component({
  selector: 'app-icon-confirmation-dialog',
  templateUrl: './icon-confirmation-dialog.component.html',
  styleUrl: './icon-confirmation-dialog.component.scss',
  imports: [
    DialogComponent,
    StandardVerticalContentGridComponent,
    NgIf,
    TakeIntoUseIconComponent,
    NotInUseIconComponent,
    ParagraphComponent,
    DialogActionsComponent,
    ButtonComponent,
  ],
})
export class IconConfirmationDialogComponent extends ConfirmationDialogComponent {
  @Input() icon: 'not-in-use' | 'take-into-use' = 'not-in-use';
}
