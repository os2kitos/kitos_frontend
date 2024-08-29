import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { NotificationService } from '../../services/notification.service';
import { ITSystemUsageActions } from 'src/app/store/it-system-usage/actions';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from '../dialogs/confirmation-dialog/confirmation-dialog.component';

@Component({
  selector: 'app-local-admin-column-config-button',
  templateUrl: './local-admin-column-config-button.component.html',
  styleUrl: './local-admin-column-config-button.component.scss'
})
export class LocalAdminColumnConfigButtonComponent {

  private readonly organizationName = "HENT KOMMUNENAVN HER";

  constructor(private store: Store, private notificationService: NotificationService, private dialog: MatDialog) {}

  public onSave(): void {
    this.dialog.open(ConfirmationDialogComponent, {
      data: {
        title: $localize`Gem kolonneopsætning`,
        bodyText: $localize`Er du sikker på at du vil gemme nuværende kolonneopsætning af felter som standard til ` + this.organizationName,
        confirmText: $localize`Gem`,
        declineText: $localize`Annuller`,
      },
    }).afterClosed().subscribe((pressedConfirm) => {
      if (pressedConfirm) {
        this.store.dispatch(ITSystemUsageActions.saveOrganizationalITSystemUsageColumnConfiguration());
        this.notificationService.showDefault($localize`Kolonneopsætningen er gemt for organisationen`);
      }
    });
  }

  public onDelete(): void {
    this.dialog.open(ConfirmationDialogComponent, {
      data: {
        title: $localize`Slet kolonneopsætning`,
        bodyText: $localize`Er du sikker på at du vil slette standard kolonneopsætning af felter til ` + this.organizationName,
        confirmText: $localize`Slet`,
        declineText: $localize`Annuller`,
      },
    }).afterClosed().subscribe((pressedConfirm) => {
      if (pressedConfirm) {
        this.store.dispatch(ITSystemUsageActions.deleteOrganizationalITSystemUsageColumnConfiguration());
        this.notificationService.showDefault($localize`Organisationens kolonneopsætningen er slettet og overblikket er nulstillet`);
      }
    });
  }

}
