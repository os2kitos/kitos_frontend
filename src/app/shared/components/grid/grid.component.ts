import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { GridColumn } from '../../models/grid-column.model';
import { GridData } from '../../models/grid-data.model';
import { GridState } from '../../models/grid-state.model';

@Component({
  selector: 'app-grid',
  templateUrl: 'grid.component.html',
  styleUrls: ['grid.component.scss'],
})
export class GridComponent<T> implements OnChanges {
  @Input() data!: GridData<T> | null;
  @Input() columns: GridColumn[] | null = [];
  @Input() loading: boolean | null = false;

  @Input() state?: GridState | null;
  @Output() stateChange = new EventEmitter<GridState>();

  @Output() rowIdSelect = new EventEmitter<string>();

  public displayedColumns?: string[];

  public dataSource = new MatTableDataSource<T>();

  ngOnChanges(changes: SimpleChanges) {
    if (changes['data']) {
      this.dataSource = new MatTableDataSource(this.data?.data);
    }

    if (changes['columns']) {
      this.displayedColumns = this.columns?.map((column) => column.field);
    }
  }
}
