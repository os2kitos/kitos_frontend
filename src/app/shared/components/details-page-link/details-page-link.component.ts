import { Component, Input, OnChanges } from '@angular/core';
import { RouterLink } from '@angular/router';
import { getDetailsPageLink } from '../../helpers/link.helpers';
import { RegistrationEntityTypes } from '../../models/registrations/registration-entity-categories.model';
import { LinkFontSizes } from '../../models/sizes/link-font-sizes.model';

@Component({
  selector: 'app-details-page-link',
  templateUrl: './details-page-link.component.html',
  styleUrls: ['./details-page-link.component.scss'],
  imports: [RouterLink],
})
export class DetailsPageLinkComponent implements OnChanges {
  public detailsPageRouterPath: string | null = null;

  @Input() public itemPath?: string;
  @Input() public linkFontSize: LinkFontSizes = 'medium';
  @Input() public itemType: RegistrationEntityTypes | undefined;
  @Input() public subpagePath?: string;
  @Input() public disableRedirect = false;
  @Input() public itemPathIncludesSubmodule = false;

  public ngOnChanges(): void {
    this.detailsPageRouterPath =
      getDetailsPageLink(this.itemPath, this.itemType, this.subpagePath, this.itemPathIncludesSubmodule) ?? null;
  }
}
