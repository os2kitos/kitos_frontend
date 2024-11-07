import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import {
  APIChangeOrganizationUnitRegistrationV2RequestDTO,
  APINamedEntityWithEnabledStatusV2DTO,
  APINamedEntityWithUserFullNameV2DTO,
} from 'src/app/api/v2';
import { BaseComponent } from 'src/app/shared/base/base.component';
import { ConfirmationDialogComponent } from 'src/app/shared/components/dialogs/confirmation-dialog/confirmation-dialog.component';
import { copyObject } from 'src/app/shared/helpers/object.helpers';
import { OrganizationUnitRegistrationTypes } from 'src/app/shared/models/organization/organization-unit/organization-unit-registration-type';
import {
  PaymentRegistrationModel,
  RegistrationModel,
} from 'src/app/shared/models/organization/organization-unit/organization-unit-registration.model';
import { OrganizationUnitActions } from 'src/app/store/organization/organization-unit/actions';

@Component({
  template: '',
})
export class RegistrationBaseComponent<T> extends BaseComponent implements OnInit {
  @Input() public unitUuid!: string;
  @Input() public registrationType!: OrganizationUnitRegistrationTypes;
  @Input() public areAllSelected$!: Observable<boolean>;
  @Input() public canEditRegistrations!: boolean;

  public title = '';
  public nameColumnTitle = '';

  constructor(protected store: Store, private dialog: MatDialog) {
    super();
  }

  ngOnInit(): void {
    switch (this.registrationType) {
      case 'unitRights':
        this.title = $localize`Roller`;
        this.nameColumnTitle = $localize`Rolle`;
        break;
      case 'itContract':
        this.title = $localize`Kontrakter (ansvarlig organisationsenhed)`;
        this.nameColumnTitle = $localize`Kontraktnavn`;
        break;
      case 'internalPayment':
        this.title = $localize`Interne betalinger`;
        this.nameColumnTitle = $localize`Kontraktnavn`;
        break;
      case 'externalPayment':
        this.title = $localize`Eksterne betalinger`;
        this.nameColumnTitle = $localize`Kontraktnavn`;
        break;
      case 'relevantSystem':
        this.title = $localize`System (relevant organisationsenhed)`;
        this.nameColumnTitle = $localize`Systemnavn`;
        break;
      case 'responsibleSystem':
        this.title = $localize`System (ansvarlig organisationsenhed)`;
        this.nameColumnTitle = $localize`Systemnavn`;
        break;
    }
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
    dialogInstance.confirmationType = 'Custom';
    dialogInstance.customConfirmText = $localize`Slet`;
    dialogInstance.customDeclineText = $localize`Annuller`;

    this.subscriptions.add(
      dialogRef.afterClosed().subscribe((result) => {
        if (result === true) {
          this.store.dispatch(OrganizationUnitActions.removeRegistrations(this.unitUuid, request));
        }
      })
    );
  }

  public changeSelectRegistrationState(registration: RegistrationModel<T> | PaymentRegistrationModel) {
    const copiedRegistration = copyObject(registration);
    copiedRegistration.isSelected = !copiedRegistration.isSelected;

    switch (this.registrationType) {
      case 'unitRights':
        this.store.dispatch(
          OrganizationUnitActions.changeOrganizationUnitRegistrationSelect(
            copiedRegistration as RegistrationModel<APINamedEntityWithUserFullNameV2DTO>
          )
        );
        break;
      case 'itContract':
        this.store.dispatch(
          OrganizationUnitActions.changeItContractRegistrationSelect(
            copiedRegistration as RegistrationModel<APINamedEntityWithUserFullNameV2DTO>
          )
        );
        break;
      case 'internalPayment':
        this.store.dispatch(
          OrganizationUnitActions.changeInternalPaymentSelect(copiedRegistration as PaymentRegistrationModel)
        );
        break;
      case 'externalPayment':
        this.store.dispatch(
          OrganizationUnitActions.changeExternalPaymentSelect(copiedRegistration as PaymentRegistrationModel)
        );
        break;
      case 'relevantSystem':
        this.store.dispatch(
          OrganizationUnitActions.changeRelevantSystemSelect(
            copiedRegistration as RegistrationModel<APINamedEntityWithEnabledStatusV2DTO>
          )
        );
        break;
      case 'responsibleSystem':
        this.store.dispatch(
          OrganizationUnitActions.changeResponsibleSystemSelect(
            copiedRegistration as RegistrationModel<APINamedEntityWithEnabledStatusV2DTO>
          )
        );
        break;
    }
  }

  public removeSingleRegistration(regId: number | undefined) {
    if (!regId) return;

    let request: APIChangeOrganizationUnitRegistrationV2RequestDTO = {};

    switch (this.registrationType) {
      case 'unitRights':
        request = { organizationUnitRights: [regId] };
        break;
      case 'itContract':
        request = { itContractRegistrations: [regId] };
        break;
      case 'relevantSystem':
        request = { relevantSystems: [regId] };
        break;
      case 'responsibleSystem':
        request = { responsibleSystems: [regId] };
        break;
      default:
        throw new Error('Payment types require custom implementation!');
    }
    this.removeRegistration(request);
  }
}
