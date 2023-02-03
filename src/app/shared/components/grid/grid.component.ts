import { Component, EventEmitter, Input, Output } from '@angular/core';
import { State } from '@progress/kendo-data-query';
import { GridColumn } from '../../models/grid-column.model';
import { GridData } from '../../models/grid-data.model';

@Component({
  selector: 'app-grid',
  templateUrl: 'grid.component.html',
  styleUrls: ['grid.component.scss'],
})
export class GridComponent {
  @Input() data!: GridData | null;
  @Input() columns: GridColumn[] | null = [];
  @Input() loading: boolean | null = false;

  @Input() state?: State | null;
  @Output() stateChange = new EventEmitter<State>();

  public onStateChange(state: State) {
    this.state = state;
    this.stateChange.emit(state);
  }
}
