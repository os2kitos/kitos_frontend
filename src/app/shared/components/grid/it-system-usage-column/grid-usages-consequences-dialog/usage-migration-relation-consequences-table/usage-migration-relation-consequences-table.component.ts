import { Component, Input } from '@angular/core';
import { ItSystemUsageMigration } from 'src/app/shared/models/it-system-usage/migrations/it-system-usage-migration.model';

@Component({
  selector: 'app-usage-migration-relation-consequences-table[migration]',
  templateUrl: './usage-migration-relation-consequences-table.component.html',
  styleUrl: './usage-migration-relation-consequences-table.component.scss',
})
export class UsageMigrationRelationConsequencesTableComponent {
  @Input() migration!: ItSystemUsageMigration;
  @Input() isCopingToClipboard: boolean = false;

  public formatSystemName(name: string | undefined, deactivated: boolean | undefined) {
    if (!name) return '';
    return deactivated ? $localize`${name} (Ikke tilgængeligt)` : name;
  }
}
