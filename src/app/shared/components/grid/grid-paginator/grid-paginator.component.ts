import { Component, EventEmitter, Input, Output } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { GridState } from '../../../models/grid-state.model';

@Component({
  selector: 'app-grid-paginator',
  templateUrl: 'grid-paginator.component.html',
  styleUrls: ['grid-paginator.component.scss'],
})
export class GridPaginatorComponent {
  @Input() total?: number;
  @Input() state?: GridState | null;
  @Output() stateChange = new EventEmitter<GridState>();

  public readonly pageSizeOptions = [10, 25, 50, 100, 200]; // TODO: all

  public pageChanged(event: PageEvent) {
    this.stateChange.emit({ ...this.state, skip: event.pageIndex * event.pageSize, take: event.pageSize });
  }
}
