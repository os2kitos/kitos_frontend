import { Component, Input, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { mapEntityTypeToOwnerResourceType } from 'src/app/shared/helpers/entity-type.helper';
import { GridColumn } from 'src/app/shared/models/grid-column.model';
import { RegistrationEntityTypes } from 'src/app/shared/models/registrations/registration-entity-categories.model';
import { UserNotificationActions } from 'src/app/store/user-notifications/actions';
import { selectNotificationsByType } from 'src/app/store/user-notifications/selectors';
import { UserNotification } from 'src/app/store/user-notifications/state';

@Component({
  selector: 'app-notifications-grid',
  templateUrl: './notifications-grid.component.html',
  styleUrl: './notifications-grid.component.scss',
})
export class NotificationsGridComponent implements OnInit {
  @Input() entityType!: RegistrationEntityTypes;

  public notifications$!: Observable<UserNotification[]>;

  public gridColumns!: GridColumn[];

  constructor(private store: Store) {}

  ngOnInit(): void {
    //We have to initialize the grid columns here because the entityType is not available in the constructor
    this.initializeGridColumns();

    const ownerResourceType = mapEntityTypeToOwnerResourceType(this.entityType);
    this.store.dispatch(UserNotificationActions.getNotifications(ownerResourceType));
    this.notifications$ = this.store.select(selectNotificationsByType(ownerResourceType));
  }

  private initializeGridColumns() {
    this.gridColumns = [
      {
        title: $localize`Navn`,
        field: 'name',
        hidden: false,
        idField: 'ownerResource.uuid',
        entityType: this.entityType,
        style: 'page-link',
        extraData: 'notifications',
      },
      {
        title: $localize`Sidst sendt`,
        field: 'lastSent',
        style: 'date',
        hidden: false,
      },
      {
        title: $localize`Fra dato`,
        field: 'fromDate',
        style: 'date',
        hidden: false,
      },
      {
        title: $localize`Til dato`,
        field: 'toDate',
        style: 'date',
        hidden: false,
      },
      {
        title: $localize`Modtager`,
        field: 'receiversCsv',
        hidden: false,
      },
      {
        title: $localize`CC`,
        field: 'cCsCsv',
        hidden: false,
      },
      {
        title: $localize`Emne`,
        field: 'subject',
        hidden: false,
      },
    ];
  }
}
