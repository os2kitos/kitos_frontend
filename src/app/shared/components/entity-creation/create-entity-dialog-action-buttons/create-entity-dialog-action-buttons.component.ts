import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-create-entity-dialog-action-buttons',
  templateUrl: './create-entity-dialog-action-buttons.component.html',
  styleUrl: './create-entity-dialog-action-buttons.component.scss',
})
export class CreateEntityDialogActionButtonsComponent {
  @Input() public alreadyExists!: boolean | null;
  @Input() public isFormValid!: boolean;
  @Input() public isLoading!: boolean | null;

  @Output() public create = new EventEmitter<boolean>();
  @Output() public cancel = new EventEmitter<boolean>();
}
