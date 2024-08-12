import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { combineLatestWith, first } from 'rxjs';
import { BaseComponent } from 'src/app/shared/base/base.component';
import { isAgreementConcludedOptions } from 'src/app/shared/models/data-processing/is-agreement-concluded.model';
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
  private readonly activeOptions = [
    {
      name: $localize`Aktiv`,
      value: true,
    },
    {
      name: $localize`Ikke aktiv`,
      value: false,
    },
  ];

  public readonly defaultGridColumns: GridColumn[] = [
    {
      field: 'name',
      title: $localize`Databehandling`,
      section: $localize`Databehandling`,
      style: 'primary',
      hidden: false,
    },
    {
      field: 'isActive',
      title: $localize`Databehandling status`,
      section: $localize`Databehandling`,
      filter: 'boolean',
      extraData: this.activeOptions,
      entityType: 'data-processing-registration',
      style: 'chip',
      width: 340,
      hidden: true,
    },
    {
      field: 'lastChangedById',
      title: $localize`Sidst ændret ID`,
      section: $localize`Databehandling`,
      filter: 'numeric',
      hidden: true,
    },
    {
      field: 'lastChangedAt',
      title: $localize`Sidst ændret dato`,
      section: $localize`Databehandling`,
      filter: 'date',
      hidden: true,
    },
    {
      field: 'activeAccordingToMainContract',
      title: $localize`Status (Markeret kontrakt)`,
      section: $localize`Databehandling`,
      filter: 'boolean',
      extraData: this.activeOptions,
      entityType: 'data-processing-registration',
      style: 'chip',
      width: 340,
      hidden: true,
    },
    {
      field: 'mainReferenceTitle',
      title: $localize`Reference`,
      section: $localize`Databehandling`,
      hidden: true,
    },
    {
      field: 'mainReferenceUserAssignedId',
      title: $localize`Dokument ID / Sagsnr.`,
      section: $localize`Databehandling`,
      hidden: true,
    },
    {
      field: 'systemNamesAsCsv',
      title: $localize`IT Systemer`,
      section: $localize`Databehandling`,
      hidden: false,
    },
    {
      field: 'systemUuidsAsCsv',
      title: $localize`IT Systemer (UUID)`,
      section: $localize`Databehandling`,
      hidden: true,
    },
    {
      field: 'dataProcessorNamesAsCsv',
      title: $localize`Databehandlere`,
      section: $localize`Databehandling`,
      hidden: false,
    },
    {
      field: 'subDataProcessorNamesAsCsv',
      title: $localize`Underdatabehandlere`,
      section: $localize`Databehandling`,
      hidden: true,
    },
    {
      field: 'transferToInsecureThirdCountries',
      title: $localize`Overførsel til usikkert 3. land`,
      section: $localize`Databehandling`,
      hidden: true,
      style: 'enum',
      extraData: transferToInsecureThirdCountriesOptions,
      extraFilter: 'enum',
      width: 340,
    },
    {
      field: 'basisForTransfer',
      title: $localize`Overførselsgrundlag`,
      section: $localize`Databehandling`,
      extraFilter: 'choice-type',
      extraData: 'data-processing-basis-for-transfer-types',
      hidden: true,
    },
    {
      field: 'dataResponsible',
      title: $localize`Dataansvarlig`,
      section: $localize`Databehandling`,
      extraFilter: 'choice-type',
      extraData: 'data-processing-data-responsible-types',
      hidden: true,
    },
    {
      field: 'isAgreementConcluded',
      title: $localize`Databehandleraftale er indgået`,
      section: $localize`Databehandling`,
      style: 'enum',
      extraFilter: 'enum',
      extraData: isAgreementConcludedOptions,
      hidden: true,
    },
    {
      field: 'agreementConcludedAt',
      title: $localize`Dato for indgåelse af databehandleraftale`,
      section: $localize`Databehandling`,
      filter: 'date',
      style: 'date',
      hidden: true,
    },
    {
      field: 'oversightInterval',
      title: $localize`Tilsynsinterval`,
      section: $localize`Databehandling`,
      hidden: true,
      extraFilter: 'enum',
      style: 'enum',
      extraData: oversightIntervalOptions,
    },
    {
      field: 'oversightOptionNamesAsCsv',
      title: $localize`Tilsynsmuligheder`,
      section: $localize`Databehandling`,
      hidden: true,
      extraFilter: 'choice-type',
      extraData: 'data-processing-oversight-option-types',
    },
    {
      field: 'isOversightCompleted',
      title: $localize`Gennemført tilsyn`,
      section: $localize`Databehandling`,
      hidden: true,
      extraFilter: 'enum',
      extraData: isOversightCompletedOptions,
    },
    {
      field: 'oversightScheduledInspectionDate',
      title: $localize`Kommende planlagt tilsyn`,
      section: $localize`Databehandling`,
      hidden: true,
    },
    {
      field: 'latestOversightDate',
      title: $localize`Seneste tilsyn`,
      section: $localize`Databehandling`,
      hidden: true,
    },
    {
      field: 'lastChangedByName',
      title: $localize`Sidst ændret bruger`,
      section: $localize`Databehandling`,
      hidden: true,
    },
    {
      field: 'contractNamesAsCsv',
      title: $localize`IT Kontrakter`,
      section: $localize`Databehandling`,
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
