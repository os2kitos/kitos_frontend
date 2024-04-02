import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { first } from 'rxjs';
import { GridColumn } from 'src/app/shared/models/grid-column.model';
import { GridState } from 'src/app/shared/models/grid-state.model';
import { ITInterfaceActions } from 'src/app/store/it-system-interfaces/actions';
import { selectInterfaceGridData, selectInterfaceGridLoading, selectInterfaceGridState } from 'src/app/store/it-system-interfaces/selectors';

@Component({
  selector: 'app-it-system-interfaces',
  templateUrl: './it-system-interfaces.component.html',
  styleUrl: './it-system-interfaces.component.scss'
})
export class ItSystemInterfacesComponent implements OnInit {
  public readonly isLoading$ = this.store.select(selectInterfaceGridLoading);
  public readonly gridData$ = this.store.select(selectInterfaceGridData);
  public readonly gridState$ = this.store.select(selectInterfaceGridState);

  public readonly gridColumns: GridColumn[] = [
    { field: 'name', title: $localize`Snitflade`, style: 'primary' },
    { field: 'disabled', title: $localize`Snitfladens status`, filter: 'boolean', style: 'chip' },
    { field: 'lastChangedById', title: $localize`Sidst ændret ID`, filter: 'numeric' },
    { field: 'lastChangedAt', title: $localize`Sidst ændret`, filter: 'date' },
  ];

  constructor(private store: Store, private router: Router, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.gridState$.pipe(first()).subscribe((gridState) => this.stateChange(gridState));
  }

  public stateChange(gridState: GridState) {
    this.store.dispatch(ITInterfaceActions.updateGridState(gridState));
  }

  public rowIdSelect(rowId: string) {
    this.router.navigate([rowId], { relativeTo: this.route });
  }
}

