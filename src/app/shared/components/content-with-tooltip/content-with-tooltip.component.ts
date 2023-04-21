import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-content-with-tooltip',
  templateUrl: './content-with-tooltip.component.html',
  styleUrls: ['./content-with-tooltip.component.scss'],
})
export class ContentWithTooltipComponent {
  @Input() public description?: string;
}
