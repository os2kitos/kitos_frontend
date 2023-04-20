import { Component, Input } from '@angular/core';
import { APIIdentityNamePairResponseDTO } from 'src/app/api/v2';

export interface SystemRelationModel {
  uuid: string;
  systemUsage: APIIdentityNamePairResponseDTO;
  relationInterface?: APIIdentityNamePairResponseDTO;
  associatedContract?: APIIdentityNamePairResponseDTO;
  relationFrequency?: APIIdentityNamePairResponseDTO;
  description?: string;
  urlReference?: string;
}

@Component({
  selector: 'app-relation-table[relations]',
  templateUrl: './relation-table.component.html',
  styleUrls: ['./relation-table.component.scss'],
})
export class RelationTableComponent {
  @Input() public relations!: Array<SystemRelationModel>;
  @Input() public isOutgoing = false;
}
