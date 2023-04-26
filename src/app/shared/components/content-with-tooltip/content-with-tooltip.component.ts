import { Component, Input } from '@angular/core';
import { ParagraphFontSizeTypes } from '../../models/sizes/paragraph-font-sizes.model';

@Component({
  selector: 'app-content-with-tooltip',
  templateUrl: './content-with-tooltip.component.html',
  styleUrls: ['./content-with-tooltip.component.scss'],
})
export class ContentWithTooltipComponent {
  @Input() public description?: string;
  @Input() public iconSize: ParagraphFontSizeTypes = 'x-small';
}
