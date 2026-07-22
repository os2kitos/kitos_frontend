
import { Component } from '@angular/core';
import { SearchPropertyPipe } from '../../../../../pipes/column-property.pipe';
import { DetailsPageLinkComponent } from '../../../../details-page-link/details-page-link.component';
import { ParagraphComponent } from '../../../../paragraph/paragraph.component';
import { BaseCellComponent } from '../../base-cell.component';

@Component({
  selector: 'app-page-link-cell',
  templateUrl: './page-link-cell.component.html',
  styleUrl: './page-link-cell.component.scss',
  imports: [ParagraphComponent, DetailsPageLinkComponent, SearchPropertyPipe],
})
export class PageLinkCellComponent extends BaseCellComponent {}
