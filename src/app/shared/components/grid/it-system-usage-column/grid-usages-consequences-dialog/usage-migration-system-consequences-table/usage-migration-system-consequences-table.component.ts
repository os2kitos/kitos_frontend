import { Component, Input } from '@angular/core';
import { ItSystemUsageMigration } from 'src/app/shared/models/it-system-usage/migrations/it-system-usage-migration.model';

@Component({
  selector: 'app-usage-migration-system-consequences-table[migration]',
  templateUrl: './usage-migration-system-consequences-table.component.html',
  styleUrl: './usage-migration-system-consequences-table.component.scss',
})
export class UsageMigrationSystemConsequencesTableComponent {
  @Input() migration!: ItSystemUsageMigration;
  @Input() isCopingToClipboard: boolean = false;
}
