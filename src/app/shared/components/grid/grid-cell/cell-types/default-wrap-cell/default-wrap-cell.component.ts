import { Component } from '@angular/core';
import { BaseCellComponent } from '../../base-cell.component';
import { ParagraphComponent } from '../../../../paragraph/paragraph.component';
import { SearchPropertyPipe } from '../../../../../pipes/column-property.pipe';

@Component({
  selector: 'app-default-wrap-cell',
  templateUrl: './default-wrap-cell.component.html',
  styleUrl: './default-wrap-cell.component.scss',
  imports: [ParagraphComponent, SearchPropertyPipe],
})
export class DefaultWrapCellComponent extends BaseCellComponent {}
