import { Component, EventEmitter, Input, Output } from '@angular/core';

import { HelpButtonComponent } from '../help-button/help-button.component';

@Component({
  selector: 'app-card-header',
  templateUrl: 'card-header.component.html',
  styleUrls: ['card-header.component.scss'],
  imports: [HelpButtonComponent],
})
export class CardHeaderComponent {
  @Input() public title?: string;
  @Input() public spacer = true;
  @Input() public helpTextKey?: string;
  @Input() public extraButtonTitle?: string;
  @Output() public extraButtonClicked = new EventEmitter<void>();

  public onExtraButtonClicked() {
    this.extraButtonClicked.emit();
  }
}
