import { Component } from '@angular/core';
import { BaseCellComponent } from '../../base-cell.component';
import { ParagraphComponent } from '../../../../paragraph/paragraph.component';
import { SearchPropertyPipe } from '../../../../../pipes/column-property.pipe';

@Component({
  selector: 'app-enum-cell',
  templateUrl: './enum-cell.component.html',
  styleUrl: './enum-cell.component.scss',
  imports: [ParagraphComponent, SearchPropertyPipe],
})
export class EnumCellComponent extends BaseCellComponent {}
