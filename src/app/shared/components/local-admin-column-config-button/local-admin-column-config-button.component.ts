import { Component, Input } from '@angular/core';
import { Store } from '@ngrx/store';
import { NotificationService } from '../../services/notification.service';
import { ITSystemUsageActions } from 'src/app/store/it-system-usage/actions';
import { first, Observable } from 'rxjs';
import { GridColumn } from '../../models/grid-column.model';
import { APIKendoColumnConfigurationDTO } from 'src/app/api/v1';
import { ConfirmActionCategory, ConfirmActionService } from '../../services/confirm-action.service';
import { Actions, ofType } from '@ngrx/effects';

@Component({
  selector: 'app-local-admin-column-config-button',
  templateUrl: './local-admin-column-config-button.component.html',
  styleUrl: './local-admin-column-config-button.component.scss',
})
export class LocalAdminColumnConfigButtonComponent {
  @Input() columns$!: Observable<GridColumn[]>;

  constructor(
    private store: Store,
    private notificationService: NotificationService,
    private confirmActionService: ConfirmActionService,
    private actions$: Actions
  ) {
  }
  
  public onSave(): void {
    this.confirmActionService.confirmAction({
      category: ConfirmActionCategory.Neutral,
      message: $localize`Er du sikker på at du vil gemme nuværende kolonneopsætning af felter som standard til din organisation?`,
      onConfirm: () => {
        this.columns$.pipe(first()).subscribe((columns) => {
          this.store.dispatch(
            ITSystemUsageActions.saveOrganizationalITSystemUsageColumnConfiguration(
              this.mapColumnsToGridConfigurationRequest(columns)
            )
          );
          this.actions$.pipe(ofType(ITSystemUsageActions.saveOrganizationalITSystemUsageColumnConfigurationSuccess), first()).subscribe(() => {
            this.store.dispatch(ITSystemUsageActions.resetToOrganizationITSystemUsageColumnConfiguration());
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
        this.store.dispatch(ITSystemUsageActions.deleteOrganizationalITSystemUsageColumnConfiguration());
        this.actions$
          .pipe(ofType(ITSystemUsageActions.deleteOrganizationalITSystemUsageColumnConfigurationSuccess), first())
          .subscribe(() => {
            this.store.dispatch(ITSystemUsageActions.resetToOrganizationITSystemUsageColumnConfiguration());
          });
        this.notificationService.showDefault(
          $localize`Organisationens kolonneopsætningen er slettet og overblikket er nulstillet`
        );
      },
    });
  }

  private mapColumnsToGridConfigurationRequest(columns: GridColumn[]): APIKendoColumnConfigurationDTO[] {
    return columns
      .map((column, index) => ({ persistId: column.persistId, index, visible: !column.hidden }))
      .filter((column) => column.visible)
      .map(({ persistId, index }) => ({ persistId, index }));
  }
}
