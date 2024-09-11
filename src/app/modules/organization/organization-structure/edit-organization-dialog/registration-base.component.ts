import { Component, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { APIChangeOrganizationUnitRegistrationV2RequestDTO } from 'src/app/api/v2';
import { BaseComponent } from 'src/app/shared/base/base.component';
import { ConfirmationDialogComponent } from 'src/app/shared/components/dialogs/confirmation-dialog/confirmation-dialog.component';
import { OrganizationUnitRegistrationTypes } from 'src/app/shared/models/organization-unit/organization-unit-registration-type';
import { OrganizationUnitActions } from 'src/app/store/organization-unit/actions';

@Component({
  template: '',
})
export class RegistrationBaseComponent extends BaseComponent {
  @Input() public unitUuid!: string;

  public selectAllInTable = false;
  constructor(protected store: Store, private dialog: MatDialog) {
    super();
  }

  public changeRegistrationCollectionState(value: boolean | undefined, type: OrganizationUnitRegistrationTypes) {
    this.store.dispatch(OrganizationUnitActions.changeCollectionSelect(value ?? false, type));
  }

  public removeRegistration(request: APIChangeOrganizationUnitRegistrationV2RequestDTO) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent);
    const dialogInstance = dialogRef.componentInstance;
    dialogInstance.confirmColor = 'warn';
    dialogInstance.title = $localize`Vil du slette denne registrering?`;
    dialogInstance.bodyText = $localize`Denne handling kan ikke fortrydes.`;
    dialogInstance.confirmText = $localize`Slet`;

    this.subscriptions.add(
      dialogRef.afterClosed().subscribe(([result]) => {
        if (result === true) {
          this.store.dispatch(OrganizationUnitActions.removeRegistrations(this.unitUuid, request));
        }
      })
    );
  }
}
