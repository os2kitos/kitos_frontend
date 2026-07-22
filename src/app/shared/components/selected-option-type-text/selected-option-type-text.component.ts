import { Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseComponent } from '../../base/base.component';
import { addExpiredText } from '../../helpers/option-type.helper';
import { Dictionary } from '../../models/primitives/dictionary.model';

export interface BaseSelectedOptionTypeTextModel {
  uuid: string;
  name: string;
}

@Component({
  selector: 'app-selected-option-type-text',
  templateUrl: './selected-option-type-text.component.html',
  styleUrls: ['./selected-option-type-text.component.scss'],
})
export class SelectedOptionTypeTextComponent<T extends BaseSelectedOptionTypeTextModel>
  extends BaseComponent
  implements OnInit
{
  public selectedOptionText = '';
  @Input() public selectedOption?: T;
  @Input() public availableOptions$!: Observable<Dictionary<T> | undefined>;

  ngOnInit(): void {
    this.subscriptions.add(
      this.availableOptions$.subscribe((optionsDict) => {
        if (optionsDict && this.selectedOption) {
          this.selectedOptionText = this.getOptionName(this.selectedOption, optionsDict);
        }
      }),
    );
  }

  private getOptionName(option: T, availableOptions: Dictionary<T> | undefined): string {
    const availableOption = availableOptions?.[option.uuid];
    return availableOption?.name ?? addExpiredText(option.name);
  }
}
