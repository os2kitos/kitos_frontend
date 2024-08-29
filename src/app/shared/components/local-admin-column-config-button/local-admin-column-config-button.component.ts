import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { NotificationService } from '../../services/notification.service';
import { ITSystemUsageActions } from 'src/app/store/it-system-usage/actions';

@Component({
  selector: 'app-local-admin-column-config-button',
  templateUrl: './local-admin-column-config-button.component.html',
  styleUrl: './local-admin-column-config-button.component.scss'
})
export class LocalAdminColumnConfigButtonComponent {

  constructor(private store: Store, private notificationService: NotificationService) {}

  public onSave(): void {
    this.store.dispatch(ITSystemUsageActions.saveOrganizationalITSystemUsageColumnConfiguration());
    this.notificationService.showDefault($localize`Kolonneopsætningen er gemt for organisationen`);
  }

  public onDelete(): void {
    this.store.dispatch(ITSystemUsageActions.deleteOrganizationalITSystemUsageColumnConfiguration());
    this.notificationService.showDefault($localize`Organisationens kolonneopsætningen er slettet og overblikket er nulstillet`);
  }

}
