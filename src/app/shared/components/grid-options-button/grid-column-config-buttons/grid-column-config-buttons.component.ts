import { Component, Input, OnInit } from '@angular/core';
import { Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { first, map, Observable } from 'rxjs';
import { RegistrationEntityTypes } from 'src/app/shared/models/registrations/registration-entity-categories.model';
import { ColumnConfigService } from 'src/app/shared/services/column-config.service';
import { ConfirmActionCategory, ConfirmActionService } from 'src/app/shared/services/confirm-action.service';
import { selectGridConfigModificationPermission } from 'src/app/store/user-store/selectors';

@Component({
  selector: 'app-grid-column-config-buttons',
  templateUrl: './grid-column-config-buttons.component.html',
  styleUrl: './grid-column-config-buttons.component.scss',
})
export class GridColumnConfigButtonsComponent implements OnInit {
  @Input() entityType!: RegistrationEntityTypes;

  constructor(
    private confirmActionService: ConfirmActionService,
    private columnConfigService: ColumnConfigService,
    private actions$: Actions,
    private store: Store
  ) {}

  public readonly hasGridConfigPermission$ = this.store.select(selectGridConfigModificationPermission);
  public hasGridConfig$?: Observable<boolean>;

  public ngOnInit(): void {
    this.hasGridConfig$ = this.columnConfigService.getGridConfig(this.entityType)?.pipe(map((config) => !!config));
  }

  public onSaveColumnConfig(): void {
    this.confirmActionService.confirmAction({
      category: ConfirmActionCategory.Neutral,
      message: $localize`Er du sikker på at du vil gemme den nuværende kolonneopsætning af felter som standard til din organisation?`,
      onConfirm: () => {
        this.columnConfigService
          .getGridColumns(this.entityType)
          .pipe(first())
          .subscribe((columns) => {
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

  public onDeleteColumnConfig(): void {
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
