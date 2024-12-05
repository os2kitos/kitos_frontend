import { Component, Input } from '@angular/core';
import { Actions, ofType } from '@ngrx/effects';
import { first, Observable } from 'rxjs';
import { APIOrganizationGridConfigurationResponseDTO } from 'src/app/api/v2';
import { GridColumn } from '../../models/grid-column.model';
import { RegistrationEntityTypes } from '../../models/registrations/registration-entity-categories.model';
import { ConfirmActionCategory, ConfirmActionService } from '../../services/confirm-action.service';
import { ColumnConfigService } from '../../services/column-config.service';

@Component({
  selector: 'app-local-admin-column-config-button',
  templateUrl: './local-admin-column-config-button.component.html',
  styleUrl: './local-admin-column-config-button.component.scss',
})
export class LocalAdminColumnConfigButtonComponent {
  @Input() columns$!: Observable<GridColumn[]>;
  @Input() entityType!: RegistrationEntityTypes;
  @Input() lastSeenGridConfig$!: Observable<APIOrganizationGridConfigurationResponseDTO | undefined>;

  constructor(
    private confirmActionService: ConfirmActionService,
    private actions$: Actions,
    private columnConfigService: ColumnConfigService
  ) {}

  public onSave(): void {
    this.confirmActionService.confirmAction({
      category: ConfirmActionCategory.Neutral,
      message: $localize`Er du sikker på at du vil gemme den nuværende kolonneopsætning af felter som standard til din organisation?`,
      onConfirm: () => {
        this.columns$.pipe(first()).subscribe((columns) => {
          this.columnConfigService.dispatchSaveAction(this.entityType, columns);
          this.actions$
            .pipe(ofType(this.columnConfigService.getSaveSuccessConfigAction(this.entityType)), first())
            .subscribe(() => {
              this.columnConfigService.dispatchResetAction(this.entityType);
            });
        });
      },
    });
  }

  public onDelete(): void {
    this.confirmActionService.confirmAction({
      category: ConfirmActionCategory.Warning,
      message: $localize`Er du sikker på at du vil slette den nuværende kolonneopsætning af felter som standard for din organisation?`,
      onConfirm: () => {
        this.columnConfigService.dispatchDeleteAction(this.entityType);
        this.actions$
          .pipe(ofType(this.columnConfigService.getDeleteSuccessConfigAction(this.entityType)), first())
          .subscribe(() => {
            this.columnConfigService.dispatchResetAction(this.entityType);
          });
      },
    });
  }
}
