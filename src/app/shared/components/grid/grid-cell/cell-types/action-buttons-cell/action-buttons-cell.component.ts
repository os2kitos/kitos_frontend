import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ActionButtonsCellDeleteIcon } from 'src/app/shared/models/icons/action-buttons-cell-delete-icons';
import { IconButtonComponent } from '../../../../buttons/icon-button/icon-button.component';
import { CheckIconComponent } from '../../../../icons/check-icon.component';
import { PencilIconComponent } from '../../../../icons/pencil-icon.compnent';
import { TrashcanIconComponent } from '../../../../icons/trashcan-icon.component';
import { ToggleButtonComponent } from '../../../../local-grid/toggle-button/toggle-button.component';
import { BaseCellComponent } from '../../base-cell.component';

@Component({
  selector: 'app-action-buttons-cell',
  templateUrl: './action-buttons-cell.component.html',
  styleUrl: './action-buttons-cell.component.scss',
  imports: [IconButtonComponent, PencilIconComponent, TrashcanIconComponent, CheckIconComponent, ToggleButtonComponent],
})
export class ActionButtonsCellComponent extends BaseCellComponent {
  @Input() public deleteIcon: ActionButtonsCellDeleteIcon = 'trashcan';
  @Output() public modifyEvent = new EventEmitter<void>();
  @Output() public deleteEvent = new EventEmitter<void>();
  @Output() public toggleEvent = new EventEmitter<boolean>();

  public onModifyClick(): void {
    this.modifyEvent.emit();
  }

  public onDeleteClick(): void {
    this.deleteEvent.emit();
  }

  public onToggleChange(event: boolean): void {
    this.toggleEvent.emit(event);
  }
}
