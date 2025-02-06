import { Component, Input, OnInit } from '@angular/core';
import { getDetailsPageLink } from '../../helpers/link.helpers';
import { RegistrationEntityTypes } from '../../models/registrations/registration-entity-categories.model';
import { LinkFontSizes } from '../../models/sizes/link-font-sizes.model';

@Component({
  selector: 'app-details-page-link',
  templateUrl: './details-page-link.component.html',
  styleUrls: ['./details-page-link.component.scss'],
})
export class DetailsPageLinkComponent implements OnInit {
  public detailsPageRouterPath: string | null = null;

  @Input() public itemPath?: string;
  @Input() public linkFontSize: LinkFontSizes = 'medium';
  @Input() public itemType: RegistrationEntityTypes | undefined;
  @Input() public subpagePath?: string;
  @Input() public disableRedirect = false;
  @Input() public itemPathIncludesSubmodule = false;

  public ngOnInit(): void {
    const path = getDetailsPageLink(this.itemPath, this.itemType, this.subpagePath, this.itemPathIncludesSubmodule);
    if (path) {
      this.detailsPageRouterPath = path;
    }
  }
}
