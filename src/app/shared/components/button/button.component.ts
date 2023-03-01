import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ButtonFillMode, ButtonThemeColor } from '@progress/kendo-angular-buttons';

@Component({
  selector: 'app-button',
  templateUrl: 'button.component.html',
  styleUrls: ['button.component.scss'],
})
export class ButtonComponent {
  @Input() public buttonStyle: ButtonFillMode = 'solid';
  @Input() public themeColor: ButtonThemeColor = 'primary';
  @Input() public faded = false;
  @Input() public disabled = false;
  @Input() public loading: boolean | null = false;
  @Input() public type: 'button' | 'submit' = 'button';

  @Output() buttonClick = new EventEmitter();

  public onButtonClick() {
    if (!this.disabled && !this.loading) {
      this.buttonClick.emit();
    }
  }
}
