import { NgIf } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { BaseCellComponent } from './base-cell.component';
import { ActionButtonsCellComponent } from './cell-types/action-buttons-cell/action-buttons-cell.component';
import { AuditCellComponent } from './cell-types/audit-cell/audit-cell.component';
import { BooleanCellComponent } from './cell-types/boolean-cell/boolean-cell.component';
import { CheckboxCellComponent } from './cell-types/checkbox-cell/checkbox-cell.component';
import { DateCellComponent } from './cell-types/date-cell/date-cell.component';
import { DefaultWrapCellComponent } from './cell-types/default-wrap-cell/default-wrap-cell.component';
import { EnumCellComponent } from './cell-types/enum-cell/enum-cell.component';
import { LinkCellComponent } from './cell-types/link-cell/link-cell.component';
import { PageLinkArrayCellComponent } from './cell-types/page-link-array-cell/page-link-array-cell.component';
import { PageLinkCellComponent } from './cell-types/page-link-cell/page-link-cell.component';
import { PrimaryCellComponent } from './cell-types/primary-cell/primary-cell.component';
import { StatusCellComponent } from './cell-types/status-cell/status-cell.component';
import { TextCellComponent } from './cell-types/text-cell/text-cell.component';
import { ThousandSeperatorCellComponent } from './cell-types/thousand-seperator-cell/thousand-seperator-cell.component';
import { TitleLinkCellComponent } from './cell-types/title-link-cell/title-link-cell.component';
import { UsagesCellComponent } from './cell-types/usages-cell/usages-cell.component';
import { UuidToNameCellComponent } from './cell-types/uuid-to-name-cell/uuid-to-name-cell.component';

@Component({
  selector: 'app-grid-cell',
  templateUrl: './grid-cell.component.html',
  styleUrl: './grid-cell.component.scss',
  imports: [
    NgIf,
    TextCellComponent,
    StatusCellComponent,
    ThousandSeperatorCellComponent,
    DefaultWrapCellComponent,
    PrimaryCellComponent,
    BooleanCellComponent,
    DateCellComponent,
    EnumCellComponent,
    LinkCellComponent,
    TitleLinkCellComponent,
    PageLinkCellComponent,
    CheckboxCellComponent,
    UsagesCellComponent,
    PageLinkArrayCellComponent,
    UuidToNameCellComponent,
    AuditCellComponent,
    ActionButtonsCellComponent,
  ],
})
export class GridCellComponent extends BaseCellComponent {
  @Output() public checkboxChange = new EventEmitter<boolean>();
  @Output() public toggleEvent = new EventEmitter<boolean>();
  @Output() public modifyEvent = new EventEmitter<void>();
  @Output() public deleteEvent = new EventEmitter<void>();

  public onCheckboxChange(value: boolean): void {
    this.checkboxChange.emit(value);
  }

  public onModifyEvent(): void {
    this.modifyEvent.emit();
  }

  public onDeleteEvent(): void {
    this.deleteEvent.emit();
  }

  public onToggleEvent(value: boolean): void {
    this.toggleEvent.emit(value);
  }
}
