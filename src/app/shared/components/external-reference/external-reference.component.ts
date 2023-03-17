import { Component, Input, OnInit } from '@angular/core';
import { APIExternalReferenceDataResponseDTO } from 'src/app/api/v2';
import { validateUrl } from '../../helpers/link.helpers';

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

    if (validateUrl(externalRef)) {
      return true;
    } else {
      const regexp = /^(kmdsageraabn|kmdedhvis|sbsyslauncher):.*/;
      return regexp.test(externalRef.toLowerCase());
    }
  }
}
