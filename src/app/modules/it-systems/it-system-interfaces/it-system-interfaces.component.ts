import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { CellClickEvent } from '@progress/kendo-angular-grid';
import { combineLatestWith, first } from 'rxjs';
import { BaseOverviewComponent } from 'src/app/shared/base/base-overview.component';
import { INTERFACE_COLUMNS_ID, INTERFACE_SECTION_NAME } from 'src/app/shared/constants/persistent-state-constants';
import { accessModifierOptions } from 'src/app/shared/models/access-modifier.model';
import { GridColumn } from 'src/app/shared/models/grid-column.model';
import { GridState } from 'src/app/shared/models/grid-state.model';
import { GridColumnStorageService } from 'src/app/shared/services/grid-column-storage-service';
import { ITInterfaceActions } from 'src/app/store/it-system-interfaces/actions';
import {
  selectInterfaceGridColumns,
  selectInterfaceGridData,
  selectInterfaceGridLoading,
  selectInterfaceGridState,
  selectInterfaceHasCreateCollectionPermission,
} from 'src/app/store/it-system-interfaces/selectors';

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

  private readonly interfaceSectionName = INTERFACE_SECTION_NAME;

  private readonly defaultGridColumns: GridColumn[] = [
    {
      field: 'ItInterfaceId',
      title: $localize`Snitflade ID`,
      section: this.interfaceSectionName,
      style: 'primary',
      hidden: false,
    },
    {
      field: 'Name',
      title: this.interfaceSectionName,
      section: this.interfaceSectionName,
      style: 'primary',
      hidden: false,
      required: true,
    },
    {
      field: 'Version',
      title: $localize`Version`,
      section: this.interfaceSectionName,
      style: 'primary',
      hidden: true,
    },
    {
      field: 'AccessModifier',
      title: $localize`Synlighed`,
      section: this.interfaceSectionName,
      extraFilter: 'enum',
      extraData: accessModifierOptions,
      style: 'enum',
      hidden: false,
    },
    {
      field: 'ExhibitedBy.ItSystem.BelongsTo.Name',
      title: $localize`Rettighedshaver`,
      section: this.interfaceSectionName,
      hidden: true,
    },
    {
      field: 'Url',
      title: $localize`Link til beskrivelse`,
      style: 'link',
      section: this.interfaceSectionName,
      width: 290,
      hidden: false,
    },
    {
      field: 'ExhibitedBy.ItSystem.Name',
      idField: 'ExhibitedBy.ItSystem.Uuid',
      entityType: 'it-system',
      title: $localize`Udstillersystem`,
      section: this.interfaceSectionName,
      style: 'page-link',
      hidden: false,
    },
    { field: 'Interface.Name', title: $localize`Grænseflade`, section: this.interfaceSectionName, hidden: true },
    {
      field: 'DataRows',
      title: $localize`Datatype`,
      section: this.interfaceSectionName,
      hidden: false,
      noFilter: true,
    },
    {
      field: 'Organization.Name',
      title: $localize`Oprettet af: Organisation`,
      section: this.interfaceSectionName,
      hidden: true,
    },
    {
      field: 'ObjectOwner.Name',
      title: $localize`Oprettet af: Bruger`,
      section: this.interfaceSectionName,
      hidden: true,
    },
    {
      field: 'LastChangedByUser.Name',
      title: $localize`Sidst redigeret: Bruger`,
      section: this.interfaceSectionName,
      hidden: true,
    },
    {
      field: 'LastChanged',
      title: $localize`Sidst redigeret: Dato`,
      section: this.interfaceSectionName,
      width: 350,
      filter: 'date',
      hidden: false,
      style: 'date',
    },
    {
      field: 'Uuid',
      title: $localize`Snitflade (UUID)`,
      section: this.interfaceSectionName,
      width: 320,
      hidden: false,
    },
    {
      field: 'Usages',
      dataField: 'Name',
      title: $localize`Snitfladen anvendes af`,
      section: this.interfaceSectionName,
      style: 'usages',
      entityType: 'it-interface',
      hidden: false,
      noFilter: true,
      width: 200,
    },
  ];

  constructor(
    store: Store,
    private router: Router,
    private route: ActivatedRoute,
    private actions$: Actions,
    private gridColumnStorageService: GridColumnStorageService
  ) {
    super(store, 'it-interface');
  }

  ngOnInit(): void {
    this.store.dispatch(ITInterfaceActions.getITInterfaceCollectionPermissions());
    const existingColumns = this.gridColumnStorageService.getColumns(INTERFACE_COLUMNS_ID, this.defaultGridColumns);
    if (existingColumns) {
      this.store.dispatch(ITInterfaceActions.updateGridColumns(existingColumns));
    } else {
      this.store.dispatch(ITInterfaceActions.updateGridColumns(this.defaultGridColumns));
    }

    this.subscriptions.add(this.gridState$.pipe(first()).subscribe((gridState) => this.stateChange(gridState)));

    this.subscriptions.add(
      this.actions$
        .pipe(ofType(ITInterfaceActions.createITInterfaceSuccess), combineLatestWith(this.gridState$))
        .subscribe(([_, gridState]) => {
          this.stateChange(gridState);
        })
    );

    this.updateUnclickableColumns(this.defaultGridColumns);
    this.subscriptions.add(this.gridColumns$.subscribe((columns) => this.updateUnclickableColumns(columns)));
  }

  public stateChange(gridState: GridState) {
    this.store.dispatch(ITInterfaceActions.updateGridState(gridState));
  }

  override rowIdSelect(event: CellClickEvent) {
    super.rowIdSelect(event, this.router, this.route);
  }
}
