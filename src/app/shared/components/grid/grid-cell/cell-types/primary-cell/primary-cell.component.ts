import { Component } from '@angular/core';
import { BaseCellComponent } from '../../base-cell.component';
import { SearchPropertyPipe } from '../../../../../pipes/column-property.pipe';

@Component({
  selector: 'app-primary-cell',
  templateUrl: './primary-cell.component.html',
  styleUrl: './primary-cell.component.scss',
  imports: [SearchPropertyPipe],
})
export class PrimaryCellComponent extends BaseCellComponent {}
