import { Component, EventEmitter, Input, Output } from '@angular/core';
import { StandardVerticalContentGridComponent } from '../../standard-vertical-content-grid/standard-vertical-content-grid.component';
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';
import { DialogComponent } from '../dialog/dialog.component';

import { ButtonComponent } from '../../buttons/button/button.component';
import { NotInUseIconComponent } from '../../icons/not-in-use-icon.component';
import { TakeIntoUseIconComponent } from '../../icons/take-into-use-icon.component';
import { ParagraphComponent } from '../../paragraph/paragraph.component';
import { DialogActionsComponent } from '../dialog-actions/dialog-actions.component';

@Component({
  selector: 'app-icon-confirmation-dialog',
  templateUrl: './icon-confirmation-dialog.component.html',
  styleUrl: './icon-confirmation-dialog.component.scss',
  imports: [
    DialogComponent,
    StandardVerticalContentGridComponent,
    TakeIntoUseIconComponent,
    NotInUseIconComponent,
    ParagraphComponent,
    DialogActionsComponent,
    ButtonComponent,
  ],
})
export class IconConfirmationDialogComponent extends ConfirmationDialogComponent {
  @Input() icon: 'not-in-use' | 'take-into-use' = 'not-in-use';
  @Input() hasExtraAction: boolean = false;
  @Input() extraActionText: string = '';
  @Output() extraActionClick = new EventEmitter<void>();

  public extraActionResult() {
    if (this.hasExtraAction) {
      this.extraActionClick.emit();
    }
  }
}
