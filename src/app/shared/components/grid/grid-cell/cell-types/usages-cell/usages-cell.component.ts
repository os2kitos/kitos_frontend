import { Component } from '@angular/core';
import { BaseCellComponent } from '../../base-cell.component';
import { NgIf } from '@angular/common';
import { UsageLinkComponent } from '../../../it-system-usage-column/grid-usage-link/grid-usage-link.component';
import { SearchPropertyPipe } from '../../../../../pipes/column-property.pipe';

@Component({
  selector: 'app-usages-cell',
  templateUrl: './usages-cell.component.html',
  styleUrl: './usages-cell.component.scss',
  imports: [NgIf, UsageLinkComponent, SearchPropertyPipe],
})
export class UsagesCellComponent extends BaseCellComponent {}
