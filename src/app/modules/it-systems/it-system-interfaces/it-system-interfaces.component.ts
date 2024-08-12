import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { combineLatestWith, first } from 'rxjs';
import { BaseComponent } from 'src/app/shared/base/base.component';
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

@Component({
  selector: 'app-it-system-interfaces',
  templateUrl: './it-system-interfaces.component.html',
  styleUrl: './it-system-interfaces.component.scss',
})
export class ItSystemInterfacesComponent extends BaseComponent implements OnInit {
  public readonly isLoading$ = this.store.select(selectInterfaceGridLoading);
  public readonly gridData$ = this.store.select(selectInterfaceGridData);
  public readonly gridState$ = this.store.select(selectInterfaceGridState);
  public readonly gridColumns$ = this.store.select(selectInterfaceGridColumns);

  public readonly hasCreatePermission$ = this.store.select(selectInterfaceHasCreateCollectionPermission);

  private readonly gridColumns: GridColumn[] = [
    {
      field: 'ItInterfaceId',
      title: $localize`Snitflade ID`,
      section: $localize`Snitflade`,
      style: 'primary',
      hidden: false,
    },
    {
      field: 'Name',
      title: $localize`Snitflade`,
      section: $localize`Snitflade`,
      style: 'primary',
      hidden: false,
      required: true,
    },
    {
      field: 'Version',
      title: $localize`Version`,
      section: $localize`Snitflade`,
      style: 'primary',
      hidden: true,
    },
    {
      field: 'AccessModifier',
      title: $localize`Synlighed`,
      section: $localize`Snitflade`,
      extraFilter: 'enum',
      extraData: accessModifierOptions,
      style: 'enum',
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
      style: 'link',
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
      style: 'page-link',
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
      style: 'date'
    },
    {
      field: 'Uuid',
      title: $localize`Snitflade (UUID)`,
      section: $localize`Snitflade`,
      width: 320,
      hidden: false,
    },
    {
      field: 'Usages',
      title: $localize`Snitfladen anvendes af`,
      section: $localize`Snitflade`,
      style: 'usages-interface',
      hidden: false,
      noFilter: true,
      width: 200,
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
      this.store.dispatch(ITInterfaceActions.updateGridColumns(this.gridColumns));
    }

    this.gridState$.pipe(first()).subscribe((gridState) => this.stateChange(gridState));

    this.subscriptions.add(
      this.actions$
        .pipe(ofType(ITInterfaceActions.createITInterfaceSuccess), combineLatestWith(this.gridState$))
        .subscribe(([_, gridState]) => {
          this.stateChange(gridState);
        })
    );
  }

  public stateChange(gridState: GridState) {
    this.store.dispatch(ITInterfaceActions.updateGridState(gridState));
  }

  public rowIdSelect(rowId: string) {
    this.router.navigate([rowId], { relativeTo: this.route });
  }

  public openCreateDialog() {
    this.dialog.open(CreateInterfaceDialogComponent);
  }
}
