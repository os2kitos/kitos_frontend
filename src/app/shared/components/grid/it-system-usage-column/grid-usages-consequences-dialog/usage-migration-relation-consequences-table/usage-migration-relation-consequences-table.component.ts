
import { Component, Input } from '@angular/core';
import { entityWithUnavailableName } from 'src/app/shared/helpers/string.helpers';
import { ItSystemUsageMigration } from 'src/app/shared/models/it-system-usage/migrations/it-system-usage-migration.model';
import { NativeTableComponent } from '../../../../native-table/native-table.component';
import { ParagraphComponent } from '../../../../paragraph/paragraph.component';

@Component({
  selector: 'app-usage-migration-relation-consequences-table[migration]',
  templateUrl: './usage-migration-relation-consequences-table.component.html',
  styleUrl: './usage-migration-relation-consequences-table.component.scss',
  imports: [ParagraphComponent, NativeTableComponent],
})
export class UsageMigrationRelationConsequencesTableComponent {
  @Input() migration!: ItSystemUsageMigration;
  @Input() isCopyingToClipboard: boolean = false;

  public formatSystemName(name: string | undefined, deactivated: boolean | undefined) {
    if (!name) return '';
    return entityWithUnavailableName(name, deactivated ?? false);
  }
}
