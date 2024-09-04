import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { CellClickEvent } from '@progress/kendo-angular-grid';
import { combineLatestWith, first } from 'rxjs';
import { BaseOverviewComponent } from 'src/app/shared/base/base-overview.component';
import { getColumnsToShow } from 'src/app/shared/helpers/grid-config-helper';
import { GridColumn } from 'src/app/shared/models/grid-column.model';
import { GridState } from 'src/app/shared/models/grid-state.model';
import { archiveDutyChoiceOptions } from 'src/app/shared/models/it-system-usage/archive-duty-choice.model';
import { dataSensitivityLevelOptions } from 'src/app/shared/models/it-system-usage/gdpr/data-sensitivity-level.model';
import { hostedAtOptionsGrid } from 'src/app/shared/models/it-system-usage/gdpr/hosted-at.model';
import { lifeCycleStatusOptions } from 'src/app/shared/models/life-cycle-status.model';
import { yesNoIrrelevantOptionsGrid } from 'src/app/shared/models/yes-no-irrelevant.model';
import {
  ARCHIVE_SECTION_NAME,
  CONTRACT_SECTION_NAME,
  DATA_PROCESSING_SECTION_NAME,
  GDPR_SECTION_NAME,
  LOCAL_REFERENCES_SECTION_NAME,
  ORGANISATION_SECTION_NAME,
  RELATIONS_SECTION_NAME,
  USAGE_COLUMNS_ID,
  USAGE_SECTION_NAME,
} from 'src/app/shared/persistent-state-constants';
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
import { UserActions } from 'src/app/store/user-store/actions';
import { selectGridConfigModificationPermission, selectOrganizationName } from 'src/app/store/user-store/selectors';

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

  public readonly hasConfigModificationPermissions$ = this.store.select(selectGridConfigModificationPermission);

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
      persistId: 'isActive',
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
      persistId: 'isActiveAccordingToLifeCycle',
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
      persistId: 'contract',
    },
    {
      field: 'LocalSystemId',
      title: $localize`Lokal System ID`,
      section: this.systemSectionName,
      hidden: true,
      persistId: 'localid',
    },
    {
      field: 'ItSystemUuid',
      title: $localize`IT-System (UUID)`,
      section: this.systemSectionName,
      width: 320,
      hidden: true,
      persistId: 'uuid',
    },
    {
      field: 'SystemDescription',
      title: $localize`IT-System (Beskrivelse)`,
      section: this.systemSectionName,
      width: 320,
      hidden: true,
      persistId: 'MISSING',
    },
    {
      field: 'ExternalSystemUuid',
      title: $localize`IT-System (Externt UUID)`,
      section: this.systemSectionName,
      width: 320,
      hidden: true,
      persistId: 'externaluuid',
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
      persistId: 'parentsysname',
    },
    {
      field: 'SystemName',
      title: $localize`IT System`,
      section: this.systemSectionName,
      style: 'primary',
      hidden: false,
      persistId: 'sysname',
      required: true,
    },
    {
      field: 'Version',
      title: $localize`Version`,
      section: this.systemSectionName,
      hidden: true,
      persistId: 'version',
    },
    {
      field: 'LocalCallName',
      title: $localize`Lokal kaldenavn`,
      section: this.systemSectionName,
      hidden: true,
      persistId: 'localname',
    },
    {
      field: 'ResponsibleOrganizationUnitName',
      title: $localize`Ansv. organisationsenhed`,
      section: ORGANISATION_SECTION_NAME,
      extraFilter: 'organization-unit',
      width: 350,
      hidden: false,
      persistId: 'orgunit',
    },
    {
      field: 'SystemPreviousName',
      title: $localize`Tidligere systemnavn`,
      section: this.systemSectionName,
      width: 350,
      hidden: false,
      persistId: 'previousname',
    },
    {
      field: 'ItSystemBusinessTypeUuid',
      dataField: 'ItSystemBusinessTypeName',
      title: $localize`Forretningstype`,
      section: this.systemSectionName,
      extraData: 'it-system_business-type',
      extraFilter: 'choice-type',
      style: 'uuid-to-name',
      hidden: false,
      persistId: 'busitype',
    },
    { field: 'ItSystemKLEIdsAsCsv', title: $localize`KLE ID`, section: this.systemSectionName, hidden: true },
    {
      field: 'ItSystemKLENamesAsCsv',
      title: $localize`KLE navn`,
      section: this.systemSectionName,
      hidden: false,
      persistId: 'taskkey',
    },
    {
      field: 'LocalReferenceTitle',
      idField: 'LocalReferenceUrl',
      title: $localize`Lokal Reference`,
      section: LOCAL_REFERENCES_SECTION_NAME,
      style: 'title-link',
      hidden: false,
      persistId: 'ReferenceId',
    },
    {
      field: 'LocalReferenceDocumentId',
      title: $localize`Dokument ID / Sagsnr.`,
      section: LOCAL_REFERENCES_SECTION_NAME,
      width: 300,
      hidden: true,
      persistId: 'folderref',
    },
    {
      field: 'SensitiveDataLevelsAsCsv',
      title: $localize`DataType`,
      section: GDPR_SECTION_NAME,
      extraFilter: 'enum',
      extraData: dataSensitivityLevelOptions,
      width: 320,
      hidden: false,
      persistId: 'dataLevel',
    },
    {
      field: 'MainContractSupplierName',
      title: $localize`Leverandør`,
      section: this.systemSectionName,
      hidden: false,
      persistId: 'supplier',
    },
    {
      field: 'ItSystemRightsHolderName',
      title: $localize`Rettighedshaver`,
      section: this.systemSectionName,
      hidden: false,
      persistId: 'belongsto',
    },
    {
      field: 'ObjectOwnerName',
      title: $localize`Taget i anvendelse af`,
      section: this.systemSectionName,
      width: 280,
      hidden: true,
      persistId: 'ownername',
    },
    {
      field: 'LastChangedByName',
      title: $localize`Sidst redigeret: Bruger`,
      section: this.systemSectionName,
      width: 320,
      hidden: true,
      persistId: 'lastchangedname',
    },
    {
      field: 'LastChangedAt',
      title: $localize`Sidst redigeret: Dato`,
      section: this.systemSectionName,
      style: 'date',
      filter: 'date',
      width: 350,
      hidden: true,
      persistId: 'changed',
    },
    {
      field: 'Concluded',
      title: $localize`Ibrugtagningsdato`,
      section: this.systemSectionName,
      style: 'date',
      filter: 'date',
      width: 350,
      hidden: false,
      persistId: 'concludedSystemFrom',
    },
    {
      field: 'ExpirationDate',
      title: $localize`Slutdato for anvendelse`,
      section: this.systemSectionName,
      style: 'date',
      filter: 'date',
      width: 350,
      hidden: false,
      persistId: 'systemExpirationDate',
    },
    {
      field: 'LifeCycleStatus',
      title: $localize`Livscyklus`,
      section: this.systemSectionName,
      style: 'enum',
      extraFilter: 'enum',
      extraData: lifeCycleStatusOptions,
      hidden: false,
      persistId: 'LifeCycleStatus',
    },
    {
      field: 'ArchiveDuty',
      title: $localize`Arkiveringspligt`,
      section: ARCHIVE_SECTION_NAME,
      style: 'enum',
      extraFilter: 'enum',
      extraData: archiveDutyChoiceOptions,
      hidden: false,
      persistId: 'ArchiveDuty',
    },
    {
      field: 'IsHoldingDocument',
      title: $localize`Er dokumentbærende`,
      section: ARCHIVE_SECTION_NAME,
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
      persistId: 'Registertype',
    },
    {
      field: 'ActiveArchivePeriodEndDate',
      title: $localize`Journalperiode slutdato`,
      section: ARCHIVE_SECTION_NAME,
      style: 'date',
      noFilter: true,
      width: 350,
      hidden: true,
      persistId: 'ArchivePeriodsEndDate',
    },
    {
      field: 'RiskSupervisionDocumentationName',
      title: $localize`Risikovurdering`,
      idField: 'RiskSupervisionDocumentationUrl',
      section: GDPR_SECTION_NAME,
      style: 'title-link',
      hidden: true,
      persistId: 'riskSupervisionDocumentationUrlName',
    },
    {
      field: 'LinkToDirectoryName',
      title: $localize`Fortegnelse`,
      section: GDPR_SECTION_NAME,
      idField: 'LinkToDirectoryUrl',
      style: 'title-link',
      hidden: true,
      persistId: 'LinkToDirectoryUrlName',
    },
    {
      field: 'HostedAt',
      title: $localize`IT systemet driftes`,
      section: this.systemSectionName,
      style: 'enum',
      extraFilter: 'enum',
      extraData: hostedAtOptionsGrid,
      hidden: false,
      persistId: 'HostedAt',
    },
    {
      field: 'GeneralPurpose',
      title: $localize`Systemets overordnede formål`,
      section: GDPR_SECTION_NAME,
      width: 390,
      hidden: false,
      persistId: 'GeneralPurpose',
    },
    {
      field: 'DataProcessingRegistrationsConcludedAsCsv',
      title: $localize`Databehandleraftale er indgået`,
      section: DATA_PROCESSING_SECTION_NAME,
      style: 'enum',
      extraFilter: 'enum',
      width: 360,
      extraData: yesNoIrrelevantOptionsGrid,
      hidden: true,
      persistId: 'dataProcessingAgreementConcluded',
    },
    {
      field: 'DataProcessingRegistrationNamesAsCsv',
      title: $localize`Databehandling`,
      section: DATA_PROCESSING_SECTION_NAME,
      style: 'page-link-array',
      entityType: 'data-processing-registration',
      dataField: 'DataProcessingRegistrations',
      hidden: true,
      persistId: 'dataProcessingRegistrations',
    },
    {
      field: 'OutgoingRelatedItSystemUsagesNamesAsCsv',
      title: $localize`Anvendte systemer`,
      section: RELATIONS_SECTION_NAME,
      style: 'page-link-array',
      entityType: 'it-system-usage',
      dataField: 'OutgoingRelatedItSystemUsages',
      hidden: true,
      persistId: 'outgoingRelatedItSystemUsages',
    },
    {
      field: 'DependsOnInterfacesNamesAsCsv',
      title: $localize`Anvendte snitflader`,
      section: RELATIONS_SECTION_NAME,
      style: 'page-link-array',
      entityType: 'it-interface',
      dataField: 'DependsOnInterfaces',
      hidden: true,
      persistId: 'dependsOnInterfaces',
    },
    {
      field: 'IncomingRelatedItSystemUsagesNamesAsCsv',
      title: $localize`Systemer der anvender systemet`,
      section: RELATIONS_SECTION_NAME,
      style: 'page-link-array',
      entityType: 'it-system-usage',
      dataField: 'IncomingRelatedItSystemUsages',
      hidden: true,
      persistId: 'incomingRelatedItSystemUsages',
    },
    {
      field: 'AssociatedContractsNamesCsv',
      title: $localize`IT Kontrakter`,
      section: CONTRACT_SECTION_NAME,
      style: 'page-link-array',
      entityType: 'it-contract',
      dataField: 'AssociatedContracts',
      hidden: true,
      persistId: 'itContracts',
    },
    {
      field: 'RiskAssessmentDate',
      title: $localize`Dato for seneste risikovurdering`,
      section: GDPR_SECTION_NAME,
      style: 'date',
      filter: 'date',
      width: 350,
      hidden: false,
      persistId: 'RiskAssessmentDate',
    },
    {
      field: 'PlannedRiskAssessmentDate',
      title: $localize`Dato for planlagt risikovurdering`,
      section: GDPR_SECTION_NAME,
      style: 'date',
      filter: 'date',
      width: 350,
      hidden: false,
      persistId: 'PlannedRiskAssessmentDate',
    },
    { field: 'Note', title: $localize`Note`, section: this.systemSectionName, hidden: false, persistId: 'note' },
  ];

  constructor(
    store: Store,
    private router: Router,
    private route: ActivatedRoute,
    private statePersistingService: StatePersistingService,
    private actions$: Actions
  ) {
    super(store, 'it-system-usage');
  }

  ngOnInit() {
    this.store.dispatch(UserActions.getUserGridPermissions());
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

    this.actions$
      .pipe(ofType(ITSystemUsageActions.resetToOrganizationITSystemUsageColumnConfigurationError))
      .subscribe(() => {
        this.gridColumns$.pipe(first()).subscribe((columns) => {
          const columnsToShow = getColumnsToShow(columns, this.defaultGridColumns);
          this.store.dispatch(ITSystemUsageActions.updateGridColumns(columnsToShow));
        });
      });
  }

  public stateChange(gridState: GridState) {
    this.store.dispatch(ITSystemUsageActions.updateGridState(gridState));
  }
  override rowIdSelect(event: CellClickEvent) {
    super.rowIdSelect(event, this.router, this.route);
  }
}
