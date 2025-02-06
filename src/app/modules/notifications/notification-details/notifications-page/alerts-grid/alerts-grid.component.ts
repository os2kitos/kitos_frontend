import { Component, Input, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { mapEntityTypeToRelatedEntityType } from 'src/app/shared/helpers/entity-type.helper';
import { GridActionColumn } from 'src/app/shared/models/grid-action-column.model';
import { GridColumn } from 'src/app/shared/models/grid-column.model';
import { RegistrationEntityTypes } from 'src/app/shared/models/registrations/registration-entity-categories.model';
import { ConfirmActionCategory, ConfirmActionService } from 'src/app/shared/services/confirm-action.service';
import { AlertActions } from 'src/app/store/alerts/actions';
import { selectAlertsByType } from 'src/app/store/alerts/selectors';
import { Alert, RelatedEntityType } from 'src/app/store/alerts/state';

@Component({
  selector: 'app-alerts-grid',
  templateUrl: './alerts-grid.component.html',
  styleUrl: './alerts-grid.component.scss',
})
export class AlertsGridComponent implements OnInit {
  @Input() entityType!: RegistrationEntityTypes;

  private relatedEntityType!: RelatedEntityType;

  public alerts$!: Observable<Alert[]>;

  public gridColumns!: GridColumn[];

  constructor(private store: Store, private confirmActionService: ConfirmActionService) {}

  ngOnInit(): void {
    this.relatedEntityType = mapEntityTypeToRelatedEntityType(this.entityType);
    this.alerts$ = this.store.select(selectAlertsByType(this.relatedEntityType));
    this.store.dispatch(AlertActions.getAlerts(this.relatedEntityType));

    this.initializeGridColumns();
  }

  public deleteAlert(alert: Alert): void {
    this.confirmActionService.confirmAction({
      title: $localize`Slet advarsel`,
      message: $localize`Er du sikker på, at du vil slette advarslen?`,
      category: ConfirmActionCategory.Warning,
      onConfirm: () => this.store.dispatch(AlertActions.deleteAlert(this.relatedEntityType, alert.uuid)),
    });
  }

  private initializeGridColumns(): void {
    this.gridColumns = [
      {
        title: $localize`Type`,
        hidden: false,
        field: 'alertType',
      },
      {
        title: $localize`Navn`,
        hidden: false,
        style: 'page-link',
        entityType: this.entityType,
        idField: 'entityUuid',
        extraData: 'notifications',
        field: 'name',
      },
      {
        title: $localize`Dato`,
        hidden: false,
        style: 'date',
        field: 'created',
      },
      {
        title: $localize`Besked`,
        hidden: false,
        field: 'message',
      },
      {
        field: 'Actions',
        title: ' ',
        hidden: false,
        style: 'action-buttons',
        isSticky: true,
        noFilter: true,
        extraData: [{ type: 'delete' }] as GridActionColumn[],
        width: 50,
      },
    ];
  }
}
