import { Component, EventEmitter, Input, Output } from '@angular/core';
import { DropDownFilterSettings } from '@progress/kendo-angular-dropdowns';

@Component({
  selector: 'app-dropdown',
  templateUrl: 'dropdown.component.html',
  styleUrls: ['dropdown.component.scss'],
})
export class DropdownComponent<T> {
  @Input() public text = '';
  @Input() public data!: T[] | null;
  @Input() public textField!: string;
  @Input() public valueField!: string;
  @Input() public loading = false;
  @Input() public disabled = false;
  @Input() public size: 'small' | 'large' = 'large';

  @Input() public value?: T | null;
  @Output() public valueChange = new EventEmitter<T | undefined>();

  public readonly filterSettings: DropDownFilterSettings = {
    caseSensitive: false,
    operator: 'contains',
  };
}
