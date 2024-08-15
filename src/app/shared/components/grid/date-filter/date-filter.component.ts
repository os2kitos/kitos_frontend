import { Component, Input, OnInit } from '@angular/core';
import { ColumnComponent, FilterService } from '@progress/kendo-angular-grid';
import { CompositeFilterDescriptor } from '@progress/kendo-data-query';
import { AppBaseFilterCellComponent } from '../app-base-filter-cell.component';
import { Actions, ofType } from '@ngrx/effects';
import { ITSystemUsageActions } from 'src/app/store/it-system-usage/actions';
import { map } from 'rxjs';

interface DateFilterOption {
  text: string;
  operator: string;
}

@Component({
  selector: 'app-date-filter',
  templateUrl: 'date-filter.component.html',
  styleUrls: ['date-filter.component.scss'],
})
export class DateFilterComponent extends AppBaseFilterCellComponent implements OnInit {
  @Input() override filter!: CompositeFilterDescriptor;
  @Input() override column!: ColumnComponent;

  public value: Date | undefined = undefined;

  public readonly options: DateFilterOption[] = [
    { text: $localize`Fra og med`, operator: 'gte' },
    { text: $localize`Til og med`, operator: 'lte' },
  ];

  public chosenOption!: DateFilterOption;

  constructor(filterService: FilterService, private actions$: Actions) {
    super(filterService);
  }

  ngOnInit(): void {
    const columnFilter = this.getColumnFilter();
    this.value = columnFilter?.value;
    this.chosenOption = this.options.find((option) => option.operator === columnFilter?.operator) || this.options[0];

    this.actions$.pipe(
      ofType(ITSystemUsageActions.applyITSystemFilter),
      map(action => action.filter)
    ).subscribe(filter => {
      console.log('Received apply filter action', filter);
      this.filter = filter.compFilter ?? { logic: 'and', filters: [] };
      this.value = this.getColumnFilter()?.value;
    });
  }

  public valueChange(value?: Date) {
    if (value) this.value = value;

    this.applyFilter(
      !value
        ? this.removeFilter(this.column.field)
        : this.updateFilter({
            field: this.column.field,
            operator: this.chosenOption.operator,
            value: value,
          })
    );
  }

  public optionChange() {
    this.valueChange(this.value);
  }
}
