import { Component, EventEmitter, Input, Output } from '@angular/core';
import { DialogActionsComponent } from '../../dialogs/dialog-actions/dialog-actions.component';
import { ButtonComponent } from '../../buttons/button/button.component';

@Component({
  selector: 'app-create-entity-dialog-action-buttons',
  templateUrl: './create-entity-dialog-action-buttons.component.html',
  styleUrl: './create-entity-dialog-action-buttons.component.scss',
  imports: [DialogActionsComponent, ButtonComponent],
})
export class CreateEntityDialogActionButtonsComponent {
  @Input() public alreadyExists!: boolean | null;
  @Input() public isFormValid!: boolean;

  @Output() public createEvent = new EventEmitter<boolean>();
  @Output() public cancelEvent = new EventEmitter<boolean>();
}
