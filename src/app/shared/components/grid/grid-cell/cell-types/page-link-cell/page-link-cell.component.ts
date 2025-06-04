import { Component } from '@angular/core';
import { BaseCellComponent } from '../../base-cell.component';
import { ParagraphComponent } from '../../../../paragraph/paragraph.component';
import { NgIf } from '@angular/common';
import { DetailsPageLinkComponent } from '../../../../details-page-link/details-page-link.component';
import { SearchPropertyPipe } from '../../../../../pipes/column-property.pipe';

@Component({
  selector: 'app-page-link-cell',
  templateUrl: './page-link-cell.component.html',
  styleUrl: './page-link-cell.component.scss',
  imports: [ParagraphComponent, NgIf, DetailsPageLinkComponent, SearchPropertyPipe],
})
export class PageLinkCellComponent extends BaseCellComponent {}
