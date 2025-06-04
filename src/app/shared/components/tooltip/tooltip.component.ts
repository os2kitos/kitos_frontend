import { NgClass } from '@angular/common';
import { Component, Input } from '@angular/core';
import { MatTooltip } from '@angular/material/tooltip';

@Component({
  selector: 'app-tooltip[text]',
  templateUrl: './tooltip.component.html',
  styleUrls: ['./tooltip.component.scss'],
  imports: [MatTooltip, NgClass],
})
export class TooltipComponent {
  @Input() text!: string;
  @Input() tooltipDelay: number = 0;
  @Input() alignCenter: boolean = false;
  @Input() matchContentWidth: boolean = false;
}
