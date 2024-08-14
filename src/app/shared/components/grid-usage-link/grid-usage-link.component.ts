import { Component, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { GridUsagesDialogComponent } from '../grid-usages-dialog/grid-usages-dialog.component';
import { RegistrationEntityTypes } from '../../models/registrations/registration-entity-categories.model';

@Component({
  selector: 'app-usage-link',
  standalone: false,
  templateUrl: './grid-usage-link.component.html',
  styleUrl: './grid-usage-link.component.scss',
})
export class UsageLinkComponent {
  constructor(private dialog: MatDialog) {}

  @Input() usages!: string[];
  @Input() name: string = '';
  @Input() type: RegistrationEntityTypes | undefined;


  onUsageClick(event: Event) {
    event.preventDefault();
    this.dialog.open(GridUsagesDialogComponent, {
      data: { usages: this.usages, title: this.getTitle() },
    });
  }

  getTitle() {
    return this.getPrefix() + this.name;
  }

  getPrefix() {
    switch (this.type) {
     case 'it-interface':
        return $localize`Organisationer der anvender snitfladen: `;
      case 'it-system':
        return $localize`Anveldelser af `;
      default:
        throw new Error('Usage link not implemented for type: ' + this.type);
    }
  }
}
