import { Component, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { APIIdentityNamePairResponseDTO } from 'src/app/api/v2';
import { BaseComponent } from 'src/app/shared/base/base.component';

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
export class RelationTableComponent extends BaseComponent {
  @Input() public relations!: Array<SystemRelationModel>;
  @Input() public isOutgoing = false;

  constructor(private readonly dialog: MatDialog) {
    super();
  }

  public onEdit(relation: SystemRelationModel) {
    console.log('Edit');
  }

  public onRemove(relation: SystemRelationModel) {
    console.log('Remove');
  }
}
