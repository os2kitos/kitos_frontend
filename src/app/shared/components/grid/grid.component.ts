import { Component, EventEmitter, Input, Output } from '@angular/core';
import { PagerSettings, SelectionEvent } from '@progress/kendo-angular-grid';
import { GridColumn } from '../../models/grid-column.model';
import { GridData } from '../../models/grid-data.model';
import { GridState } from '../../models/grid-state.model';

@Component({
  selector: 'app-grid',
  templateUrl: 'grid.component.html',
  styleUrls: ['grid.component.scss'],
})
export class GridComponent {
  @Input() data!: GridData | null;
  @Input() columns: GridColumn[] | null = [];
  @Input() loading: boolean | null = false;

  @Input() state?: GridState | null;
  @Output() stateChange = new EventEmitter<GridState>();

  @Output() rowIdSelect = new EventEmitter<string>();

  public readonly pageable: PagerSettings = {
    pageSizes: [10, 25, 50, 100, 200],
    buttonCount: 5,
  };

  public onStateChange(state: GridState) {
    this.state = state;
    this.stateChange.emit(state);
  }

  public onSelectionChange(event: SelectionEvent) {
    const rowId = event.selectedRows?.pop()?.dataItem?.id;
    if (rowId) {
      this.rowIdSelect.emit(rowId);
    }
  }
}
