import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { Actions } from '@ngrx/effects';
import { ColumnComponent, FilterService } from '@progress/kendo-angular-grid';
import { CompositeFilterDescriptor, FilterDescriptor } from '@progress/kendo-data-query';
import { TextBoxComponent } from 'src/app/shared/components/textbox/textbox.component';
import { initializeApplyFilterSubscription } from 'src/app/shared/helpers/grid-filter.helpers';
import { RegistrationEntityTypes } from 'src/app/shared/models/registrations/registration-entity-categories.model';
import { AppBaseFilterCellComponent } from '../app-base-filter-cell.component';

@Component({
  selector: 'app-string-filter',
  templateUrl: './string-filter.component.html',
  styleUrl: './string-filter.component.scss',
})
export class StringFilterComponent extends AppBaseFilterCellComponent implements OnInit {
  @ViewChild(TextBoxComponent) public textBox!: TextBoxComponent;
  @Input() override filter!: CompositeFilterDescriptor;
  @Input() override column!: ColumnComponent;
  @Input() public entityType!: RegistrationEntityTypes;

  public value: string = '';

  constructor(filterService: FilterService, private actions$: Actions) {
    super(filterService);
  }

  ngOnInit(): void {
    this.value = this.getColumnFilter()?.value ?? '';

    const updateMethod: (filter: FilterDescriptor | undefined) => void = (filter) => {
      this.value = filter ? (filter.value as string) : '';
    };

    if (this.entityType) {
      this.subscriptions.add(
        initializeApplyFilterSubscription(this.actions$, this.entityType, this.column.field, updateMethod)
      );
    }
  }

  public valueChange(value: string) {
    this.applyFilter(
      !value
        ? this.removeFilter(this.column.field)
        : this.updateFilter({
            field: this.column.field,
            operator: 'contains',
            value: value,
          })
    );
  }
}
