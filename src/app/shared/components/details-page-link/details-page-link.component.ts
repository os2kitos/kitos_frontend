import { LocationStrategy } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { AppPath } from '../../enums/app-path';
import { RegistrationEntityTypes } from '../../models/registrations/registration-entity-categories.model';

@Component({
  selector: 'app-details-page-link',
  templateUrl: './details-page-link.component.html',
  styleUrls: ['./details-page-link.component.scss'],
})
export class DetailsPageLinkComponent implements OnInit {
  public detailsPagePath: string | null = null;

  @Input() public itemUuid?: string;
  @Input() public linkFontSize: 'medium' | 'small' | 'x-small' = 'medium';
  @Input() public itemType: RegistrationEntityTypes | undefined;

  constructor(private readonly localtionStrategy: LocationStrategy) {}

  private setDetailsPagePath(resourceUrlSegment: string) {
    this.detailsPagePath = `${this.localtionStrategy.getBaseHref()}/${resourceUrlSegment}/${this.itemUuid}`;
  }

  public ngOnInit(): void {
    const isValid = this.itemUuid != undefined && this.itemType != undefined;
    if (isValid) {
      switch (this.itemType) {
        case 'data-processing-registration':
          this.setDetailsPagePath(AppPath.dataProcessing);
          break;
        case 'it-contract':
          this.setDetailsPagePath(AppPath.itContracts);
          break;
        case 'it-interface':
          this.setDetailsPagePath(AppPath.itInterfaces);
          break;
        case 'it-system':
          this.setDetailsPagePath(AppPath.itSystems);
          break;
        case 'it-system-usage':
          this.setDetailsPagePath(AppPath.itSystemUsages);
          break;
        default:
          console.error('Unmapped link itemType', this.itemType);
      }
    } else {
      console.error('Details page link incorrectly configured. Got (uuid,type)', this.itemUuid, this.itemType);
    }
  }
}
