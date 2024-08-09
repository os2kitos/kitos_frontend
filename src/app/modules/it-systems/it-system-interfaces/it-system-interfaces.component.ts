import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { CellClickEvent } from '@progress/kendo-angular-grid';
import { combineLatestWith, first, of } from 'rxjs';
import { BaseOverviewComponent } from 'src/app/shared/base/base-overview.component';
import { accessModifierOptions } from 'src/app/shared/models/access-modifier.model';
import { GridColumn } from 'src/app/shared/models/grid-column.model';
import { GridState } from 'src/app/shared/models/grid-state.model';
import { INTERFACE_COLUMNS_ID } from 'src/app/shared/persistent-state-constants';
import { StatePersistingService } from 'src/app/shared/services/state-persisting.service';
import { ITInterfaceActions } from 'src/app/store/it-system-interfaces/actions';
import {
  selectInterfaceGridColumns,
  selectInterfaceGridData,
  selectInterfaceGridLoading,
  selectInterfaceGridState,
  selectInterfaceHasCreateCollectionPermission,
} from 'src/app/store/it-system-interfaces/selectors';
import { CreateInterfaceDialogComponent } from './create-interface-dialog/create-interface-dialog.component';
import { GridColumnStyle } from 'src/app/shared/enums/grid-column-style';

@Component({
  selector: 'app-it-system-interfaces',
  templateUrl: './it-system-interfaces.component.html',
  styleUrl: './it-system-interfaces.component.scss',
})
export class ItSystemInterfacesComponent extends BaseOverviewComponent implements OnInit {
  public readonly isLoading$ = this.store.select(selectInterfaceGridLoading);
  public readonly gridData$ = this.store.select(selectInterfaceGridData);
  public readonly gridState$ = this.store.select(selectInterfaceGridState);
  public readonly gridColumns$ = this.store.select(selectInterfaceGridColumns);

  public readonly hasCreatePermission$ = this.store.select(selectInterfaceHasCreateCollectionPermission);
  private readonly defaultGridColumns: GridColumn[] = [
    {
      field: 'ItInterfaceId',
      title: $localize`Snitflade ID`,
      section: $localize`Snitflade`,
      style: GridColumnStyle.primary,
      hidden: false,
    },
    {
      field: 'Name',
      title: $localize`Snitflade`,
      section: $localize`Snitflade`,
      style: GridColumnStyle.primary,
      hidden: false,
      required: true,
    },
    {
      field: 'Version',
      title: $localize`Version`,
      section: $localize`Snitflade`,
      style: GridColumnStyle.primary,
      hidden: true,
    },
    {
      field: 'AccessModifier',
      title: $localize`Synlighed`,
      section: $localize`Snitflade`,
      extraFilter: 'enum',
      filterData: accessModifierOptions,
      style: GridColumnStyle.enum,
      hidden: false,
    },
    {
      field: 'ExhibitedBy.ItSystem.BelongsTo.Name',
      title: $localize`Rettighedshaver`,
      section: $localize`Snitflade`,
      hidden: true,
    },
    {
      field: 'Url',
      title: $localize`Link til beskrivelse`,
      style: GridColumnStyle.link,
      section: $localize`Snitflade`,
      width: 290,
      hidden: false,
    },
    {
      field: 'ExhibitedBy.ItSystem.Name',
      idField: 'ExhibitedBy.ItSystem.Uuid',
      entityType: 'it-system',
      title: $localize`Udstillersystem`,
      section: $localize`Snitflade`,
      style: GridColumnStyle.pageLink,
      hidden: false,
    },
    { field: 'Interface.Name', title: $localize`Grænseflade`, section: $localize`Snitflade`, hidden: true },
    { field: 'DataRows', title: $localize`Datatype`, section: $localize`Snitflade`, hidden: false, noFilter: true },
    {
      field: 'Organization.Name',
      title: $localize`Oprettet af: Bruger`,
      section: $localize`Snitflade`,
      hidden: true,
    },
    {
      field: 'ObjectOwner.Name',
      title: $localize`Oprettet af: Bruger`,
      section: $localize`Snitflade`,
      hidden: true,
    },
    {
      field: 'LastChangedByUser.Name',
      title: $localize`Sidst redigeret: Bruger`,
      section: $localize`Snitflade`,
      hidden: true,
    },
    {
      field: 'LastChanged',
      title: $localize`Sidst redigeret: Dato`,
      section: $localize`Snitflade`,
      width: 350,
      filter: 'date',
      hidden: false,
      style: GridColumnStyle.date
    },
    {
      field: 'Uuid',
      title: $localize`Snitflade (UUID)`,
      section: $localize`Snitflade`,
      width: 320,
      hidden: false,
    },
    {
      field: 'TOBEIMPLEMENTED',
      title: $localize`Snitfladen anvendes af`,
      section: $localize`Snitflade`,
      hidden: true,
      noFilter: true,
    },
  ];

  constructor(
    private store: Store,
    private router: Router,
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private actions$: Actions,
    private statePersistingService: StatePersistingService
  ) {
    super();
  }

  ngOnInit(): void {
    this.store.dispatch(ITInterfaceActions.getITInterfaceCollectionPermissions());
    const existingColumns = this.statePersistingService.get<GridColumn[]>(INTERFACE_COLUMNS_ID);
    if (existingColumns) {
      this.store.dispatch(ITInterfaceActions.updateGridColumns(existingColumns));
    } else {
      this.store.dispatch(ITInterfaceActions.updateGridColumns(this.defaultGridColumns));
    }

    this.gridState$.pipe(first()).subscribe((gridState) => this.stateChange(gridState));

    this.subscriptions.add(
      this.actions$
        .pipe(ofType(ITInterfaceActions.createITInterfaceSuccess), combineLatestWith(this.gridState$))
        .subscribe(([_, gridState]) => {
          this.stateChange(gridState);
        })
    );

    this.updateUnclickableColumns(this.defaultGridColumns);
    this.gridColumns$.subscribe(
      (columns) => this.updateUnclickableColumns(columns));
  }

  public stateChange(gridState: GridState) {
    this.store.dispatch(ITInterfaceActions.updateGridState(gridState));
  }

  override rowIdSelect(event: CellClickEvent) {
    super.rowIdSelect(event, this.router, this.route);
  }

  public openCreateDialog() {
    this.dialog.open(CreateInterfaceDialogComponent);
  }
}
