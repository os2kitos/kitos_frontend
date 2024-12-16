import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { CellClickEvent } from '@progress/kendo-angular-grid';
import { combineLatestWith, first } from 'rxjs';
import { BaseOverviewComponent } from 'src/app/shared/base/base-overview.component';
import { BooleanValueDisplayType } from 'src/app/shared/components/status-chip/status-chip.component';
import * as GridFields from 'src/app/shared/constants/it-system-usage-grid-column-constants';
import {
  ARCHIVE_SECTION_NAME,
  CONTRACT_SECTION_NAME,
  DATA_PROCESSING_SECTION_NAME,
  GDPR_SECTION_NAME,
  LOCAL_REFERENCES_SECTION_NAME,
  ORGANIZATION_SECTION_NAME,
  RELATIONS_SECTION_NAME,
  USAGE_COLUMNS_ID,
  USAGE_SECTION_NAME,
} from 'src/app/shared/constants/persistent-state-constants';
import { UIModuleConfigKey } from 'src/app/shared/enums/ui-module-config-key';
import { getColumnsToShow } from 'src/app/shared/helpers/grid-config-helper';
import { GridColumn } from 'src/app/shared/models/grid-column.model';
import { GridState } from 'src/app/shared/models/grid-state.model';
import { archiveDutyChoiceOptions } from 'src/app/shared/models/it-system-usage/archive-duty-choice.model';
import { dataSensitivityLevelOptions } from 'src/app/shared/models/it-system-usage/gdpr/data-sensitivity-level.model';
import { hostedAtOptionsGrid } from 'src/app/shared/models/it-system-usage/gdpr/hosted-at.model';
import { lifeCycleStatusOptions } from 'src/app/shared/models/life-cycle-status.model';
import { yesNoIrrelevantOptionsGrid } from 'src/app/shared/models/yes-no-irrelevant.model';
import { GridColumnStorageService } from 'src/app/shared/services/grid-column-storage-service';
import { GridUIConfigService } from 'src/app/shared/services/ui-config-services/grid-ui-config.service';
import { ITSystemUsageActions } from 'src/app/store/it-system-usage/actions';
import {
  selectGridData,
  selectGridState,
  selectIsLoading,
  selectITSystemUsageHasCreateCollectionPermission,
  selectUsageGridColumns,
  selectUsageGridRoleColumns,
} from 'src/app/store/it-system-usage/selectors';
import {
  selectITSystemUsageEnableFrontPageUsagePeriod,
  selectITSystemUsageEnableGdpr,
  selectITSystemUsageEnableLifeCycleStatus,
} from 'src/app/store/organization/ui-module-customization/selectors';
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
  public readonly uiConfigApplications$ = this.uiConfigService.getUIConfigApplications(UIModuleConfigKey.ItSystemUsage);

  public readonly organizationName$ = this.store.select(selectOrganizationName);
  public readonly hasCreatePermission$ = this.store.select(selectITSystemUsageHasCreateCollectionPermission);

  private readonly systemSectionName = USAGE_SECTION_NAME;

  private readonly activeInactiveData = [
    {
      name: $localize`Aktivt`,
      value: true,
    },
    {
      name: $localize`Ikke aktivt`,
      value: false,
    },
  ];
  public readonly defaultGridColumns: GridColumn[] = [
    {
      field: GridFields.SystemActive,
      title: $localize`Status`,
      section: this.systemSectionName,
      filter: 'boolean',
      extraData: this.activeInactiveData,
      entityType: 'it-system-usage',
      style: 'chip',
      hidden: false,
      persistId: 'systemIsActive',
    },
    {
      field: GridFields.ActiveAccordingToValidityPeriod,
      title: $localize`Status (Datofelter)`,
      section: this.systemSectionName,
      filter: 'boolean',
      extraData: this.activeInactiveData,
      entityType: 'it-system-usage',
      style: 'chip',
      hidden: false,
      persistId: 'isActive',
    },
    {
      field: GridFields.ActiveAccordingToLifeCycle,
      title: $localize`Status (Livscyklus)`,
      section: this.systemSectionName,
      filter: 'boolean',
      extraData: this.activeInactiveData,
      entityType: 'it-system-usage',
      style: 'chip',
      hidden: false,
      persistId: 'isActiveAccordingToLifeCycle',
    },
    {
      field: GridFields.MainContractIsActive,
      title: $localize`Status (Markeret kontrakt)`,
      section: this.systemSectionName,
      filter: 'boolean',
      extraData: this.activeInactiveData,
      entityType: 'it-system-usage',
      style: 'chip',
      width: 340,
      hidden: false,
      persistId: 'contract',
    },
    {
      field: GridFields.LocalSystemId,
      title: $localize`Lokal System ID`,
      section: this.systemSectionName,
      hidden: true,
      persistId: 'localid',
    },
    {
      field: GridFields.ItSystemUuid,
      title: $localize`IT-System (UUID)`,
      section: this.systemSectionName,
      width: 320,
      hidden: true,
      persistId: 'uuid',
    },
    {
      field: GridFields.SystemDescription,
      title: $localize`IT-System (Beskrivelse)`,
      section: this.systemSectionName,
      width: 320,
      hidden: true,
      persistId: 'MISSING',
    },
    {
      field: GridFields.ExternalSystemUuid,
      title: $localize`IT-System (Externt UUID)`,
      section: this.systemSectionName,
      width: 320,
      hidden: true,
      persistId: 'externaluuid',
    },
    {
      field: GridFields.ParentItSystemName,
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
      field: GridFields.SystemName,
      title: $localize`IT System`,
      section: this.systemSectionName,
      style: 'primary',
      hidden: false,
      persistId: 'sysname',
      required: true,
    },
    {
      field: GridFields.Version,
      title: $localize`Version`,
      section: this.systemSectionName,
      hidden: true,
      persistId: 'version',
    },
    {
      field: GridFields.LocalCallName,
      title: $localize`Lokal kaldenavn`,
      section: this.systemSectionName,
      hidden: true,
      persistId: 'localname',
    },
    {
      field: GridFields.ResponsibleOrganizationUnitName,
      title: $localize`Ansv. organisationsenhed`,
      section: ORGANIZATION_SECTION_NAME,
      extraFilter: 'organization-unit',
      width: 350,
      hidden: false,
      persistId: 'orgunit',
    },
    {
      field: GridFields.RelevantOrganizationUnitNamesAsCsv,
      title: $localize`Relevante organisationsenheder`,
      section: ORGANIZATION_SECTION_NAME,
      extraFilter: 'organization-unit',
      width: 400,
      hidden: false,
      persistId: 'relevantOrgunits',
    },
    {
      field: GridFields.SystemPreviousName,
      title: $localize`Tidligere systemnavn`,
      section: this.systemSectionName,
      width: 350,
      hidden: false,
      persistId: 'previousname',
    },
    {
      field: GridFields.ItSystemBusinessTypeUuid,
      dataField: 'ItSystemBusinessTypeName',
      title: $localize`Forretningstype`,
      section: this.systemSectionName,
      extraData: 'it-system_business-type',
      extraFilter: 'choice-type',
      style: 'uuid-to-name',
      hidden: false,
      persistId: 'busitype',
    },
    {
      field: GridFields.ItSystemKLEIdsAsCsv,
      title: $localize`KLE ID`,
      section: this.systemSectionName,
      hidden: true,
      persistId: 'taskkey',
    },
    {
      field: GridFields.ItSystemKLENamesAsCsv,
      title: $localize`KLE navn`,
      section: this.systemSectionName,
      hidden: false,
      persistId: 'klename',
    },
    {
      field: GridFields.LocalReferenceTitle,
      idField: 'LocalReferenceUrl',
      title: $localize`Lokal Reference`,
      section: LOCAL_REFERENCES_SECTION_NAME,
      style: 'title-link',
      hidden: false,
      persistId: 'ReferenceId',
    },
    {
      field: GridFields.LocalReferenceDocumentId,
      title: $localize`Dokument ID / Sagsnr.`,
      section: LOCAL_REFERENCES_SECTION_NAME,
      width: 300,
      hidden: true,
      persistId: 'folderref',
    },
    {
      field: GridFields.SensitiveDataLevelsAsCsv,
      title: $localize`DataType`,
      section: GDPR_SECTION_NAME,
      extraFilter: 'enum',
      extraData: dataSensitivityLevelOptions,
      width: 320,
      hidden: false,
      persistId: 'dataLevel',
    },
    {
      field: GridFields.MainContractSupplierName,
      title: $localize`Leverandør`,
      section: this.systemSectionName,
      hidden: false,
      persistId: 'supplier',
    },
    {
      field: GridFields.ItSystemRightsHolderName,
      title: $localize`Rettighedshaver`,
      section: this.systemSectionName,
      hidden: false,
      persistId: 'belongsto',
    },
    {
      field: GridFields.ObjectOwnerName,
      title: $localize`Taget i anvendelse af`,
      section: this.systemSectionName,
      width: 280,
      hidden: true,
      persistId: 'ownername',
    },
    {
      field: GridFields.LastChangedByName,
      title: $localize`Sidst redigeret: Bruger`,
      section: this.systemSectionName,
      width: 320,
      hidden: true,
      persistId: 'lastchangedname',
    },
    {
      field: GridFields.LastChangedAt,
      title: $localize`Sidst redigeret: Dato`,
      section: this.systemSectionName,
      style: 'date',
      filter: 'date',
      width: 350,
      hidden: true,
      persistId: 'changed',
    },
    {
      field: GridFields.Concluded,
      title: $localize`Ibrugtagningsdato`,
      section: this.systemSectionName,
      style: 'date',
      filter: 'date',
      width: 350,
      hidden: false,
      persistId: 'concludedSystemFrom',
    },
    {
      field: GridFields.ExpirationDate,
      title: $localize`Slutdato for anvendelse`,
      section: this.systemSectionName,
      style: 'date',
      filter: 'date',
      width: 350,
      hidden: false,
      persistId: 'systemUsageExpirationDate',
    },
    {
      field: GridFields.LifeCycleStatus,
      title: $localize`Livscyklus`,
      section: this.systemSectionName,
      style: 'enum',
      extraFilter: 'enum',
      extraData: lifeCycleStatusOptions,
      hidden: false,
      persistId: 'LifeCycleStatus',
    },
    {
      field: GridFields.ArchiveDuty,
      title: $localize`Arkiveringspligt`,
      section: ARCHIVE_SECTION_NAME,
      style: 'enum',
      extraFilter: 'enum',
      extraData: archiveDutyChoiceOptions,
      hidden: false,
      persistId: 'ArchiveDuty',
    },
    {
      field: GridFields.IsHoldingDocument,
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
      booleanValueDisplay: BooleanValueDisplayType.YesNo,
    },
    {
      field: GridFields.ActiveArchivePeriodEndDate,
      title: $localize`Journalperiode slutdato`,
      section: ARCHIVE_SECTION_NAME,
      style: 'date',
      noFilter: true,
      width: 350,
      hidden: true,
      persistId: 'ArchivePeriodsEndDate',
    },
    {
      field: GridFields.RiskSupervisionDocumentationName,
      title: $localize`Risikovurdering`,
      idField: 'RiskSupervisionDocumentationUrl',
      section: GDPR_SECTION_NAME,
      style: 'title-link',
      hidden: true,
      persistId: 'riskSupervisionDocumentationUrlName',
    },
    {
      field: GridFields.LinkToDirectoryName,
      title: $localize`Fortegnelse`,
      section: GDPR_SECTION_NAME,
      idField: 'LinkToDirectoryUrl',
      style: 'title-link',
      hidden: true,
      persistId: 'LinkToDirectoryUrlName',
    },
    {
      field: GridFields.HostedAt,
      title: $localize`IT systemet driftes`,
      section: this.systemSectionName,
      style: 'enum',
      extraFilter: 'enum',
      extraData: hostedAtOptionsGrid,
      hidden: false,
      persistId: 'HostedAt',
    },
    {
      field: GridFields.GeneralPurpose,
      title: $localize`Systemets overordnede formål`,
      section: GDPR_SECTION_NAME,
      width: 390,
      hidden: false,
      persistId: 'GeneralPurpose',
    },
    {
      field: GridFields.DataProcessingRegistrationsConcludedAsCsv,
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
      field: GridFields.DataProcessingRegistrationNamesAsCsv,
      title: $localize`Databehandling`,
      section: DATA_PROCESSING_SECTION_NAME,
      style: 'page-link-array',
      entityType: 'data-processing-registration',
      dataField: 'DataProcessingRegistrations',
      hidden: true,
      persistId: 'dataProcessingRegistrations',
    },
    {
      field: GridFields.OutgoingRelatedItSystemUsagesNamesAsCsv,
      title: $localize`Anvendte systemer`,
      section: RELATIONS_SECTION_NAME,
      style: 'page-link-array',
      entityType: 'it-system-usage',
      dataField: 'OutgoingRelatedItSystemUsages',
      hidden: true,
      persistId: 'outgoingRelatedItSystemUsages',
    },
    {
      field: GridFields.DependsOnInterfacesNamesAsCsv,
      title: $localize`Anvendte snitflader`,
      section: RELATIONS_SECTION_NAME,
      style: 'page-link-array',
      entityType: 'it-interface',
      dataField: 'DependsOnInterfaces',
      hidden: true,
      persistId: 'dependsOnInterfaces',
    },
    {
      field: GridFields.IncomingRelatedItSystemUsagesNamesAsCsv,
      title: $localize`Systemer der anvender systemet`,
      section: RELATIONS_SECTION_NAME,
      style: 'page-link-array',
      entityType: 'it-system-usage',
      dataField: 'IncomingRelatedItSystemUsages',
      hidden: true,
      persistId: 'incomingRelatedItSystemUsages',
    },
    {
      field: GridFields.AssociatedContractsNamesCsv,
      title: $localize`IT Kontrakter`,
      section: CONTRACT_SECTION_NAME,
      style: 'page-link-array',
      entityType: 'it-contract',
      dataField: 'AssociatedContracts',
      hidden: true,
      persistId: 'itContracts',
    },
    {
      field: GridFields.RiskAssessmentDate,
      title: $localize`Dato for seneste risikovurdering`,
      section: GDPR_SECTION_NAME,
      style: 'date',
      filter: 'date',
      width: 350,
      hidden: false,
      persistId: 'LatestRiskAssessmentDate',
    },
    {
      field: GridFields.PlannedRiskAssessmentDate,
      title: $localize`Dato for planlagt risikovurdering`,
      section: GDPR_SECTION_NAME,
      style: 'date',
      filter: 'date',
      width: 350,
      hidden: false,
      persistId: 'PlannedRiskAssessmentDate',
    },
    {
      field: GridFields.Note,
      title: $localize`Noter`,
      section: this.systemSectionName,
      hidden: false,
      persistId: 'note',
    },
  ];

  public readonly enableLifeCycleStatus$ = this.store.select(selectITSystemUsageEnableLifeCycleStatus);
  public readonly enableUsagePeriod$ = this.store.select(selectITSystemUsageEnableFrontPageUsagePeriod);
  public readonly enabledGdpr$ = this.store.select(selectITSystemUsageEnableGdpr);

  constructor(
    store: Store,
    private router: Router,
    private route: ActivatedRoute,
    private gridColumnStorageService: GridColumnStorageService,
    private actions$: Actions,
    private uiConfigService: GridUIConfigService
  ) {
    super(store, 'it-system-usage');
  }

  ngOnInit() {
    const existingColumns = this.gridColumnStorageService.getColumns(USAGE_COLUMNS_ID, this.defaultGridColumns);
    this.store.dispatch(ITSystemUsageActions.getItSystemUsageOverviewRoles());
    if (existingColumns) {
      this.store.dispatch(ITSystemUsageActions.updateGridColumns(existingColumns));
    } else {
      this.subscriptions.add(
        this.actions$
          .pipe(
            ofType(ITSystemUsageActions.getItSystemUsageOverviewRolesSuccess),
            combineLatestWith(this.store.select(selectUsageGridRoleColumns)),
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
