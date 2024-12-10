import { Injectable } from '@angular/core';
import { concatLatestFrom } from '@ngrx/operators';
import { Store } from '@ngrx/store';
import { map, Observable, of } from 'rxjs';
import { APIColumnConfigurationRequestDTO, APIOrganizationGridConfigurationResponseDTO } from 'src/app/api/v2';
import { DataProcessingActions } from 'src/app/store/data-processing/actions';
import {
  selectDataProcessingGridColumns,
  selectDataProcessingLastSeenGridConfig,
} from 'src/app/store/data-processing/selectors';
import { ITContractActions } from 'src/app/store/it-contract/actions';
import { selectContractGridColumns, selectItContractLastSeenGridConfig } from 'src/app/store/it-contract/selectors';
import { ITSystemUsageActions } from 'src/app/store/it-system-usage/actions';
import { selectItSystemUsageLastSeenGridConfig, selectUsageGridColumns } from 'src/app/store/it-system-usage/selectors';
import { UIModuleConfigKey } from '../enums/ui-module-config-key';
import { GridColumn } from '../models/grid-column.model';
import { RegistrationEntityTypes } from '../models/registrations/registration-entity-categories.model';
import { GridUIConfigService } from './ui-config-services/grid-ui-config.service';
import { UIConfigService } from './ui-config-services/ui-config.service';

@Injectable({ providedIn: 'root' })
export class ColumnConfigService {
  constructor(
    private store: Store,
    private uiConfigService: UIConfigService,
    private gridUiConfigService: GridUIConfigService
  ) {}

  public dispatchSaveAction(entityType: RegistrationEntityTypes, columns: GridColumn[]) {
    const mappedColumns = this.mapColumnsToGridConfigurationRequest(columns);
    switch (entityType) {
      case 'it-system-usage':
        this.store.dispatch(ITSystemUsageActions.saveOrganizationalITSystemUsageColumnConfiguration(mappedColumns));
        break;
      case 'it-contract':
        this.store.dispatch(ITContractActions.saveOrganizationalITContractColumnConfiguration(mappedColumns));
        break;
      case 'data-processing-registration':
        this.store.dispatch(DataProcessingActions.saveOrganizationalDataProcessingColumnConfiguration(mappedColumns));
        break;
      default:
        throw new Error(`No save action defined for entity type: ${entityType}`);
    }
  }

  public dispatchResetAction(entityType: RegistrationEntityTypes) {
    switch (entityType) {
      case 'it-system-usage':
        return this.store.dispatch(ITSystemUsageActions.resetToOrganizationITSystemUsageColumnConfiguration());
      case 'it-contract':
        return this.store.dispatch(ITContractActions.resetToOrganizationITContractColumnConfiguration());
      case 'data-processing-registration':
        return this.store.dispatch(DataProcessingActions.resetToOrganizationDataProcessingColumnConfiguration());
      default:
        throw new Error(`No reset action defined for entity type: ${entityType}`);
    }
  }

  public dispatchDeleteAction(entityType: RegistrationEntityTypes) {
    switch (entityType) {
      case 'it-system-usage':
        return this.store.dispatch(ITSystemUsageActions.deleteOrganizationalITSystemUsageColumnConfiguration());
      case 'it-contract':
        return this.store.dispatch(ITContractActions.deleteOrganizationalITContractColumnConfiguration());
      case 'data-processing-registration':
        return this.store.dispatch(DataProcessingActions.deleteOrganizationalDataProcessingColumnConfiguration());
      default:
        throw new Error(`No delete action defined for entity type: ${entityType}`);
    }
  }

  public getSaveSuccessConfigAction(entityType: RegistrationEntityTypes) {
    switch (entityType) {
      case 'it-system-usage':
        return ITSystemUsageActions.saveOrganizationalITSystemUsageColumnConfigurationSuccess;
      case 'it-contract':
        return ITContractActions.saveOrganizationalITContractColumnConfigurationSuccess;
      case 'data-processing-registration':
        return DataProcessingActions.saveOrganizationalDataProcessingColumnConfigurationSuccess;
      default:
        throw new Error(`No save action success defined for entity type: ${entityType}`);
    }
  }

  public getDeleteSuccessConfigAction(entityType: RegistrationEntityTypes) {
    switch (entityType) {
      case 'it-system-usage':
        return ITSystemUsageActions.deleteOrganizationalITSystemUsageColumnConfigurationSuccess;
      case 'it-contract':
        return ITContractActions.deleteOrganizationalITContractColumnConfigurationSuccess;
      case 'data-processing-registration':
        return DataProcessingActions.deleteOrganizationalDataProcessingColumnConfigurationSuccess;
      default:
        throw new Error(`No delete action success defined for entity type: ${entityType}`);
    }
  }

  public hasChanges(entityType: RegistrationEntityTypes): Observable<boolean> {
    switch (entityType) {
      case 'it-system-usage':
      case 'it-contract':
      case 'data-processing-registration': {
        return this.getGridColumns(entityType).pipe(
          concatLatestFrom(() => this.getGridConfig(entityType)),
          map(([gridColumns, config]) => {
            return this.areColumnsDifferentFromConfig(gridColumns, config);
          })
        );
      }
      default:
        return of(false);
    }
  }

  public getGridColumns(entityType: RegistrationEntityTypes): Observable<GridColumn[]> {
    return this.getRawGridColumns(entityType).pipe(
      this.gridUiConfigService.filterGridColumnsByUIConfig(this.entityTypeToModuleConfigKey(entityType))
    );
  }

  public getGridConfig(
    entityType: RegistrationEntityTypes
  ): Observable<APIOrganizationGridConfigurationResponseDTO | undefined> {
    switch (entityType) {
      case 'it-system-usage':
        return this.store.select(selectItSystemUsageLastSeenGridConfig);
      case 'it-contract':
        return this.store.select(selectItContractLastSeenGridConfig);
      case 'data-processing-registration':
        return this.store.select(selectDataProcessingLastSeenGridConfig);
      default:
        return of(undefined);
    }
  }

  private entityTypeToModuleConfigKey(entityType: RegistrationEntityTypes): UIModuleConfigKey {
    switch (entityType) {
      case 'it-system-usage':
        return UIModuleConfigKey.ItSystemUsage;
      case 'it-contract':
        return UIModuleConfigKey.ItContract;
      case 'data-processing-registration':
        return UIModuleConfigKey.DataProcessingRegistrations;
      default:
        throw new Error(`No module config key defined for entity type: ${entityType}`);
    }
  }

  private getRawGridColumns(entityType: RegistrationEntityTypes): Observable<GridColumn[]> {
    switch (entityType) {
      case 'it-system-usage':
        return this.store.select(selectUsageGridColumns);
      case 'it-contract':
        return this.store.select(selectContractGridColumns);
      case 'data-processing-registration':
        return this.store.select(selectDataProcessingGridColumns);
      default:
        throw new Error(`No column configuration defined for entity type: ${entityType}`);
    }
  }

  private mapColumnsToGridConfigurationRequest(columns: GridColumn[]): APIColumnConfigurationRequestDTO[] {
    return columns
      .map((column, index) => ({
        persistId: column.persistId,
        index,
        visible: !column.hidden && !column.disabledByUIConfig,
      }))
      .filter((column) => column.visible)
      .map(({ persistId, index }) => ({ persistId, index }));
  }

  private areColumnsDifferentFromConfig(
    columns: GridColumn[],
    config: APIOrganizationGridConfigurationResponseDTO | undefined
  ): boolean {
    if (!config || !config.visibleColumns) return false;

    const visibleColumns = columns.filter((column) => !column.hidden && !column.disabledByUIConfig);

    if (visibleColumns.length !== config.visibleColumns.length) return true;

    const visiblePersistIds = visibleColumns.map((column) => column.persistId);
    const configPersistIds = config.visibleColumns.map((column) => column.persistId);

    const persistIdSet = new Set(visiblePersistIds);

    const isDifferentFromConfig = configPersistIds.some((persistId) => !persistIdSet.has(persistId));

    return isDifferentFromConfig;
  }
}
