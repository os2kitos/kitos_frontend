import { Component, Input } from '@angular/core';
import { Store } from '@ngrx/store';
import {
  GlobalAdminOptionType,
  GlobalAdminOptionTypeItem,
} from 'src/app/shared/models/options/global-admin-option-type.model';
import { GlobalOptionTypeActions } from 'src/app/store/global-admin/global-option-types/actions';

@Component({
  selector: 'app-priority-buttons',
  templateUrl: './priority-buttons.component.html',
  styleUrl: './priority-buttons.component.scss',
})
export class PriorityButtonsComponent {
  @Input() optionTypeItem!: GlobalAdminOptionTypeItem;
  @Input() optionType!: GlobalAdminOptionType;
  @Input() maxPriority!: number;
  @Input() minPriority!: number;

  constructor(private store: Store) {}

  public onIncreasePriority(): void {
    this.onChangePriority(this.optionTypeItem.uuid, this.optionTypeItem.priority + 1);
  }

  public onDecreasePriority(): void {
    this.onChangePriority(this.optionTypeItem.uuid, this.optionTypeItem.priority - 1);
  }

  public isLowestPriority(): boolean {
    return this.optionTypeItem.priority === this.minPriority;
  }

  public isHighestPriority(): boolean {
    return this.optionTypeItem.priority === this.maxPriority;
  }

  private onChangePriority(optionUuid: string, newPriority: number): void {
    this.store.dispatch(
      GlobalOptionTypeActions.updateOptionType(this.optionType, optionUuid, { priority: newPriority })
    );
  }
}
