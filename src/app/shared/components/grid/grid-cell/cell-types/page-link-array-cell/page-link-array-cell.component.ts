import { Component } from '@angular/core';
import { BaseCellComponent } from '../../base-cell.component';
import { ParagraphComponent } from '../../../../paragraph/paragraph.component';

import { DetailsPageLinkWithTooltipComponent } from '../../../../details-page-link/details-page-link-with-tooltip/details-page-link-with-tooltip.component';
import { DetailsPageLinkComponent } from '../../../../details-page-link/details-page-link.component';

@Component({
  selector: 'app-page-link-array-cell',
  templateUrl: './page-link-array-cell.component.html',
  styleUrl: './page-link-array-cell.component.scss',
  imports: [ParagraphComponent, DetailsPageLinkWithTooltipComponent, DetailsPageLinkComponent],
})
export class PageLinkArrayCellComponent extends BaseCellComponent {}
