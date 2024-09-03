import { Component, Input, OnInit } from '@angular/core';
import { Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { first, Observable } from 'rxjs';
import { ITSystemUsageActions } from 'src/app/store/it-system-usage/actions';
import { UserActions } from 'src/app/store/user-store/actions';
import { GridColumn } from '../../models/grid-column.model';
import { ConfirmActionCategory, ConfirmActionService } from '../../services/confirm-action.service';
import { NotificationService } from '../../services/notification.service';
import { selectGridConfigModificationPermission } from 'src/app/store/user-store/selectors';
import { APIColumnConfigurationRequestDTO } from 'src/app/api/v2';

@Component({
  selector: 'app-local-admin-column-config-button',
  templateUrl: './local-admin-column-config-button.component.html',
  styleUrl: './local-admin-column-config-button.component.scss',
})
export class LocalAdminColumnConfigButtonComponent implements OnInit {
  @Input() columns$!: Observable<GridColumn[]>;

  @Input() hasModifcationPermission$: Observable<boolean | undefined> = this.store.select(selectGridConfigModificationPermission);

  constructor(
    private store: Store,
    private notificationService: NotificationService,
    private confirmActionService: ConfirmActionService,
    private actions$: Actions
  ) {}

  ngOnInit(): void {
    this.store.dispatch(UserActions.getUserGridPermissions());
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
          this.actions$
            .pipe(ofType(ITSystemUsageActions.saveOrganizationalITSystemUsageColumnConfigurationSuccess), first())
            .subscribe(() => {
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

  private mapColumnsToGridConfigurationRequest(columns: GridColumn[]): APIColumnConfigurationRequestDTO[] {
    return columns
      .map((column, index) => ({ persistId: column.persistId, index, visible: !column.hidden }))
      .filter((column) => column.visible)
      .map(({ persistId, index }) => ({ persistId, index }));
  }
}
