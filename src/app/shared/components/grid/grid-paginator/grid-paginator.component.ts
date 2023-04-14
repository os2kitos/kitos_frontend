import { Component, EventEmitter, Input, Output } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { PageSize, PageSizeItem } from 'src/app/shared/models/page-size-item.model';
import { GridState, defaultGridState } from '../../../models/grid-state.model';

@Component({
  selector: 'app-grid-paginator',
  templateUrl: 'grid-paginator.component.html',
  styleUrls: ['grid-paginator.component.scss'],
})
export class GridPaginatorComponent {
  @Input() total?: number;
  @Input() state?: GridState | null;
  @Output() stateChange = new EventEmitter<GridState>();

  private selectedPageSize = defaultGridState.take;

  public readonly pageSizes: PageSizeItem[] = [
    { text: '10', value: 10 },
    { text: '25', value: 25 },
    { text: '50', value: 50 },
    { text: '100', value: 100 },
    { text: '200', value: 200 },
    { text: $localize`Alle`, value: 'all' },
  ];

  public pageSizeChanged(pageSize: PageSize) {
    this.selectedPageSize = pageSize;
    this.stateChange.emit({ ...this.state, skip: 0, take: pageSize });
  }

  public pageChanged(event: PageEvent) {
    this.stateChange.emit({ ...this.state, skip: event.pageIndex * event.pageSize, take: this.selectedPageSize });
  }
}
