import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { CellClickEvent } from '@progress/kendo-angular-grid';
import { combineLatestWith, first } from 'rxjs';
import { BaseOverviewComponent } from 'src/app/shared/base/base-overview.component';
import { GridColumn } from 'src/app/shared/models/grid-column.model';
import { GridState } from 'src/app/shared/models/grid-state.model';
import { archiveDutyChoiceOptions } from 'src/app/shared/models/it-system-usage/archive-duty-choice.model';
import { dataSensitivityLevelOptions } from 'src/app/shared/models/it-system-usage/gdpr/data-sensitivity-level.model';
import { hostedAtOptionsGrid } from 'src/app/shared/models/it-system-usage/gdpr/hosted-at.model';
import { lifeCycleStatusOptions } from 'src/app/shared/models/life-cycle-status.model';
import { yesNoIrrelevantOptionsGrid } from 'src/app/shared/models/yes-no-irrelevant.model';
import { USAGE_COLUMNS_ID, USAGE_SECTION_NAME } from 'src/app/shared/persistent-state-constants';
import { StatePersistingService } from 'src/app/shared/services/state-persisting.service';
import { ITSystemUsageActions } from 'src/app/store/it-system-usage/actions';
import {
  selectGridData,
  selectGridRoleColumns,
  selectGridState,
  selectIsLoading,
  selectITSystemUsageHasCreateCollectionPermission,
  selectUsageGridColumns,
} from 'src/app/store/it-system-usage/selectors';
import { selectOrganizationName } from 'src/app/store/user-store/selectors';

@Component({
  templateUrl: 'it-system-usages.component.html',
  styleUrls: ['it-system-usages.component.scss'],
})
export class ITSystemUsagesComponent extends BaseOverviewComponent implements OnInit {
  public readonly isLoading$ = this.store.select(selectIsLoading);
  public readonly gridData$ = this.store.select(selectGridData);
  public readonly gridState$ = this.store.select(selectGridState);
  public readonly gridColumns$ = this.store.select(selectUsageGridColumns);

  public readonly organizationName$ = this.store.select(selectOrganizationName);
  public readonly hasCreatePermission$ = this.store.select(selectITSystemUsageHasCreateCollectionPermission);

  private readonly systemSectionName = USAGE_SECTION_NAME;

  //mock subscription, remove once working on the Usage overview task
  public readonly defaultGridColumns: GridColumn[] = [
    {
      field: 'ActiveAccordingToValidityPeriod',
      title: $localize`Status (Datofelter)`,
      section: this.systemSectionName,
      filter: 'boolean',
      extraData: [
        {
          name: $localize`Aktivt`,
          value: true,
        },
        {
          name: $localize`Ikke aktivt`,
          value: false,
        },
      ],
      entityType: 'it-system-usage',
      style: 'chip',
      hidden: false,
    },
    {
      field: 'ActiveAccordingToLifeCycle',
      title: $localize`Status (Livscyklus)`,
      section: this.systemSectionName,
      filter: 'boolean',
      extraData: [
        {
          name: $localize`Aktivt`,
          value: true,
        },
        {
          name: $localize`Ikke aktivt`,
          value: false,
        },
      ],
      entityType: 'it-system-usage',
      style: 'chip',
      hidden: false,
    },
    {
      field: 'MainContractIsActive',
      title: $localize`Status (Markeret kontrakt)`,
      section: this.systemSectionName,
      filter: 'boolean',
      extraData: [
        {
          name: $localize`Aktivt`,
          value: true,
        },
        {
          name: $localize`Ikke aktivt`,
          value: false,
        },
      ],
      entityType: 'it-system-usage',
      style: 'chip',
      width: 340,
      hidden: false,
    },
    { field: 'LocalSystemId', title: $localize`Lokal System ID`, section: this.systemSectionName, hidden: true },
    {
      field: 'ItSystemUuid',
      title: $localize`IT-System (UUID)`,
      section: this.systemSectionName,
      width: 320,
      hidden: true,
    },
    {
      field: 'ExternalSystemUuid',
      title: $localize`IT-System (Externt UUID)`,
      section: this.systemSectionName,
      width: 320,
      hidden: true,
    },
    {
      field: 'ParentItSystemName',
      title: $localize`Overordnet IT System`,
      idField: 'ParentItSystemUuid',
      section: this.systemSectionName,
      style: 'page-link',
      entityType: 'it-system',
      width: 320,
      hidden: true,
    },
    {
      field: 'SystemName',
      title: $localize`IT System`,
      section: this.systemSectionName,
      style: 'primary',
      hidden: false,
    },
    { field: 'Version', title: $localize`Version`, section: this.systemSectionName, hidden: true },
    { field: 'LocalCallName', title: $localize`Lokal kaldenavn`, section: this.systemSectionName, hidden: true },
    {
      field: 'ResponsibleOrganizationUnitName',
      title: $localize`Ansv. organisationsenhed`,
      section: this.systemSectionName,
      extraFilter: 'organization-unit',
      width: 350,
      hidden: false,
    },
    {
      field: 'SystemPreviousName',
      title: $localize`Tidligere systemnavn`,
      section: this.systemSectionName,
      width: 350,
      hidden: false,
    },
    //Role columns
    {
      field: 'ItSystemBusinessTypeUuid',
      dataField: 'ItSystemBusinessTypeName',
      title: $localize`Forretningstype`,
      section: this.systemSectionName,
      extraData: 'it-system_business-type',
      extraFilter: 'choice-type',
      style: 'uuid-to-name',
      hidden: false,
    },
    { field: 'ItSystemKLEIdsAsCsv', title: $localize`KLE ID`, section: this.systemSectionName, hidden: true },
    {
      field: 'ItSystemKLENamesAsCsv',
      title: $localize`KLE navn`,
      section: this.systemSectionName,
      hidden: false,
    },
    {
      field: 'LocalReferenceTitle',
      idField: 'LocalReferenceUrl',
      title: $localize`Lokal Reference`,
      section: this.systemSectionName,
      style: 'title-link',
      hidden: false,
    },
    {
      field: 'LocalReferenceDocumentId',
      title: $localize`Dokument ID / Sagsnr.`,
      section: this.systemSectionName,
      width: 300,
      hidden: true,
    },
    {
      field: 'SensitiveDataLevelsAsCsv',
      title: $localize`DataType`,
      section: this.systemSectionName,
      extraFilter: 'enum',
      extraData: dataSensitivityLevelOptions,
      width: 320,
      hidden: false,
    },
    { field: 'MainContractSupplierName', title: $localize`Leverandør`, section: this.systemSectionName, hidden: false },
    {
      field: 'ItSystemRightsHolderName',
      title: $localize`Rettighedshaver`,
      section: this.systemSectionName,
      hidden: false,
    },
    {
      field: 'ObjectOwnerName',
      title: $localize`Taget i anvendelse af`,
      section: this.systemSectionName,
      width: 280,
      hidden: true,
    },
    {
      field: 'LastChangedByName',
      title: $localize`Sidst redigeret: Bruger`,
      section: this.systemSectionName,
      width: 320,
      hidden: true,
    },
    {
      field: 'LastChangedAt',
      title: $localize`Sidst redigeret: Dato`,
      section: this.systemSectionName,
      style: 'date',
      filter: 'date',
      width: 350,
      hidden: true,
    },
    {
      field: 'Concluded',
      title: $localize`Ibrugtagningsdato`,
      section: this.systemSectionName,
      style: 'date',
      filter: 'date',
      width: 350,
      hidden: false,
    },
    {
      field: 'ExpirationDate',
      title: $localize`Slutdato for anvendelse`,
      section: this.systemSectionName,
      style: 'date',
      filter: 'date',
      width: 350,
      hidden: false,
    },
    {
      field: 'LifeCycleStatus',
      title: $localize`Livscyklus`,
      section: this.systemSectionName,
      style: 'enum',
      extraFilter: 'enum',
      extraData: lifeCycleStatusOptions,
      hidden: false,
    },
    {
      field: 'ArchiveDuty',
      title: $localize`Arkiveringspligt`,
      section: this.systemSectionName,
      style: 'enum',
      extraFilter: 'enum',
      extraData: archiveDutyChoiceOptions,
      hidden: false,
    },
    {
      field: 'IsHoldingDocument',
      title: $localize`Er dokumentbærende`,
      section: this.systemSectionName,
      filter: 'boolean',
      extraData: [
        {
          name: $localize`Ja`,
          value: true,
        },
        {
          name: $localize`Nej`,
          value: false,
        },
      ],
      entityType: 'it-system-usage',
      style: 'chip',
      hidden: false,
    },
    {
      field: 'ActiveArchivePeriodEndDate',
      title: $localize`Journalperiode slutdato`,
      section: this.systemSectionName,
      style: 'date',
      noFilter: true,
      width: 350,
      hidden: true,
    },
    {
      field: 'RiskSupervisionDocumentationName',
      title: $localize`Risikovurdering`,
      idField: 'RiskSupervisionDocumentationUrl',
      section: this.systemSectionName,
      style: 'title-link',
      hidden: true,
    },
    {
      field: 'LinkToDirectoryName',
      title: $localize`Fortegnelse`,
      section: this.systemSectionName,
      idField: 'LinkToDirectoryUrl',
      style: 'title-link',
      hidden: true,
    },
    {
      field: 'HostedAt',
      title: $localize`IT systemet driftes`,
      section: this.systemSectionName,
      style: 'enum',
      extraFilter: 'enum',
      extraData: hostedAtOptionsGrid,
      hidden: false,
    },
    {
      field: 'GeneralPurpose',
      title: $localize`Systemets overordnede formål`,
      section: this.systemSectionName,
      width: 390,
      hidden: false,
    },
    {
      field: 'DataProcessingRegistrationsConcludedAsCsv',
      title: $localize`Databehandleraftale er indgået`,
      section: this.systemSectionName,
      style: 'enum',
      extraFilter: 'enum',
      width: 360,
      extraData: yesNoIrrelevantOptionsGrid,
      hidden: true,
    },
    {
      field: 'DataProcessingRegistrationNamesAsCsv',
      title: $localize`Databehandling`,
      section: this.systemSectionName,
      style: 'page-link-array',
      entityType: 'data-processing-registration',
      dataField: 'DataProcessingRegistrations',
      hidden: true,
    },
    {
      field: 'OutgoingRelatedItSystemUsagesNamesAsCsv',
      title: $localize`Anvendte systemer`,
      section: this.systemSectionName,
      style: 'page-link-array',
      entityType: 'it-system-usage',
      dataField: 'OutgoingRelatedItSystemUsages',
      hidden: true,
    },
    {
      field: 'DependsOnInterfacesNamesAsCsv',
      title: $localize`Anvendte snitflader`,
      section: this.systemSectionName,
      style: 'page-link-array',
      entityType: 'it-interface',
      dataField: 'DependsOnInterfaces',
      hidden: true,
    },
    {
      field: 'IncomingRelatedItSystemUsagesNamesAsCsv',
      title: $localize`Systemer der anvender systemet`,
      section: this.systemSectionName,
      style: 'page-link-array',
      entityType: 'it-system-usage',
      dataField: 'IncomingRelatedItSystemUsages',
      hidden: true,
    },
    {
      field: 'AssociatedContractsNamesCsv',
      title: $localize`IT Kontrakter`,
      section: this.systemSectionName,
      style: 'page-link-array',
      entityType: 'it-contract',
      dataField: 'AssociatedContracts',
      hidden: true,
    },
    {
      field: 'RiskAssessmentDate',
      title: $localize`Dato for seneste risikovurdering`,
      section: this.systemSectionName,
      style: 'date',
      filter: 'date',
      width: 350,
      hidden: false,
    },
    {
      field: 'PlannedRiskAssessmentDate',
      title: $localize`Dato for planlagt risikovurdering`,
      section: this.systemSectionName,
      style: 'date',
      filter: 'date',
      width: 350,
      hidden: false,
    },
    { field: 'Note', title: $localize`Note`, section: this.systemSectionName, hidden: false },
  ];

  constructor(store: Store,
    private router: Router,
    private route: ActivatedRoute,
    private statePersistingService: StatePersistingService,
    private actions$: Actions
  ) {
    super(store);
  }

  ngOnInit() {
    const existingColumns = this.statePersistingService.get<GridColumn[]>(USAGE_COLUMNS_ID);
    this.store.dispatch(ITSystemUsageActions.getItSystemUsageOverviewRoles());
    if (existingColumns) {
      this.store.dispatch(ITSystemUsageActions.updateGridColumns(existingColumns));
    } else {
      this.subscriptions.add(
        this.actions$
          .pipe(
            ofType(ITSystemUsageActions.getItSystemUsageOverviewRolesSuccess),
            combineLatestWith(this.store.select(selectGridRoleColumns)),
            first()
          )
          .subscribe(([_, gridRoleColumns]) => {
            this.store.dispatch(
              ITSystemUsageActions.updateGridColumnsAndRoleColumns(this.defaultGridColumns, gridRoleColumns)
            );
          })
      );

      this.updateUnclickableColumns(this.defaultGridColumns);
      this.subscriptions.add(this.gridColumns$.subscribe((columns) => this.updateUnclickableColumns(columns)));
    }
    this.gridState$.pipe(first()).subscribe((gridState) => this.stateChange(gridState));
  }

  public stateChange(gridState: GridState) {
    this.store.dispatch(ITSystemUsageActions.updateGridState(gridState));
  }
  override rowIdSelect(event: CellClickEvent) {
    super.rowIdSelect(event, this.router, this.route);
  }
}
