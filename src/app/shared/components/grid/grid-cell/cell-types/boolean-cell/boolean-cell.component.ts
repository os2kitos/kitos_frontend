import { Component } from '@angular/core';
import { BaseCellComponent } from '../../base-cell.component';
import { BooleanCircleComponent } from '../../../../boolean-circle/boolean-circle.component';
import { SearchPropertyPipe } from '../../../../../pipes/column-property.pipe';

@Component({
  selector: 'app-boolean-cell',
  templateUrl: './boolean-cell.component.html',
  styleUrl: './boolean-cell.component.scss',
  imports: [BooleanCircleComponent, SearchPropertyPipe],
})
export class BooleanCellComponent extends BaseCellComponent {}
