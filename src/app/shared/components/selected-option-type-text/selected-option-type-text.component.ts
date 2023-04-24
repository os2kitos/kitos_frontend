import { Component, Input, OnInit } from '@angular/core';
import { Dictionary } from '../../models/primitives/dictionary.model';

export interface BaseSelectedOptionTypeTextModel {
  uuid: string;
  name: string;
}

@Component({
  selector: 'app-selected-option-type-text[availableOptions]',
  templateUrl: './selected-option-type-text.component.html',
  styleUrls: ['./selected-option-type-text.component.scss'],
})
export class SelectedOptionTypeTextComponent<T extends BaseSelectedOptionTypeTextModel> implements OnInit {
  public selectedOptionText = '';
  @Input() public selectedOption?: T;
  @Input() public availableOptions!: Dictionary<T>;

  ngOnInit(): void {
    if (this.selectedOption) {
      const availableOption = this.availableOptions[this.selectedOption.uuid];
      const obsoletedText = $localize`udgået`;
      this.selectedOptionText = availableOption?.name ?? `${this.selectedOption.name} (${obsoletedText})`;
    }
  }
}
