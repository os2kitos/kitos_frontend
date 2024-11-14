import { Component, Input } from '@angular/core';
import { RemovalConflict, RemovalConflictType } from '../removal-conflict-table.component';

@Component({
  selector: 'app-inner-conflict-table',
  templateUrl: './inner-conflict-table.component.html',
  styleUrl: './inner-conflict-table.component.scss',
})
export class InnerConflictTableComponent {
  @Input() public removalConflicts!: RemovalConflict[];
  @Input() public type!: RemovalConflictType;

  public getMainEntityTitle(): string | undefined {
    switch (this.type) {
      case 'dprDataprocessor':
      case 'contracts':
      case 'dprSubDataprocessor':
      case 'systemsRightsHolder':
      case 'systemsArchiveSupplier':
      case 'systemsUsages':
        return undefined;
      case 'interfaces':
        return $localize`Snitflade`;
      case 'systemsExposingInterfaces':
      case 'systemsParentSystem':
        return $localize`IT-System (i kataloget)`;
      default:
        throw new Error(`Unknown removal conflict type: ${this.type}`);
    }
  }

  public getEntityTitle(): string {
    switch (this.type) {
      case 'contracts':
        return $localize`Kontrakt`;
      case 'dprDataprocessor':
      case 'dprSubDataprocessor':
        return $localize`Databehandling`;
      case 'interfaces':
        return $localize`Udstillet på i (IT-System)`;
      case 'systemsExposingInterfaces':
        return $localize`Udstillet snitflade`;
      case 'systemsRightsHolder':
        return $localize`IT-System (i kataloget)`;
      case 'systemsParentSystem':
        return $localize`Overordnet system for (IT-System)`;
      case 'systemsArchiveSupplier':
      case 'systemsUsages':
        return $localize`IT-System (i anvendelse)`;
      default:
        throw new Error(`Unknown removal conflict type: ${this.type}`);
    }
  }

  public getOrganizationTitle(): string {
    switch (this.type) {
      case 'systemsArchiveSupplier':
      case 'systemsUsages':
        return $localize`Anvendt i (organisation)`;
      default:
        return $localize`Oprettet i (organisation)`;
    }
  }
}
