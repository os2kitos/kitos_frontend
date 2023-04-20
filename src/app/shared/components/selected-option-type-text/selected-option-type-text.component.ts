import { Component, Input, OnInit } from '@angular/core';
import { APIIdentityNamePairResponseDTO, APIRegularOptionResponseDTO } from 'src/app/api/v2';
import { mapObsoleteValue } from '../../helpers/obsolete-option.helpers';
import { Dictionary } from '../../models/primitives/dictionary.model';

@Component({
  selector: 'app-selected-option-type-text[availableOptions]',
  templateUrl: './selected-option-type-text.component.html',
  styleUrls: ['./selected-option-type-text.component.scss'],
})
export class SelectedOptionTypeTextComponent implements OnInit {
  public selectedOptionText = '';
  @Input() public selectedOption?: APIIdentityNamePairResponseDTO;
  @Input() public availableOptions!: Dictionary<APIRegularOptionResponseDTO>;

  ngOnInit(): void {
    if (this.selectedOption) {
      this.selectedOptionText = mapObsoleteValue(
        this.selectedOption.uuid,
        this.selectedOption.name,
        this.availableOptions
      );
    }
  }
}
