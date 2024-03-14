import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ThemePalette } from '@angular/material/core';

@Component({
  selector: 'app-button',
  templateUrl: 'button.component.html',
  styleUrls: ['button.component.scss'],
})
export class ButtonComponent implements OnInit {
  @Input() public buttonStyle: 'primary' | 'secondary' | 'tertiary' = 'primary';
  @Input() public color: ThemePalette = 'primary';
  @Input() public size: 'small' | 'medium' | 'large' = 'medium';
  @Input() public disabled = false;
  @Input() public loading: boolean | null = false;
  @Input() public type: 'button' | 'submit' = 'button';
  @Input() public tooltip?: string;

  @Output() buttonClick = new EventEmitter();

  public hasTooltip = false;

  ngOnInit() {
    if (this.tooltip) {
      this.hasTooltip = true;
    }
  }

  public onButtonClick() {
    if (!this.disabled && !this.loading) {
      this.buttonClick.emit();
    }
  }
}
