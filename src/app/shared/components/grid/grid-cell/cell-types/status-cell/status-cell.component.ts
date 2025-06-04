import { Component } from '@angular/core';
import { BaseCellComponent } from '../../base-cell.component';
import { StatusChipComponent } from '../../../../status-chip/status-chip.component';
import { SearchPropertyPipe } from '../../../../../pipes/column-property.pipe';

@Component({
  selector: 'app-status-cell',
  templateUrl: './status-cell.component.html',
  styleUrl: './status-cell.component.scss',
  imports: [StatusChipComponent, SearchPropertyPipe],
})
export class StatusCellComponent extends BaseCellComponent {}
