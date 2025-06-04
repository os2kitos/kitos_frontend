import { Component } from '@angular/core';
import { BaseCellComponent } from '../../base-cell.component';
import { ParagraphComponent } from '../../../../paragraph/paragraph.component';
import { AppDatePipe } from '../../../../../pipes/app-date.pipe';
import { SearchPropertyPipe } from '../../../../../pipes/column-property.pipe';

@Component({
  selector: 'app-date-cell',
  templateUrl: './date-cell.component.html',
  styleUrl: './date-cell.component.scss',
  imports: [ParagraphComponent, AppDatePipe, SearchPropertyPipe],
})
export class DateCellComponent extends BaseCellComponent {}
