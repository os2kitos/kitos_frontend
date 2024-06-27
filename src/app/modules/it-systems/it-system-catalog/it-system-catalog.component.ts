import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { combineLatestWith, first } from 'rxjs';
import { BaseComponent } from 'src/app/shared/base/base.component';
import { accessModifierOptions } from 'src/app/shared/models/access-modifier.model';
import { GridColumn } from 'src/app/shared/models/grid-column.model';
import { GridState } from 'src/app/shared/models/grid-state.model';
import { archiveDutyChoiceOptions } from 'src/app/shared/models/it-system-usage/archive-duty-choice.model';
import { CATALOG_COLUMNS_ID } from 'src/app/shared/persistent-state-constants';
import { StatePersistingService } from 'src/app/shared/services/state-persisting.service';
import { ITSystemActions } from 'src/app/store/it-system/actions';
import {
  selectITSystemHasCreateCollectionPermission,
  selectSystemGridColumns,
  selectSystemGridData,
  selectSystemGridLoading,
  selectSystemGridState,
} from 'src/app/store/it-system/selectors';

@Component({
  templateUrl: './it-system-catalog.component.html',
  styleUrl: './it-system-catalog.component.scss',
})
export class ItSystemCatalogComponent extends BaseComponent implements OnInit {
  public readonly isLoading$ = this.store.select(selectSystemGridLoading);
  public readonly gridData$ = this.store.select(selectSystemGridData);
  public readonly gridState$ = this.store.select(selectSystemGridState);
  public readonly gridColumns$ = this.store.select(selectSystemGridColumns);

  public readonly hasCreatePermission$ = this.store.select(selectITSystemHasCreateCollectionPermission);

  //mock subscription, remove once working on the Catalog overview task
  public readonly gridColumns: GridColumn[] = [
    {
      field: 'PLACEHOLDER',
      title: $localize`Anvendes`,
      section: 'IT Systemer',
      noFilter: true,
      required: true,
      hidden: false,
    },
    { field: 'Parent.Name', title: $localize`Overordnet IT System`, section: 'IT Systemer', hidden: true },
    { field: 'PreviousName', title: $localize`Tidligere Systemnavn`, section: 'IT Systemer', hidden: false },
    { field: 'Name', title: $localize`IT systemnavn`, section: 'IT Systemer', style: 'primary', hidden: false },
    { field: 'ExternalUuid', title: $localize`IT-System (Eksternt UUID)`, section: 'IT Systemer', hidden: true },
    {
      field: 'AccessModifier',
      title: $localize`Synlighed`,
      section: 'IT Systemer',
      extraFilter: 'enum',
      style: 'enum',
      filterData: accessModifierOptions,
      hidden: true,
    },
    {
      field: 'BussinessType',
      title: $localize`Forretningstype`,
      section: 'IT Systemer',
      hidden: false,
    },
    { field: 'BelongsTo.Name', title: $localize`Rettighedshaver`, section: 'IT Systemer', hidden: false },
    { field: 'KLEIds', title: $localize`KLE ID`, section: 'IT Systemer', noFilter: true, hidden: true },
    { field: 'KLENames', title: $localize`KLE Navn`, section: 'IT Systemer', noFilter: true, hidden: false },
    {
      field: 'TOBEIMPLEMENTED',
      title: $localize`IT System: Anvendes af`,
      section: 'IT Systemer',
      noFilter: true,
      hidden: false,
    },
    {
      field: 'Organization.Name',
      title: $localize`Oprettet af: Organisation`,
      section: 'IT Systemer',
      noFilter: true,
      hidden: true,
    },
    {
      field: 'LastChangedByUser.Name',
      title: $localize`Sidst redigeret: Bruger`,
      section: 'IT Systemer',
      noFilter: true,
      hidden: true,
    },
    { field: 'LastChanged', title: $localize`Sidst ændret`, section: 'IT Systemer', filter: 'date', hidden: false },
    {
      field: 'Reference.Title',
      title: $localize`Reference`,
      section: 'IT Systemer',
      idField: 'Reference.URL',
      style: 'link',
      hidden: true,
    },
    { field: 'Uuid', title: $localize`UUID`, section: 'IT Systemer', hidden: true, width: 320 },
    { field: 'Description', title: $localize`Beskrivelse`, section: 'IT Systemer', hidden: true },
    {
      field: 'ArchiveDuty',
      title: $localize`Rigsarkivets vejledning til arkivering`,
      section: 'Rigsarkivet',
      extraFilter: 'enum',
      style: 'enum',
      filterData: archiveDutyChoiceOptions,
      hidden: true,
    },
    {
      field: 'ArchiveDutyComment',
      title: $localize`Bemærkning fra Rigsarkivets`,
      section: 'Rigsarkivet',
      hidden: true,
    },
  ];

  constructor(
    private store: Store,
    private router: Router,
    private route: ActivatedRoute,
    private actions$: Actions,
    private statePersistingService: StatePersistingService
  ) {
    super();
  }

  ngOnInit(): void {
    this.store.dispatch(ITSystemActions.getITSystemCollectionPermissions());

    const existingColumns = this.statePersistingService.get<GridColumn[]>(CATALOG_COLUMNS_ID);
    if (existingColumns) {
      this.store.dispatch(ITSystemActions.updateGridColumns(existingColumns));
    } else {
      this.store.dispatch(ITSystemActions.updateGridColumns(this.gridColumns));
    }

    this.gridState$.pipe(first()).subscribe((gridState) => this.stateChange(gridState));

    this.subscriptions.add(
      this.actions$
        .pipe(ofType(ITSystemActions.createItSystemSuccess), combineLatestWith(this.gridState$))
        .subscribe(([_, gridState]) => {
          this.stateChange(gridState);
        })
    );
  }

  public stateChange(gridState: GridState) {
    this.store.dispatch(ITSystemActions.updateGridState(gridState));
  }

  public rowIdSelect(rowId: string) {
    this.router.navigate([rowId], { relativeTo: this.route });
  }
}
