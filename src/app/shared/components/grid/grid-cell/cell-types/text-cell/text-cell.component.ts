import { Component } from '@angular/core';
import { BaseCellComponent } from '../../base-cell.component';
import { ParagraphComponent } from '../../../../paragraph/paragraph.component';
import { SearchPropertyPipe } from '../../../../../pipes/column-property.pipe';

@Component({
  selector: 'app-text-cell',
  templateUrl: './text-cell.component.html',
  styleUrl: './text-cell.component.scss',
  imports: [ParagraphComponent, SearchPropertyPipe],
})
export class TextCellComponent extends BaseCellComponent {}
