import { Component, Input, OnInit } from '@angular/core';
import { Actions } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { ColumnComponent, FilterService } from '@progress/kendo-angular-grid';
import { CompositeFilterDescriptor, FilterDescriptor } from '@progress/kendo-data-query';
import { first, map, Observable } from 'rxjs';
import { initializeApplyFilterSubscription } from 'src/app/shared/helpers/grid-filter.helpers';
import { RegularOptionType } from 'src/app/shared/models/options/regular-option-types.model';
import { RegistrationEntityTypes } from 'src/app/shared/models/registrations/registration-entity-categories.model';
import { RegularOptionTypeActions } from 'src/app/store/regular-option-type-store/actions';
import { selectRegularOptionTypes } from 'src/app/store/regular-option-type-store/selectors';
import { AppBaseFilterCellComponent } from '../app-base-filter-cell.component';
import { FilterDropdownOption } from '../dropdown-filter/dropdown-filter.component';

@Component({
  selector: 'app-choice-type-dropdown-filter',
  templateUrl: './choice-type-dropdown-filter.component.html',
  styleUrl: './choice-type-dropdown-filter.component.scss',
})
export class ChoiceTypeDropdownFilterComponent extends AppBaseFilterCellComponent implements OnInit {
  @Input() override filter!: CompositeFilterDescriptor;
  @Input() override column!: ColumnComponent;
  @Input() choiceTypeName: RegularOptionType = 'it-system_business-type';
  @Input() shouldFilterByChoiceTypeName: boolean = false;
  @Input() sortOptions?: boolean;
  @Input() entityType!: RegistrationEntityTypes;

  public options$: Observable<FilterDropdownOption[]> | undefined;

  public chosenOption?: FilterDropdownOption;

  constructor(filterService: FilterService, private store: Store, private actions$: Actions) {
    super(filterService);
  }

  ngOnInit(): void {
    this.store.dispatch(RegularOptionTypeActions.getOptions(this.choiceTypeName));
    this.options$ = this.store.select(selectRegularOptionTypes(this.choiceTypeName)).pipe(
      map((options) => options?.map((option) => ({ name: option.name, value: option.uuid })) ?? []),
      map((options) => this.applySorting(options, this.sortOptions))
    );

    this.subscriptions.add(
      this.options$.pipe(first()).subscribe((options) => {
        this.chosenOption = options.find((option) => option.value === this.getColumnFilter()?.value);
      })
    );

    const updateMethod: (filter: FilterDescriptor | undefined) => void = (filter) => {
      const newValue = filter?.value;
      this.subscriptions.add(
        this.options$?.pipe(first()).subscribe((options) => {
          const matchingOption = this.shouldFilterByChoiceTypeName
            ? options.find((option) => option.name === newValue)
            : options.find((option) => option.value === newValue);
          this.chosenOption = matchingOption;
        })
      );
    };
    this.subscriptions.add(
      initializeApplyFilterSubscription(this.actions$, this.entityType, this.column.field, updateMethod)
    );
  }

  private applySorting(options: FilterDropdownOption[], sortOptions: boolean | undefined): FilterDropdownOption[] {
    if (!sortOptions) {
      return options;
    }

    return options.sort((a, b) => {
      const fieldA = a.name.toLowerCase();
      const fieldB = b.name.toLowerCase();

      const numA = parseInt(fieldA, 10);
      const numB = parseInt(fieldB, 10);

      if (!isNaN(numA) && !isNaN(numB)) {
        return numA - numB;
      }

      if (fieldA < fieldB) {
        return -1;
      }
      if (fieldA > fieldB) {
        return 1;
      }
      return 0;
    });
  }

  public didChange(option?: FilterDropdownOption | null): void {
    const filterValue = this.shouldFilterByChoiceTypeName ? option?.name : option?.value;
    this.applyFilter(
      option === undefined || option === null
        ? this.removeFilter(this.column.field)
        : this.updateFilter({
            field: this.column.field,
            operator: 'eq',
            value: filterValue,
          })
    );
  }
}
