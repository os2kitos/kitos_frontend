import { Component, Input } from '@angular/core';
import { IdentityNamePair } from '../../../../../models/identity-name-pair.model';

@Component({
  selector: 'app-usage-migration-consequences-table',
  templateUrl: './usage-migration-consequences-table.component.html',
  styleUrl: './usage-migration-consequences-table.component.scss',
})
export class UsageMigrationConsequencesTableComponent {
  @Input() title!: string;
  @Input() consequences!: IdentityNamePair[];
  @Input() isCopingToClipboard: boolean = false;
}
