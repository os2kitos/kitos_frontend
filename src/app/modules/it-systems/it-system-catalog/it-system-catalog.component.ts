import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { CellClickEvent } from '@progress/kendo-angular-grid';
import { combineLatestWith, first } from 'rxjs';
import { BaseOverviewComponent } from 'src/app/shared/base/base-overview.component';
import { DEFAULT_UNCLICKABLE_GRID_COLUMNS } from 'src/app/shared/constants';
import { accessModifierOptions } from 'src/app/shared/models/access-modifier.model';
import { GridColumn } from 'src/app/shared/models/grid-column.model';
import { GridState } from 'src/app/shared/models/grid-state.model';
import { archiveDutyRecommendationChoiceOptions } from 'src/app/shared/models/it-system/archive-duty-recommendation-choice.model';
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
export class ItSystemCatalogComponent extends BaseOverviewComponent implements OnInit {
  public readonly isLoading$ = this.store.select(selectSystemGridLoading);
  public readonly gridData$ = this.store.select(selectSystemGridData);
  public readonly gridState$ = this.store.select(selectSystemGridState);
  public readonly gridColumns$ = this.store.select(selectSystemGridColumns);

  public readonly hasCreatePermission$ = this.store.select(selectITSystemHasCreateCollectionPermission);

  public readonly gridColumns: GridColumn[] = [
    {
      field: 'IsInUse',
      idField: 'Uuid',
      title: $localize`Anvendes`,
      width: 100,
      section: 'IT Systemer',
      noFilter: true,
      hidden: false,
      style: 'checkbox',
      permissionsField: 'CanChangeUsageStatus',
    },
    { field: 'Parent.Name', title: $localize`Overordnet IT System`, section: 'IT Systemer', width: 320, hidden: true },
    {
      field: 'PreviousName',
      title: $localize`Tidligere Systemnavn`,
      section: 'IT Systemer',
      width: 320,
      hidden: false,
    },
    {
      field: 'Name',
      title: $localize`IT systemnavn`,
      section: 'IT Systemer',
      style: 'primary',
      hidden: false,
      required: true,
    },
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
      field: 'BusinessType.Name',
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
      hidden: true,
    },
    {
      field: 'LastChangedByUser.Name',
      title: $localize`Sidst redigeret: Bruger`,
      section: 'IT Systemer',
      hidden: true,
    },
    {
      field: 'LastChanged',
      title: $localize`Sidst redigeret`,
      section: 'IT Systemer',
      width: 350,
      filter: 'date',
      style: 'date',
      hidden: false,
    },
    {
      field: 'Reference.Title',
      title: $localize`Reference`,
      section: 'IT Systemer',
      idField: 'Reference.URL',
      style: 'title-link',
      hidden: false,
    },
    { field: 'Uuid', title: $localize`UUID`, section: 'IT Systemer', hidden: true, width: 320 },
    { field: 'Description', title: $localize`Beskrivelse`, section: 'IT Systemer', hidden: true },
    {
      field: 'ArchiveDuty',
      title: $localize`Rigsarkivets vejledning til arkivering`,
      section: 'Rigsarkivet',
      extraFilter: 'enum',
      style: 'enum',
      filterData: archiveDutyRecommendationChoiceOptions,
      hidden: true,
      width: 360,
    },
    {
      field: 'ArchiveDutyComment',
      title: $localize`Bemærkning fra Rigsarkivet`,
      section: 'Rigsarkivet',
      hidden: true,
    },
  ];

  private readonly unclickableColumnStyles = DEFAULT_UNCLICKABLE_GRID_COLUMNS;

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

    this.gridColumns.forEach((column) => {
      if (column.style && this.unclickableColumnStyles.includes(column.style)) {
        this.unclickableColumnsTitles.push(column.title);
      }
    });
  }

  public stateChange(gridState: GridState) {
    this.store.dispatch(ITSystemActions.updateGridState(gridState));
  }
  override rowIdSelect(event: CellClickEvent) {
    super.rowIdSelect(event, this.router, this.route);
  }
}
