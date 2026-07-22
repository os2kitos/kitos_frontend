import { Component, Input } from '@angular/core';
import { ParagraphFontSizeTypes } from '../../models/sizes/paragraph-font-sizes.model';
import { ContentSpaceBetweenComponent } from '../content-space-between/content-space-between.component';

import { ParagraphComponent } from '../paragraph/paragraph.component';
import { TooltipComponent } from '../tooltip/tooltip.component';
import { InfoIconComponent } from '../icons/info-icon.component';

@Component({
  selector: 'app-content-with-tooltip',
  templateUrl: './content-with-tooltip.component.html',
  styleUrls: ['./content-with-tooltip.component.scss'],
  imports: [ContentSpaceBetweenComponent, ParagraphComponent, TooltipComponent, InfoIconComponent],
})
export class ContentWithTooltipComponent {
  @Input() public description?: string;
  @Input() public iconSize: ParagraphFontSizeTypes = 'x-small';
}
