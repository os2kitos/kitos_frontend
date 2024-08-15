import { Component, Input } from '@angular/core';
import { StatePersistingService } from '../../services/state-persisting.service';
import { NotificationService } from '../../services/notification.service';
import { PopupMessageType } from '../../enums/popup-message-type';
import { Store } from '@ngrx/store';
import { selectCurrentFilter } from 'src/app/store/it-system-usage/selectors';
import { first } from 'rxjs';
import { RegistrationEntityTypes } from '../../models/registrations/registration-entity-categories.model';
import { CompositeFilterDescriptor, SortDescriptor } from '@progress/kendo-data-query';
import { ITSystemUsageActions } from 'src/app/store/it-system-usage/actions';

@Component({
  selector: 'app-filter-options-button',
  templateUrl: './filter-options-button.component.html',
  styleUrl: './filter-options-button.component.scss',
})
export class FilterOptionsButtonComponent {
  @Input() entityType!: RegistrationEntityTypes;

  constructor(
    private store: Store,
    private localStorage: StatePersistingService,
    private notificationService: NotificationService
  ) {}

  onSaveClick() {
    this.store
      .select(selectCurrentFilter)
      .pipe(first())
      .subscribe((currentFilter) => {
        this.saveFilterToLocalStorage(currentFilter);
      });
    this.notificationService.show($localize`Filtre og sortering gemt`, PopupMessageType.default);
  }

  onApplyClck() {
    this.store.dispatch(ITSystemUsageActions.applyITSystemFilter(this.getFilterFromLocalStorage()));
    this.notificationService.show($localize`Anvender gemte filtre og sortering`, PopupMessageType.default);
  }

  onDeleteClick() {
    this.notificationService.show($localize`Filtre og sortering slettet`, PopupMessageType.default);
  }

  private getFilterFromLocalStorage(): { compFilter: CompositeFilterDescriptor | undefined; sort: SortDescriptor[] | undefined } {
    return this.localStorage.get(this.getLocalStorageFilterKey());
  }

  private saveFilterToLocalStorage(filter: { compFilter: CompositeFilterDescriptor | undefined; sort: SortDescriptor[] | undefined }) {
    this.localStorage.set(this.getLocalStorageFilterKey(), filter);
  }

  private getLocalStorageFilterKey() {
    return this.entityType + '-saved-filter';
  }
}
