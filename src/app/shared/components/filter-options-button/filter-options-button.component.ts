import { Component } from '@angular/core';
import { StatePersistingService } from '../../services/state-persisting.service';
import { NotificationService } from '../../services/notification.service';
import { PopupMessageType } from '../../enums/popup-message-type';

@Component({
  selector: 'app-filter-options-button',
  templateUrl: './filter-options-button.component.html',
  styleUrl: './filter-options-button.component.scss'
})
export class FilterOptionsButtonComponent {

  constructor(private localStorage: StatePersistingService, private notificationService: NotificationService) { }

  saveClicked() {
    this.notificationService.show('Filter options saved successfully', PopupMessageType.default);
  }

  applyClicked() {
    this.notificationService.show('Filter options applied successfully', PopupMessageType.default);
  }

  deleteClicked() {
    this.notificationService.show('Filter options deleted successfully', PopupMessageType.default);
  }
}
