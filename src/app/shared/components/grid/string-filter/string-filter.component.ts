import { Component, Input, OnInit } from '@angular/core';
import { ColumnComponent, FilterService } from '@progress/kendo-angular-grid';
import { CompositeFilterDescriptor, isCompositeFilterDescriptor } from '@progress/kendo-data-query';
import { AppBaseFilterCellComponent } from '../app-base-filter-cell.component';
import { Actions, ofType } from '@ngrx/effects';
import { ITSystemUsageActions } from 'src/app/store/it-system-usage/actions';
import { map } from 'rxjs';
import { RegistrationEntityTypes } from 'src/app/shared/models/registrations/registration-entity-categories.model';
import { ITSystemActions } from 'src/app/store/it-system/actions';
import { ITInterfaceActions } from 'src/app/store/it-system-interfaces/actions';
import { ITContractActions } from 'src/app/store/it-contract/actions';

@Component({
  selector: 'app-string-filter',
  templateUrl: './string-filter.component.html',
  styleUrl: './string-filter.component.scss',
})
export class StringFilterComponent extends AppBaseFilterCellComponent implements OnInit {
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
        ofType(this.getApplyAction()),
        map((action) => action.state.filter)
      )
      .subscribe((compFilter) => {
        if (!compFilter) return;
        console.log(compFilter);
        const matchingFilter = compFilter.filters.find((filter) => {
          if (isCompositeFilterDescriptor(filter)) {
            return false;
          }
          return filter.field === this.column.field;
        });
        if (!matchingFilter || isCompositeFilterDescriptor(matchingFilter)) {
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
  //Needs better name
  private getApplyAction() {
    switch (this.entityType) {
      case 'it-system-usage':
        return ITSystemUsageActions.applyITSystemUsageFilter;
      case 'it-system':
        return ITSystemActions.applyITSystemFilter;
      case 'it-interface':
        return ITInterfaceActions.applyITInterfacesFilter;
      case 'it-contract':
        return ITContractActions.applyITContractFilter;
      default:
        throw '???';
    }
  }
}
