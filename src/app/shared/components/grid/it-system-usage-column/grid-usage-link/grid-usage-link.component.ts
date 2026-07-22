import { Component, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { IdentityNamePair } from '../../../../models/identity-name-pair.model';
import { RegistrationEntityTypes } from '../../../../models/registrations/registration-entity-categories.model';
import { GridUsagesDialogComponent } from '../grid-usages-dialog/grid-usages-dialog.component';
import { ParagraphComponent } from '../../../paragraph/paragraph.component';


@Component({
  selector: 'app-usage-link',
  templateUrl: './grid-usage-link.component.html',
  styleUrl: './grid-usage-link.component.scss',
  imports: [ParagraphComponent],
})
export class UsageLinkComponent {
  constructor(private dialog: MatDialog) {}

  @Input() usingOrganizations!: IdentityNamePair[];
  @Input() name: string = '';
  @Input() type: RegistrationEntityTypes | undefined;
  @Input() rowEntityIdentifier: string | undefined;

  onUsageClick(event: Event) {
    event.preventDefault();
    const dialogRef = this.dialog.open(GridUsagesDialogComponent);
    const componentInstance = dialogRef.componentInstance;
    componentInstance.type = this.type;
    componentInstance.rowEntityIdentifier = this.rowEntityIdentifier;
    componentInstance.usingOrganizations = this.usingOrganizations;
    componentInstance.title = this.getTitle();
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
