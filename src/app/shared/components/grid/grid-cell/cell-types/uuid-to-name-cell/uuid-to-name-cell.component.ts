import { Component } from '@angular/core';
import { BaseCellComponent } from '../../base-cell.component';

import { ParagraphComponent } from '../../../../paragraph/paragraph.component';
import { SearchPropertyPipe } from '../../../../../pipes/column-property.pipe';

@Component({
  selector: 'app-uuid-to-name-cell',
  templateUrl: './uuid-to-name-cell.component.html',
  styleUrl: './uuid-to-name-cell.component.scss',
  imports: [ParagraphComponent, SearchPropertyPipe],
})
export class UuidToNameCellComponent extends BaseCellComponent {}
