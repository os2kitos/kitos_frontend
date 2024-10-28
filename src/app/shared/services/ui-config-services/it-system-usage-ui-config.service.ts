import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { combineLatest, map, Observable } from 'rxjs';
import * as GridFields from 'src/app/shared/constants/it-system-usage-grid-column-constants';
import { GridColumn } from '../../models/grid-column.model';
import { UIConfigGridApplication } from '../../models/ui-config/ui-config-grid-application';
import { UIConfigService } from './ui-config.service';
import {
  selectITSystemUsageEnableLifeCycleStatus,
  selectITSystemUsageEnableFrontPageUsagePeriod,
  selectITSystemUsageEnableSelectContractToDetermineIfItSystemIsActive,
  selectITSystemUsageEnableTabOrganization,
  selectITSystemUsageEnableTabSystemRoles,
  selectITSystemUsageEnableLocalReferences,
  selectITSystemUsageEnableGdpr,
  selectITSystemUsageEnableTabArchiving,
  selectITSystemUsageEnableSystemRelations,
} from 'src/app/store/organization/ui-module-customization/selectors';

@Injectable({
  providedIn: 'root',
})
export class ItSystemUsageUIConfigService {
  constructor(private uiConfigService: UIConfigService, private store: Store) {}

  public applyItSystemUsageConfigToGridColumns(): (source: Observable<GridColumn[]>) => Observable<GridColumn[]> {
    return this.uiConfigService.applyConfigToGridColumns(this.getUIConfigApplications());
  }

  private getUIConfigApplications(): Observable<UIConfigGridApplication[]> {
    const enableLifeCycleStatus$ = this.store.select(selectITSystemUsageEnableLifeCycleStatus);
    const enableUsagePeriod$ = this.store.select(selectITSystemUsageEnableFrontPageUsagePeriod);
    const enableSelectContractToDetermineIfItSystemIsActive$ = this.store.select(
      selectITSystemUsageEnableSelectContractToDetermineIfItSystemIsActive
    );
    const enableOrganization$ = this.store.select(selectITSystemUsageEnableTabOrganization);
    const enableSystemRoles$ = this.store.select(selectITSystemUsageEnableTabSystemRoles);
    const enableReferences$ = this.store.select(selectITSystemUsageEnableLocalReferences);
    const enableGdpr$ = this.store.select(selectITSystemUsageEnableGdpr);
    const enableArchiving$ = this.store.select(selectITSystemUsageEnableTabArchiving);
    const enableSystemRelations$ = this.store.select(selectITSystemUsageEnableSystemRelations);

    return combineLatest([
      enableLifeCycleStatus$,
      enableUsagePeriod$,
      enableSelectContractToDetermineIfItSystemIsActive$,
      enableOrganization$,
      enableSystemRoles$,
      enableReferences$,
      enableGdpr$,
      enableArchiving$,
      enableSystemRelations$,
    ]).pipe(
      map(
        ([
          enableLifeCycleStatus,
          enableUsagePeriod,
          enableSelectContractToDetermineIfItSystemIsActive,
          enableOrganization,
          enableSystemRoles,
          enableReferences,
          enableGdpr,
          enableArchiving,
          enableSystemRelations,
        ]): UIConfigGridApplication[] => [
          {
            shouldEnable: enableLifeCycleStatus,
            columnNamesToConfigure: [GridFields.LifeCycleStatus, GridFields.ActiveAccordingToLifeCycle],
          },
          {
            shouldEnable: enableUsagePeriod,
            columnNamesToConfigure: [
              GridFields.ExpirationDate,
              GridFields.Concluded,
              GridFields.ActiveAccordingToValidityPeriod,
            ],
          },
          {
            shouldEnable: enableSelectContractToDetermineIfItSystemIsActive,
            columnNamesToConfigure: [GridFields.MainContractIsActive, GridFields.MainContractSupplierName],
          },
          {
            shouldEnable: enableOrganization,
            columnNamesToConfigure: [
              GridFields.ResponsibleOrganizationUnitName,
              GridFields.RelevantOrganizationUnitNamesAsCsv,
            ],
          },
          {
            shouldEnable: enableSystemRoles,
            columnNamesToConfigure: [],
            columnNameSubstringsToConfigure: ['Roles.Role'],
          },
          {
            shouldEnable: enableReferences,
            columnNamesToConfigure: [GridFields.LocalReferenceTitle, GridFields.LocalReferenceDocumentId],
          },
          {
            shouldEnable: enableGdpr,
              columnNamesToConfigure: [
              GridFields.SensitiveDataLevelsAsCsv,
              GridFields.LocalReferenceDocumentId,
              GridFields.RiskSupervisionDocumentationName,
              GridFields.LinkToDirectoryName,
              GridFields.HostedAt,
              GridFields.GeneralPurpose,
              GridFields.DataProcessingRegistrationsConcludedAsCsv,
              GridFields.DataProcessingRegistrationNamesAsCsv,
              GridFields.RiskAssessmentDate,
              GridFields.PlannedRiskAssessmentDate,
            ],
          },
          {
            shouldEnable: enableArchiving,
            columnNamesToConfigure: [
              GridFields.ArchiveDuty,
              GridFields.IsHoldingDocument,
              GridFields.ActiveArchivePeriodEndDate,
            ],
          },
          {
            shouldEnable: enableSystemRelations,
            columnNamesToConfigure: [
              GridFields.OutgoingRelatedItSystemUsagesNamesAsCsv,
              GridFields.DependsOnInterfacesNamesAsCsv,
              GridFields.IncomingRelatedItSystemUsagesNamesAsCsv,
            ],
          },
        ]
      )
    );
  }
}
