import { Component, Input } from '@angular/core';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-removal-conflict-table',
  templateUrl: './removal-conflict-table.component.html',
  styleUrl: './removal-conflict-table.component.scss',
})
export class RemovalConflictTableComponent {
  @Input() public removalConflicts$!: Observable<RemovalConflict[]>;
  @Input() public organizationName!: string;
  @Input() public type!: RemovalConflictType;
  @Input() public isCopying: boolean = false;

  public readonly defaultOrganizationName = 'Fælles Kommune';

  public getConflictDescription(): string {
    switch (this.type) {
      case 'contracts':
        return $localize`Kontrakter hvor organisationen "${this.organizationName}" er sat som "Leverandør", og hvor feltet dermed nulstilles`;
      case 'dprDataprocessor':
        return $localize`Registreringer i modulet "Databehandling", hvor organisationen "${this.organizationName}" fjernes som databehandler`;
      case 'dprSubDataprocessor':
        return $localize`Registreringer i modulet "Databehandling", hvor organisationen "${this.organizationName}" fjernes som underdatabehandler`;
      case 'interfaces':
        return $localize`Snitflader som flyttes til "${this.defaultOrganizationName}", da de er udstillet på IT-Systemer oprettet i andre organisationer`;
      case 'systemsExposingInterfaces':
        return $localize`IT-Systemer som flyttes til "${this.defaultOrganizationName}", da de udstiller Snitflader oprettet i andre organisationer`;
      case 'systemsRightsHolder':
        return $localize`IT-Systemer i kataloget, hvor "${this.organizationName}" er sat som "Rettighedshaver", og hvor feltet dermed nulstilles`;
      case 'systemsParentSystem':
        return $localize`IT-Systemer som flyttes til "${this.defaultOrganizationName}", da de er sat som "Overordnet IT-System" på systemer oprettet i andre organisationer`;
      case 'systemsArchiveSupplier':
        return $localize`IT-Systemer hvor organisationen "${this.organizationName}" er sat som "Arkiveringsleverandør", og hvor feltet dermed nulstilles`;
      case 'systemsUsages':
        return $localize`IT-Systemer som flyttes til "${this.defaultOrganizationName}", da de stadig er er i anvendelse i andre organisationer`;
      default:
        throw new Error(`Unknown removal conflict type: ${this.type}`);
    }
  }
}

export interface RemovalConflict {
  mainEntityName: string | undefined;
  entityName: string;
  organizationName: string;
}

export type RemovalConflictType =
  | 'contracts'
  | 'dprDataprocessor'
  | 'dprSubDataprocessor'
  | 'systemsRightsHolder'
  | 'systemsExposingInterfaces'
  | 'systemsParentSystem'
  | 'systemsUsages'
  | 'systemsArchiveSupplier'
  | 'interfaces';
