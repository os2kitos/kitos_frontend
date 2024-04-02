import { Component, Input, OnInit } from '@angular/core';
import { APIExternalReferenceDataResponseDTO } from 'src/app/api/v2';
import { validateExternalReferenceUrl } from '../../helpers/link.helpers';

@Component({
  selector: 'app-external-reference',
  templateUrl: 'external-reference.component.html',
  styleUrls: ['external-reference.component.scss'],
})
export class ExternalReferenceComponent implements OnInit {
  @Input() public reference?: APIExternalReferenceDataResponseDTO;

  public isValidLink = false;

  public invalidText = '';

  ngOnInit() {
    this.isValidLink = validateExternalReferenceUrl(this.reference?.url);
    if (!this.isValidLink) {
      this.invalidText = this.reference?.title + (this.reference?.url ? `(${this.reference?.url})` : '');
    }
  }
}
