import { Component } from '@angular/core';
import { BaseCellComponent } from '../../base-cell.component';
import { ParagraphComponent } from '../../../../paragraph/paragraph.component';
import { ExternalPageLinkComponent } from '../../../../external-page-link/external-page-link.component';
import { SearchPropertyPipe } from '../../../../../pipes/column-property.pipe';

@Component({
  selector: 'app-link-cell',
  templateUrl: './link-cell.component.html',
  styleUrl: './link-cell.component.scss',
  imports: [ParagraphComponent, ExternalPageLinkComponent, SearchPropertyPipe],
})
export class LinkCellComponent extends BaseCellComponent {}
