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
    this.notificationService.show($localize`Filtre og sortering gemt`, PopupMessageType.default);
  }

  applyClicked() {
    this.notificationService.show($localize`Anvender gemte filtre og sortering`, PopupMessageType.default);
  }

  deleteClicked() {
    this.notificationService.show($localize`Filtre og sortering slettet`, PopupMessageType.default);
  }
}
