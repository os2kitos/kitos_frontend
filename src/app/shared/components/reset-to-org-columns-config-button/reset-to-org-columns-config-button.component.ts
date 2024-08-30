import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { ITSystemUsageActions } from 'src/app/store/it-system-usage/actions';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-reset-to-org-columns-config-button',
  templateUrl: './reset-to-org-columns-config-button.component.html',
  styleUrl: './reset-to-org-columns-config-button.component.scss'
})
export class ResetToOrgColumnsConfigButtonComponent {

  constructor(private store: Store, private notificationService: NotificationService) {}

  public resetColumnsConfig(): void {
    this.store.dispatch(ITSystemUsageActions.resetToOrganizationITSystemUsageColumnConfiguration());
    this.notificationService.showDefault($localize`kolonnevisning gendannet til organisationens standardopsætning`);
  }
}
