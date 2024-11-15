import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ButtonStyle } from 'src/app/shared/models/buttons/button-style.model';

@Component({
  selector: 'app-icon-button',
  templateUrl: './icon-button.component.html',
  styleUrls: ['./icon-button.component.scss'],
})
export class IconButtonComponent {
  @Input() public disabled = false;
  @Input() public loading: boolean | null = false;
  @Input() public type: 'button' | 'submit' = 'button';
  @Input() public buttonStyle: ButtonStyle = 'tertiary';
  @Input() public tooltipText?: string;

  @Output() buttonClick = new EventEmitter();

  public onButtonClick() {
    if (!this.disabled && !this.loading) {
      this.buttonClick.emit();
    }
  }
}
