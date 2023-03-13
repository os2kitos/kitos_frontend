import { Component, Input, OnInit } from '@angular/core';
import { APIExternalReferenceDataResponseDTO } from 'src/app/api/v2';

@Component({
  selector: 'app-external-reference',
  templateUrl: 'external-reference.component.html',
  styleUrls: ['external-reference.component.scss'],
})
export class ExternalReferenceComponent implements OnInit {
  @Input() public reference?: APIExternalReferenceDataResponseDTO;

  public isValidLink = false;

  ngOnInit() {
    this.isValidLink = this.isValidExternalReference(this.reference?.url);
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
