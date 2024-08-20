import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { ColumnComponent, FilterService } from '@progress/kendo-angular-grid';
import { CompositeFilterDescriptor, isCompositeFilterDescriptor } from '@progress/kendo-data-query';
import { AppBaseFilterCellComponent } from '../app-base-filter-cell.component';
import { Actions, ofType } from '@ngrx/effects';
import { map } from 'rxjs';
import { RegistrationEntityTypes } from 'src/app/shared/models/registrations/registration-entity-categories.model';
import { TextBoxComponent } from 'src/app/shared/components/textbox/textbox.component';
import { getApplyFilterAction } from '../../filter-options-button/filter-options-button.component';

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
    this.actions$
      .pipe(
        ofType(getApplyFilterAction(this.entityType)),
        map((action) => action.state.filter)
      )
      .subscribe((compFilter) => {
        if (!compFilter) return;
        const matchingFilter = compFilter.filters.find((filter) => !isCompositeFilterDescriptor(filter) && filter.field === this.column.field);
        //Don't think it can be a Composite filter ever for the grids we have, but the check satisfies TS
        if (!matchingFilter || isCompositeFilterDescriptor(matchingFilter)) {
          this.textBox.clear(); //No matching filter means it had no value at the time of saving the filter, so we need to clear the textbox
          return;
        }
        const newValue = matchingFilter.value ?? '';
        this.valueChange(newValue);
      });
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
    this.value = value;

  }
}
