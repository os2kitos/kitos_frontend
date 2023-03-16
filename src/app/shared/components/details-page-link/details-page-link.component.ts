import { LocationStrategy } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { AppPath } from '../../enums/app-path';

@Component({
  selector: 'app-details-page-link',
  templateUrl: './details-page-link.component.html',
  styleUrls: ['./details-page-link.component.scss'],
})
export class DetailsPageLinkComponent implements OnInit {
  detailsPagePath: string | null = null;

  @Input() itemUuid: string | undefined = undefined;
  @Input() itemType:
    | 'it-system'
    | 'it-system-usage'
    | 'it-interface'
    | 'data-processing-registration'
    | 'it-contract'
    | undefined;

  constructor(private readonly localtionStrategy: LocationStrategy) {}

  ngOnInit(): void {
    const isValid = this.itemUuid != undefined && this.itemType != undefined;
    if (isValid) {
      let resourceUrlSegment: string | null = null;
      switch (this.itemType) {
        case 'data-processing-registration':
          resourceUrlSegment = AppPath.dataProcessing;
          break;
        case 'it-contract':
          resourceUrlSegment = AppPath.contracts;
          break;
        case 'it-interface':
          resourceUrlSegment = AppPath.itInterfaces;
          break;
        case 'it-system':
          resourceUrlSegment = AppPath.itSystems;
          break;
        case 'it-system-usage':
          resourceUrlSegment = AppPath.itSystemUsages;
          break;
        default:
          console.error('Unmapped link itemType', this.itemType);
      }
      if (resourceUrlSegment !== null) {
        this.detailsPagePath = `${this.localtionStrategy.getBaseHref()}/${resourceUrlSegment}/${this.itemUuid}`;
      }
    } else {
      console.error('Details page link incorrectly configured. Got (uuid,type)', this.itemUuid, this.itemType);
    }
  }
}
