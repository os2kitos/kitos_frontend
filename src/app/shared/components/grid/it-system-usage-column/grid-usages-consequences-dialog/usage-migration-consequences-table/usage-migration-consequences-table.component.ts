import { Component, Input } from '@angular/core';
import { IdentityNamePair } from '../../../../../models/identity-name-pair.model';
import { ParagraphComponent } from '../../../../paragraph/paragraph.component';
import { NgIf, NgFor } from '@angular/common';
import { NativeTableComponent } from '../../../../native-table/native-table.component';

@Component({
  selector: 'app-usage-migration-consequences-table',
  templateUrl: './usage-migration-consequences-table.component.html',
  styleUrl: './usage-migration-consequences-table.component.scss',
  imports: [ParagraphComponent, NgIf, NativeTableComponent, NgFor],
})
export class UsageMigrationConsequencesTableComponent {
  @Input() title!: string;
  @Input() consequences!: IdentityNamePair[];
  @Input() isCopingToClipboard: boolean = false;
}
