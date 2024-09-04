import { Component, Input } from '@angular/core';
import { Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { first, Observable } from 'rxjs';
import { ITSystemUsageActions } from 'src/app/store/it-system-usage/actions';
import { GridColumn } from '../../models/grid-column.model';
import { ConfirmActionCategory, ConfirmActionService } from '../../services/confirm-action.service';
import { NotificationService } from '../../services/notification.service';
import { APIColumnConfigurationRequestDTO } from 'src/app/api/v2';
import { RegistrationEntityTypes } from '../../models/registrations/registration-entity-categories.model';
import { ITContractActions } from 'src/app/store/it-contract/actions';
import { DataProcessingActions } from 'src/app/store/data-processing/actions';

@Component({
  selector: 'app-local-admin-column-config-button',
  templateUrl: './local-admin-column-config-button.component.html',
  styleUrl: './local-admin-column-config-button.component.scss',
})
export class LocalAdminColumnConfigButtonComponent {
  @Input() columns$!: Observable<GridColumn[]>;
  @Input() entityType!: RegistrationEntityTypes;

  constructor(
    private store: Store,
    private notificationService: NotificationService,
    private confirmActionService: ConfirmActionService,
    private actions$: Actions
  ) {}

  public onSave(): void {
    this.confirmActionService.confirmAction({
      category: ConfirmActionCategory.Neutral,
      message: $localize`Er du sikker på at du vil gemme nuværende kolonneopsætning af felter som standard til din organisation?`,
      onConfirm: () => {
        this.columns$.pipe(first()).subscribe((columns) => {
          this.dispatchSaveAction(columns);
          this.actions$.pipe(ofType(this.getSaveSuccessConfigAction()), first()).subscribe(() => {
            this.dispatchResetAction();
          });
        });
        this.notificationService.showDefault($localize`Kolonneopsætningen er gemt for organisationen`);
      },
    });
  }

  public onDelete(): void {
    this.confirmActionService.confirmAction({
      category: ConfirmActionCategory.Warning,
      message: $localize`Er du sikker på at du vil slette den nuværende kolonneopsætning af felter som standard for din organisation?`,
      onConfirm: () => {
        this.dispatchDeleteAction();
        this.actions$.pipe(ofType(this.getDeleteSuccessConfigAction()), first()).subscribe(() => {
          this.dispatchResetAction();
        });
        this.notificationService.showDefault(
          $localize`Organisationens kolonneopsætningen er slettet og overblikket er nulstillet`
        );
      },
    });
  }

  private mapColumnsToGridConfigurationRequest(columns: GridColumn[]): APIColumnConfigurationRequestDTO[] {
    return columns
      .map((column, index) => ({ persistId: column.persistId, index, visible: !column.hidden }))
      .filter((column) => column.visible)
      .map(({ persistId, index }) => ({ persistId, index }));
  }

  private dispatchSaveAction(columns: GridColumn[]) {
    const mappedColumns = this.mapColumnsToGridConfigurationRequest(columns);
    switch (this.entityType) {
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
        throw new Error(`No save action defined for entity type: ${this.entityType}`);
    }
  }

  private dispatchResetAction() {
    switch (this.entityType) {
      case 'it-system-usage':
        return this.store.dispatch(ITSystemUsageActions.resetToOrganizationITSystemUsageColumnConfiguration());
      case 'it-contract':
        return this.store.dispatch(ITContractActions.resetToOrganizationITContractColumnConfiguration());
      case 'data-processing-registration':
        return this.store.dispatch(DataProcessingActions.resetToOrganizationDataProcessingColumnConfiguration());
      default:
        throw new Error(`No reset action defined for entity type: ${this.entityType}`);
    }
  }

  private dispatchDeleteAction() {
    switch (this.entityType) {
      case 'it-system-usage':
        return this.store.dispatch(ITSystemUsageActions.deleteOrganizationalITSystemUsageColumnConfiguration());
      case 'it-contract':
        return this.store.dispatch(ITContractActions.deleteOrganizationalITContractColumnConfiguration());
      case 'data-processing-registration':
        return this.store.dispatch(DataProcessingActions.deleteOrganizationalDataProcessingColumnConfiguration());
      default:
        throw new Error(`No delete action defined for entity type: ${this.entityType}`);
    }
  }

  private getSaveSuccessConfigAction() {
    switch (this.entityType) {
      case 'it-system-usage':
        return ITSystemUsageActions.saveOrganizationalITSystemUsageColumnConfigurationSuccess;
      case 'it-contract':
        return ITContractActions.saveOrganizationalITContractColumnConfigurationSuccess;
      case 'data-processing-registration':
        return DataProcessingActions.saveOrganizationalDataProcessingColumnConfigurationSuccess;
      default:
        throw new Error(`No save action success defined for entity type: ${this.entityType}`);
    }
  }

  private getDeleteSuccessConfigAction() {
    switch (this.entityType) {
      case 'it-system-usage':
        return ITSystemUsageActions.deleteOrganizationalITSystemUsageColumnConfigurationSuccess;
      case 'it-contract':
        return ITContractActions.deleteOrganizationalITContractColumnConfigurationSuccess;
      case 'data-processing-registration':
        return DataProcessingActions.deleteOrganizationalDataProcessingColumnConfigurationSuccess;
      default:
        throw new Error(`No delete action success defined for entity type: ${this.entityType}`);
    }
  }
}
