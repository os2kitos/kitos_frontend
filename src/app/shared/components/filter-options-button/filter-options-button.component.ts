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

  onSaveClick() {
    this.notificationService.show($localize`Filtre og sortering gemt`, PopupMessageType.default);
  }

  onApplyClck() {
    this.notificationService.show($localize`Anvender gemte filtre og sortering`, PopupMessageType.default);
  }

  onDeleteClick() {
    this.notificationService.show($localize`Filtre og sortering slettet`, PopupMessageType.default);
  }
}
