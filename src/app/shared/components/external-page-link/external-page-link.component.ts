import { Component, Input, OnInit } from '@angular/core';
import { validateExternalReferenceUrl, validateUrl } from '../../helpers/link.helpers';
import { LinkFontSizes } from '../../models/sizes/link-font-sizes.model';
import { NgIf } from '@angular/common';
import { ContentWithTooltipComponent } from '../content-with-tooltip/content-with-tooltip.component';
import { ParagraphComponent } from '../paragraph/paragraph.component';

@Component({
  selector: 'app-external-page-link',
  templateUrl: './external-page-link.component.html',
  styleUrls: ['./external-page-link.component.scss'],
  imports: [NgIf, ContentWithTooltipComponent, ParagraphComponent],
})
export class ExternalPageLinkComponent implements OnInit {
  @Input() public url: string | undefined = '';
  @Input() public linkFontSize: LinkFontSizes = 'medium';
  @Input() public title?: string;
  public readonly invalidLinkPrefix = $localize`Ugyldigt link: `;

  public isValidLink = false;

  ngOnInit() {
    this.isValidLink = validateUrl(this.url) || validateExternalReferenceUrl(this.url);

    if (!this.title) {
      if (this.isValidLink) {
        this.title = $localize`Læs mere`;
      }
    }
  }
}
