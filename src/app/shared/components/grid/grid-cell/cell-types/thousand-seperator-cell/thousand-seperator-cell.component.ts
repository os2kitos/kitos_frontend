import { Component } from '@angular/core';
import { BaseCellComponent } from '../../base-cell.component';
import { ParagraphComponent } from '../../../../paragraph/paragraph.component';
import { DecimalPipe } from '@angular/common';
import { SearchPropertyPipe } from '../../../../../pipes/column-property.pipe';

@Component({
  selector: 'app-thousand-seperator-cell',
  templateUrl: './thousand-seperator-cell.component.html',
  styleUrl: './thousand-seperator-cell.component.scss',
  imports: [ParagraphComponent, DecimalPipe, SearchPropertyPipe],
})
export class ThousandSeperatorCellComponent extends BaseCellComponent {}
