import { Component, Input, OnInit } from '@angular/core';
import { ButtonFillMode } from '@progress/kendo-angular-buttons';

@Component({
  selector: 'app-button',
  templateUrl: 'button.component.html',
  styleUrls: ['button.component.scss'],
})
export class ButtonComponent implements OnInit {
  @Input() public buttonStyle?: ButtonFillMode = 'solid';
  @Input() public faded? = false;

  fillMode: ButtonFillMode = 'solid';

  ngOnInit() {
    if (this.buttonStyle) {
      this.fillMode = this.buttonStyle;
    }
  }
}
