import { Component, Input, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { APIOrganizationGridConfigurationResponseDTO } from 'src/app/api/v2';
import { DataProcessingActions } from 'src/app/store/data-processing/actions';
import { ITContractActions } from 'src/app/store/it-contract/actions';
import { ITSystemUsageActions } from 'src/app/store/it-system-usage/actions';
import { OrganizationUserActions } from 'src/app/store/organization/organization-user/actions';
import { RegistrationEntityTypes } from '../../models/registrations/registration-entity-categories.model';
import { ColumnConfigService } from '../../services/column-config.service';

@Component({
  selector: 'app-reset-to-org-columns-config-button',
  templateUrl: './reset-to-org-columns-config-button.component.html',
  styleUrl: './reset-to-org-columns-config-button.component.scss',
})
export class ResetToOrgColumnsConfigButtonComponent implements OnInit {
  @Input() public entityType!: RegistrationEntityTypes;

  public lastSeenGridConfig$!: Observable<APIOrganizationGridConfigurationResponseDTO | undefined>;

  public readonly tooltipText = $localize`OBS: Opsætning af overblik afviger fra kommunens standardoverblik. Tryk på 'Gendan kolonneopsætning' for at benytte den gældende opsætning.`;

  constructor(private store: Store, private columnConfigService: ColumnConfigService) {}

  public ngOnInit(): void {
    this.lastSeenGridConfig$ = this.columnConfigService?.getGridConfig(this.entityType);

    this.dispatchInitializeAction();
  }

  public resetColumnsConfig(): void {
    this.dispatchResetConfigAction();
  }

  public hasChanges(): Observable<boolean> {
    return this.columnConfigService.hasChanges(this.entityType);
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
        break;
    }
  }
}
