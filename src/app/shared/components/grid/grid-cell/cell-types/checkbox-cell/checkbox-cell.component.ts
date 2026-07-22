
import { Component, EventEmitter, Output } from '@angular/core';
import { SearchPropertyPipe } from '../../../../../pipes/column-property.pipe';
import { CheckboxComponent } from '../../../../checkbox/checkbox.component';
import { TooltipComponent } from '../../../../tooltip/tooltip.component';
import { UsageProxyCheckboxComponent } from '../../../usage-proxy-checkbox/usage-proxy-checkbox.component';
import { BaseCellComponent } from '../../base-cell.component';

@Component({
  selector: 'app-checkbox-cell',
  templateUrl: './checkbox-cell.component.html',
  styleUrl: './checkbox-cell.component.scss',
  imports: [TooltipComponent, CheckboxComponent, UsageProxyCheckboxComponent, SearchPropertyPipe],
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

  public getUsageDisabledState(): boolean {
    if (this.createPermission === false) return true;

    const permissionsField = this.column.permissionsField ? this.getProperty(this.column.permissionsField) : false;
    const extraPermissionsField = this.column.extraPermissionsField
      ? this.getProperty(this.column.extraPermissionsField)
      : false;

    if (!permissionsField) return extraPermissionsField !== true;

    return false;
  }
}
