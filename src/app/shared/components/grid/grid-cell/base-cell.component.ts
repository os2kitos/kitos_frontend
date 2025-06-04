import { Component, Input } from '@angular/core';
import { BaseComponent } from 'src/app/shared/base/base.component';
import { GridColumn } from 'src/app/shared/models/grid-column.model';

@Component({
  template: '',
  standalone: false,
})
export class BaseCellComponent extends BaseComponent {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  @Input() dataItem!: any;
  @Input() column!: GridColumn;
  @Input() createPermission!: boolean;
  @Input() modifyPermission!: boolean;
  @Input() deletePermission!: boolean;

  //Pipes are not allowed in method calls, so we need to use a getter method
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getProperty(propertyName: string): any {
    return this.getPropertyFromObject(this.dataItem, propertyName);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getPropertyFromObject(object: any, propertyName: string): any {
    return object[propertyName];
  }
}
