import { Component, Input } from '@angular/core';
import { TooltipComponent } from '../tooltip/tooltip.component';

@Component({
  selector: 'app-recommended-badge',
  imports: [TooltipComponent],
  templateUrl: './recommended-badge.component.html',
  styleUrls: ['./recommended-badge.component.scss'],
})
export class RecommendedBadgeComponent {
  @Input() public visible: boolean = false;
  @Input() public filled: boolean = false;
  @Input() public showTooltip: boolean = true;

}
