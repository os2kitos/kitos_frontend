import { Component, EventEmitter, Output } from '@angular/core';
import { BaseCellComponent } from '../../base-cell.component';
import { NgFor, NgIf } from '@angular/common';
import { IconButtonComponent } from '../../../../buttons/icon-button/icon-button.component';
import { PencilIconComponent } from '../../../../icons/pencil-icon.compnent';
import { TrashcanIconComponent } from '../../../../icons/trashcan-icon.component';
import { ToggleButtonComponent } from '../../../../local-grid/toggle-button/toggle-button.component';

@Component({
  selector: 'app-action-buttons-cell',
  templateUrl: './action-buttons-cell.component.html',
  styleUrl: './action-buttons-cell.component.scss',
  imports: [NgFor, NgIf, IconButtonComponent, PencilIconComponent, TrashcanIconComponent, ToggleButtonComponent],
})
export class ActionButtonsCellComponent extends BaseCellComponent {
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
