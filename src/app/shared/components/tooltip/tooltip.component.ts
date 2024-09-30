import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-tooltip[text]',
  templateUrl: './tooltip.component.html',
  styleUrls: ['./tooltip.component.scss'],
})
export class TooltipComponent {
  @Input() text!: string;
  @Input() tooltipDelay: number = 0;
  @Input() alignCenter: boolean = false;
}
