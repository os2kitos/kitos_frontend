import { Component, EventEmitter, Output } from '@angular/core';
import { BaseCellComponent } from '../../base-cell.component';
import { NgIf } from '@angular/common';
import { TooltipComponent } from '../../../../tooltip/tooltip.component';
import { CheckboxComponent } from '../../../../checkbox/checkbox.component';
import { UsageProxyCheckboxComponent } from '../../../usage-proxy-checkbox/usage-proxy-checkbox.component';
import { SearchPropertyPipe } from '../../../../../pipes/column-property.pipe';

@Component({
  selector: 'app-checkbox-cell',
  templateUrl: './checkbox-cell.component.html',
  styleUrl: './checkbox-cell.component.scss',
  imports: [NgIf, TooltipComponent, CheckboxComponent, UsageProxyCheckboxComponent, SearchPropertyPipe],
})
export class CheckboxCellComponent extends BaseCellComponent {
  @Output() public checkboxChange = new EventEmitter<boolean>();

  public onCheckboxChange(value: boolean | undefined): void {
    if (value === undefined) return;
    this.checkboxChange.emit(value);
  }

  public getTooltipText(): string {
    return this.column.tooltipFn ? this.column.tooltipFn(this.dataItem) : '';
  }
}
