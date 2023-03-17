import { Component, Input } from '@angular/core';
import { APIExternalReferenceDataResponseDTO } from 'src/app/api/v2';

@Component({
  selector: 'app-external-reference',
  templateUrl: 'external-reference.component.html',
  styleUrls: ['external-reference.component.scss'],
})
export class ExternalReferenceComponent {
  @Input() public reference?: APIExternalReferenceDataResponseDTO;
}
