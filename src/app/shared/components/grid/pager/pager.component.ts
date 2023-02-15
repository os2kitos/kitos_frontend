import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { PageSizeItem } from '@progress/kendo-angular-grid';
import { GridState } from 'src/app/shared/models/grid-state.model';

@Component({
  selector: 'app-pager',
  templateUrl: 'pager.component.html',
  styleUrls: ['pager.component.scss'],
})
export class PagerComponent implements OnInit {
  @Input() state?: GridState | null;

  @Output() pageSizeChange = new EventEmitter<number | undefined>();

  public pageSizes: PageSizeItem[] = [
    { text: '10', value: 10 },
    { text: '25', value: 25 },
    { text: '50', value: 50 },
    { text: '100', value: 100 },
    { text: '200', value: 200 },
    { text: $localize`Alle`, value: 'all' },
  ];

  public pageSizeValue?: PageSizeItem;

  ngOnInit() {
    this.pageSizeValue = this.pageSizes.find(
      (pageSize) => pageSize.value === this.state?.take || pageSize.value === 'all'
    );
  }

  public pageSizeValueChange(pageSize: PageSizeItem) {
    if (pageSize.value === 'all') {
      this.pageSizeChange.emit(undefined);
    } else {
      this.pageSizeChange.emit(pageSize.value);
    }
  }
}
