import { Component, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { IdentityNamePair } from '../../../../models/identity-name-pair.model';
import { RegistrationEntityTypes } from '../../../../models/registrations/registration-entity-categories.model';
import { GridUsagesDialogComponent } from '../grid-usages-dialog/grid-usages-dialog.component';

@Component({
  selector: 'app-usage-link',
  standalone: false,
  templateUrl: './grid-usage-link.component.html',
  styleUrl: './grid-usage-link.component.scss',
})
export class UsageLinkComponent {
  constructor(private dialog: MatDialog) {}

  @Input() usingOrganizations!: IdentityNamePair[];
  @Input() name: string = '';
  @Input() type: RegistrationEntityTypes | undefined;
  @Input() rowEntityIdentifier: string | undefined;

  onUsageClick(event: Event) {
    event.preventDefault();
    const dialogRef = this.dialog.open(GridUsagesDialogComponent, {
      data: { usingOrganizations: this.usingOrganizations, title: this.getTitle() },
    });
    const componentInstance = dialogRef.componentInstance;
    componentInstance.type = this.type;
    componentInstance.rowEntityIdentifier = this.rowEntityIdentifier;
  }

  getTitle() {
    return this.getPrefix() + this.name;
  }

  getPrefix() {
    switch (this.type) {
      case 'it-interface':
        return $localize`Organisationer der anvender snitfladen: `;
      case 'it-system':
        return $localize`Anvendelser af `;
      default:
        throw new Error('Usage link not implemented for type: ' + this.type);
    }
  }
}
