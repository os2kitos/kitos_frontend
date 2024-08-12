import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { combineLatestWith, first } from 'rxjs';
import { BaseComponent } from 'src/app/shared/base/base.component';
import { isOversightCompletedOptions } from 'src/app/shared/models/data-processing/is-oversight-completed.model';
import { oversightIntervalOptions } from 'src/app/shared/models/data-processing/oversight-interval.model';
import { transferToInsecureThirdCountriesOptions } from 'src/app/shared/models/data-processing/transfer-to-insecure-third-countries.model';
import { GridColumn } from 'src/app/shared/models/grid-column.model';
import { GridState } from 'src/app/shared/models/grid-state.model';
import { DATA_PROCESSING_COLUMNS_ID } from 'src/app/shared/persistent-state-constants';
import { StatePersistingService } from 'src/app/shared/services/state-persisting.service';
import { DataProcessingActions } from 'src/app/store/data-processing/actions';
import {
  selectDataProcessingGridColumns,
  selectDataProcessingGridData,
  selectDataProcessingGridLoading,
  selectDataProcessingGridState,
  selectDataProcessingHasCreateCollectionPermissions,
} from 'src/app/store/data-processing/selectors';

@Component({
  selector: 'app-data-processing-overview',
  templateUrl: './data-processing-overview.component.html',
  styleUrl: './data-processing-overview.component.scss',
})
export class DataProcessingOverviewComponent extends BaseComponent implements OnInit {
  public readonly isLoading$ = this.store.select(selectDataProcessingGridLoading);
  public readonly gridData$ = this.store.select(selectDataProcessingGridData);
  public readonly gridState$ = this.store.select(selectDataProcessingGridState);
  public readonly gridColumns$ = this.store.select(selectDataProcessingGridColumns);

  public readonly hasCreatePermission$ = this.store.select(selectDataProcessingHasCreateCollectionPermissions);

  public readonly defaultGridColumns: GridColumn[] = [
    {
      field: 'name',
      title: $localize`Databehandling`,
      section: 'Databehandling',
      style: 'primary',
      hidden: false,
    },
    {
      field: 'disabled',
      title: $localize`Databehandling status`,
      section: 'Databehandling',
      filter: 'boolean',
      style: 'chip',
      hidden: false,
    },
    {
      field: 'lastChangedById',
      title: $localize`Sidst ændret ID`,
      section: 'Databehandling',
      filter: 'numeric',
      hidden: false,
    },
    {
      field: 'lastChangedAt',
      title: $localize`Sidst ændret`,
      section: 'Databehandling',
      filter: 'date',
      hidden: false,
    },
    {
      field: 'activeAccordingToMainContract',
      title: $localize`Status (Markeret kontrakt)`,
      section: 'Databehandling',
      hidden: false,
    },
    {
      field: 'mainReferenceTitle',
      title: $localize`Reference`,
      section: 'Databehandling',
      hidden: false,
    },
    {
      field: 'mainReferenceUserAssignedId',
      title: $localize`Dokument ID / Sagsnr.`,
      section: 'Databehandling',
      hidden: false,
    },
    {
      field: 'systemNamesAsCsv',
      title: $localize`IT Systemer`,
      section: 'Databehandling',
      hidden: false,
    },
    {
      field: 'systemUuidsAsCsv',
      title: $localize`IT Systemer (UUID)`,
      section: 'Databehandling',
      hidden: false,
    },
    {
      field: 'dataProcessorNamesAsCsv',
      title: $localize`Databehandlere`,
      section: 'Databehandling',
      hidden: false,
    },
    {
      field: 'subDataProcessorNamesAsCsv',
      title: $localize`Underdatabehandlere`,
      section: 'Databehandling',
      hidden: false,
    },
    {
      field: 'transferToInsecureThirdCountries',
      title: $localize`Overførsel til usikkert 3. land`,
      section: 'Databehandling',
      hidden: false,
      style: 'enum',
      extraData: transferToInsecureThirdCountriesOptions,
      extraFilter: 'enum'
    },
    {
      field: 'basisForTransfer',
      title: $localize`Overførselsgrundlag`,
      section: 'Databehandling',
      hidden: false,
    },
    {
      field: 'dataResponsible',
      title: $localize`Dataansvarlig`,
      section: 'Databehandling',
      hidden: false,
    },
    {
      field: 'isAgreementConcluded',
      title: $localize`Databehandleraftale er indgået`,
      section: 'Databehandling',
      hidden: false,
    },
    {
      field: 'agreementConcludedAt',
      title: $localize`Dato for indgåelse af databehandleraftale`,
      section: 'Databehandling',
      hidden: false,
    },
    {
      field: 'oversightInterval',
      title: $localize`Tilsynsinterval`,
      section: 'Databehandling',
      hidden: false,
      extraFilter: 'enum',
      extraData: oversightIntervalOptions
    },
    {
      field: 'oversightOptionNamesAsCsv',
      title: $localize`Tilsynsmuligheder`,
      section: 'Databehandling',
      hidden: false,
    },
    {
      field: 'oversightOptionNamesAsCsv',
      title: $localize`Tilsynsmuligheder`,
      section: 'Databehandling',
      hidden: false,
    },
    {
      field: 'isOversightCompleted',
      title: $localize`Gennemført tilsyn`,
      section: 'Databehandling',
      hidden: false,
      extraFilter: 'enum',
      extraData: isOversightCompletedOptions
    },
    {
      field: 'oversightScheduledInspectionDate',
      title: $localize`Kommende planlagt tilsyn`,
      section: 'Databehandling',
      hidden: false,
    },
    {
      field: 'latestOversightDate',
      title: $localize`Seneste tilsyn`,
      section: 'Databehandling',
      hidden: false,
    },
    {
      field: 'lastChangedByName',
      title: $localize`Sidst ændret: Bruger`,
      section: 'Databehandling',
      filter: 'date',
      hidden: false,
    },
    {
      field: 'contractNamesAsCsv',
      title: $localize`IT Kontrakter`,
      section: 'Databehandling',
      hidden: false,
    },
  ];

  constructor(
    private store: Store,
    private router: Router,
    private route: ActivatedRoute,
    private actions$: Actions,
    private statePersistingService: StatePersistingService,
    private dialog: MatDialog
  ) {
    super();
  }

  ngOnInit(): void {
    this.store.dispatch(DataProcessingActions.getDataProcessingCollectionPermissions());
    const localCacheColumns = this.statePersistingService.get<GridColumn[]>(DATA_PROCESSING_COLUMNS_ID);
    if (localCacheColumns) {
      this.store.dispatch(DataProcessingActions.updateGridColumns(localCacheColumns));
    } else {
      this.store.dispatch(DataProcessingActions.updateGridColumns(this.defaultGridColumns));
    }

    this.gridState$.pipe(first()).subscribe((gridState) => this.stateChange(gridState));

    this.subscriptions.add(
      this.actions$
        .pipe(ofType(DataProcessingActions.createDataProcessingSuccess), combineLatestWith(this.gridState$))
        .subscribe(([_, gridState]) => {
          this.stateChange(gridState);
        })
    );
  }

  public stateChange(gridState: GridState) {
    this.store.dispatch(DataProcessingActions.updateGridState(gridState));
  }

  public rowIdSelect(rowId: string) {
    this.router.navigate([rowId], { relativeTo: this.route });
  }
}
