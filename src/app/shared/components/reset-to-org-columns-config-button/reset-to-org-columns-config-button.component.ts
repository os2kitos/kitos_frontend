import { Component, Input, OnInit } from '@angular/core';
import { Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { first, Observable } from 'rxjs';
import { APIOrganizationGridConfigurationResponseDTO } from 'src/app/api/v2';
import { DataProcessingActions } from 'src/app/store/data-processing/actions';
import { ITContractActions } from 'src/app/store/it-contract/actions';
import { ITSystemUsageActions } from 'src/app/store/it-system-usage/actions';
import { OrganizationUserActions } from 'src/app/store/organization-user/actions';
import { GridColumn } from '../../models/grid-column.model';
import { RegistrationEntityTypes } from '../../models/registrations/registration-entity-categories.model';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-reset-to-org-columns-config-button',
  templateUrl: './reset-to-org-columns-config-button.component.html',
  styleUrl: './reset-to-org-columns-config-button.component.scss',
})
export class ResetToOrgColumnsConfigButtonComponent implements OnInit {
  @Input() public entityType!: RegistrationEntityTypes;
  @Input() public gridColumns$!: Observable<GridColumn[]>;
  @Input() public lastSeenGridConfig$: Observable<APIOrganizationGridConfigurationResponseDTO | undefined> | undefined;

  public hasChanged: boolean = true;

  public readonly tooltipText = $localize`OBS: Opsætning af overblik afviger fra kommunens standardoverblik. Tryk på 'Gendan kolonneopsætning' for at benytte den gældende opsætning.`;

  constructor(private store: Store, private notificationService: NotificationService, private actions$: Actions) {}

  public ngOnInit(): void {
    if (!this.lastSeenGridConfig$) {
      this.hasChanged = false;
      return;
    }
    this.gridColumns$.subscribe((columns) => {
      this.updateHasChanged(columns);
    });

    this.actions$.pipe(ofType(this.getInitializeGridConfigSuccessAction())).subscribe(() => {
      //This ensures that the hasChanged property is initialized correctly
      this.gridColumns$.pipe(first()).subscribe((columns) => {
        this.updateHasChanged(columns);
      });
    });

    this.dispatchInitializeAction();
  }

  private updateHasChanged(columns: GridColumn[]): void {
    this.lastSeenGridConfig$!.pipe(first()).subscribe((config) => {
      this.hasChanged = this.areColumnsDifferentFromConfig(columns, config);
    });
  }

  public resetColumnsConfig(): void {
    this.dispatchResetConfigAction();
    this.notificationService.showDefault($localize`Kolonnevisning gendannet til organisationens standardopsætning`);
  }

  private getInitializeGridConfigSuccessAction() {
    switch (this.entityType) {
      case 'it-system-usage':
        return ITSystemUsageActions.initializeITSystemUsageLastSeenGridConfigurationSuccess;
      case 'it-contract':
        return ITContractActions.initializeITContractLastSeenGridConfigurationSuccess;
      case 'data-processing-registration':
        return DataProcessingActions.initializeDataProcessingLastSeenGridConfigurationSuccess;
      default:
        throw new Error('Unsupported entity type');
    }
  }

  private areColumnsDifferentFromConfig(
    columns: GridColumn[],
    config: APIOrganizationGridConfigurationResponseDTO | undefined
  ): boolean {
    if (!config) return false;
    const visibleColumns = columns.filter((column) => !column.hidden);
    const configColumns = config.visibleColumns;
    if (!configColumns) return false;
    if (visibleColumns.length !== configColumns.length) return true;
    const zipped = visibleColumns.map((column, index) => ({ column, configColumn: configColumns[index] }));
    const isDifferentFromConfig = zipped.some(
      ({ column, configColumn }) => column.persistId !== configColumn.persistId
    );
    return isDifferentFromConfig;
  }

  private dispatchResetConfigAction(): void {
    switch (this.entityType) {
      case 'it-system-usage':
        this.store.dispatch(ITSystemUsageActions.resetToOrganizationITSystemUsageColumnConfiguration());
        break;
      case 'it-contract':
        this.store.dispatch(ITContractActions.resetToOrganizationITContractColumnConfiguration());
        break;
      case 'data-processing-registration':
        this.store.dispatch(DataProcessingActions.resetToOrganizationDataProcessingColumnConfiguration());
        break;
      case 'organization-user':
        this.store.dispatch(OrganizationUserActions.resetGridConfiguration());
        break;
      default:
        throw new Error('Unsupported entity type');
    }
  }

  private dispatchInitializeAction(): void {
    switch (this.entityType) {
      case 'it-system-usage':
        this.store.dispatch(ITSystemUsageActions.initializeITSystemUsageLastSeenGridConfiguration());
        break;
      case 'it-contract':
        this.store.dispatch(ITContractActions.initializeITContractLastSeenGridConfiguration());
        break;
      case 'data-processing-registration':
        this.store.dispatch(DataProcessingActions.initializeDataProcessingLastSeenGridConfiguration());
        break;
      default:
        throw new Error('Unsupported entity type');
    }
  }
}
