import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-external-page-link',
  templateUrl: './external-page-link.component.html',
  styleUrls: ['./external-page-link.component.scss']
})
export class ExternalPageLinkComponent implements OnInit {
  @Input() public url: string | undefined = '';
  @Input() public title = '';

  public isValidLink = false;

  ngOnInit() {
    this.isValidLink = this.isValidExternalReference(this.url);
  }

  private isValidExternalReference(externalRef?: string): boolean {
    if (!externalRef) return false;

    if (this.validateUrl(externalRef)) {
      return true;
    } else {
      const regexp = /^(kmdsageraabn|kmdedhvis|sbsyslauncher):.*/;
      return regexp.test(externalRef.toLowerCase());
    }
  }

  private validateUrl(url?: string): boolean {
    if (!url) return false;

    const regexp = /(^https?):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-/])$)?/;
    return regexp.test(url.toLowerCase());
  }
}
