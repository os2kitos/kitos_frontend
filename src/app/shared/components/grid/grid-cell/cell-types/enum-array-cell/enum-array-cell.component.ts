import { Component } from '@angular/core';
import { ParagraphComponent } from '../../../../paragraph/paragraph.component';
import { BaseCellComponent } from '../../base-cell.component';

@Component({
  selector: 'app-enum-array-cell',
  imports: [ParagraphComponent],
  templateUrl: './enum-array-cell.component.html',
  styleUrl: './enum-array-cell.component.scss',
})
export class EnumArrayCellComponent extends BaseCellComponent {
  public getDisplayValue(): string {
    const value = this.getProperty(this.column.field);

    if (!Array.isArray(value)) {
      return '';
    }

    return value
      .map((item) => item?.name)
      .filter((name): name is string => typeof name === 'string' && name.length > 0)
      .join(', ');
  }
}
