import { Injectable, OnDestroy } from '@angular/core';
import { Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { DataProcessingActions } from 'src/app/store/data-processing/actions';
import { ITContractActions } from 'src/app/store/it-contract/actions';
import { ITInterfaceActions } from 'src/app/store/it-system-interfaces/actions';
import { ITSystemUsageActions } from 'src/app/store/it-system-usage/actions';
import { ITSystemActions } from 'src/app/store/it-system/actions';
import { FkOrgActions } from 'src/app/store/local-admin/fk-org/actions';
import { LocalOptionTypeActions } from 'src/app/store/local-option-types/actions';
import { OrganizationActions } from 'src/app/store/organization/actions';
import { OrganizationUnitActions } from 'src/app/store/organization/organization-unit/actions';
import { OrganizationUserActions } from 'src/app/store/organization/organization-user/actions';
import { UIModuleConfigActions } from 'src/app/store/organization/ui-module-customization/actions';
import { PopupMessageActions } from 'src/app/store/popup-messages/actions';
import { UserActions } from 'src/app/store/user-store/actions';
import { PopupMessageType } from '../enums/popup-message-type';
import { createPopupMessage } from '../models/popup-messages/popup-message.model';

@Injectable({ providedIn: 'root' })
export class NotificationService implements OnDestroy {
  public subscriptions = new Subscription();

  private readonly getMasterDataError = $localize`Kunne ikke hente stamdata for organisationen`;
  private readonly patchMasterDataSuccess = $localize`Stamdata for organisationen blev opdateret`;
  private readonly patchMasterDataError = $localize`Stamdata for organisationen kunne ikke opdateres`;

  constructor(private actions$: Actions, private readonly store: Store) {}

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  public subscribeOnActions() {
    this.subscribeAsDefault(UserActions.loginSuccess, $localize`Du er nu logget ind`);
    this.subscribeAsError(UserActions.loginError, $localize`Kunne ikke logge ind`);

    this.subscribeAsDefault(UserActions.logoutSuccess, $localize`Du er nu logget ud`);
    this.subscribeAsError(UserActions.logoutError, $localize`Kunne ikke logge ud`);

    this.subscribeToOrganizationEvents();
    this.subscribeToItSystemEvents();
    this.subscribeToItContractEvents();
    this.subscribeToDprEvents();

    this.subscribeToLocalAdminNotifications();

    this.subscribeToExternalReferenceManagementEvents();
    this.subscribeToRoleNotifications();
    this.subscribeToFkOrganizationEvents();
  }

  private subscribeToLocalAdminNotifications() {
    this.subscribeAsDefault(LocalOptionTypeActions.updateOptionTypeSuccess, $localize`Enheden blev opdateret`);
    this.subscribeAsError(LocalOptionTypeActions.updateOptionTypeError, $localize`Enheden kunne ikke opdateres`);
  }

  private subscribeToOrganizationEvents() {
    this.subscribeAsDefault(OrganizationUnitActions.deleteOrganizationUnitSuccess, $localize`Enheden blev slettet!`);
    this.subscribeAsError(
      OrganizationUnitActions.deleteOrganizationUnitError,
      $localize`Der skete en fejl under sletning af enheden`
    );

    this.subscriptions.add(
      this.actions$.pipe(ofType(OrganizationUnitActions.createOrganizationSubunitSuccess)).subscribe(({ unit }) => {
        this.showDefault($localize`${unit.name} er gemt`);
      })
    );
    this.subscribeAsError(
      OrganizationUnitActions.createOrganizationSubunitError,
      $localize`Fejl! Enheden kunne ikke oprettes!`
    );

    this.subscribeAsDefault(
      OrganizationUnitActions.patchOrganizationUnitSuccess,
      $localize`Organisationslag blev opdateret`
    );
    this.subscribeAsError(
      OrganizationUnitActions.patchOrganizationUnitError,
      $localize`Organisationslag kunne ikke opdateres`
    );

    this.subscribeAsDefault(OrganizationUnitActions.removeRegistrationsSuccess, $localize`Registrering blev fjernet`);
    this.subscribeAsError(OrganizationUnitActions.removeRegistrationsError, $localize`Registrering kunne ikke fjernet`);

    this.subscribeAsDefault(
      OrganizationUnitActions.transferRegistrationsSuccess,
      $localize`Registrering blev opdateret`
    );
    this.subscribeAsError(
      OrganizationUnitActions.transferRegistrationsError,
      $localize`Registrering kunne ikke opdateres`
    );

    this.subscribeAsDefault(OrganizationUnitActions.addOrganizationUnitRoleSuccess, $localize`Rollen blev tilføjet`);
    this.subscribeAsError(OrganizationUnitActions.addOrganizationUnitRoleError, $localize`Rollen kunne ikke tilføjes`);

    this.subscribeAsDefault(OrganizationUnitActions.deleteOrganizationUnitRoleSuccess, $localize`Rollen blev fjernet`);
    this.subscribeAsError(
      OrganizationUnitActions.deleteOrganizationUnitRoleError,
      $localize`Rollen kunne ikke fjernes`
    );

    this.subscribeAsDefault(OrganizationUserActions.sendNotificationSuccess, $localize`Besked sendt`);
    this.subscribeAsError(OrganizationUserActions.sendNotificationError, $localize`Beskeden kunne ikke sendes`);

    this.subscribeAsDefault(OrganizationUserActions.updateUserSuccess, $localize`Brugeren blev opdateret`);
    this.subscribeAsError(OrganizationUserActions.updateUserError, $localize`Brugeren kunne ikke opdateres`);

    this.subscribeAsDefault(OrganizationUserActions.createUserSuccess, $localize`Bruger blev oprettet`);
    this.subscribeAsError(OrganizationUserActions.createUserError, $localize`Bruger kunne ikke oprettes`);

    this.subscribeAsError(OrganizationActions.getMasterDataError, this.getMasterDataError);
    this.subscribeAsDefault(OrganizationActions.patchMasterDataSuccess, this.patchMasterDataSuccess);
    this.subscribeAsError(OrganizationActions.patchMasterDataError, this.patchMasterDataError);
    this.subscribeAsError(OrganizationActions.getMasterDataRolesError, this.getMasterDataError);
    this.subscribeAsDefault(OrganizationActions.patchMasterDataRolesSuccess, this.patchMasterDataSuccess);
    this.subscribeAsError(OrganizationActions.patchMasterDataRolesError, this.patchMasterDataError);

    this.subscribeAsDefault(UserActions.patchOrganizationSuccess, $localize`Organisationen blev opdateret.`);
    this.subscribeAsError(UserActions.patchOrganizationError, $localize`Kunne ikke opdatere organisation.`);

    this.subscribeAsError(
      OrganizationActions.getOrganizationPermissionsError,
      $localize`Kunne ikke hente organisationsrettigheder.`
    );

    this.subscribeAsDefault(OrganizationUserActions.copyRolesSuccess, $localize`Roller kopieret`);
    this.subscribeAsError(OrganizationUserActions.copyRolesError, $localize`Kunne ikke kopiere roller`);

    this.subscribeAsDefault(OrganizationUserActions.deleteUserSuccess, $localize`Brugeren blev slettet`);
    this.subscribeAsError(OrganizationUserActions.deleteUserError, $localize`Kunne ikke slette brugeren`);

    this.subscribeAsDefault(OrganizationUserActions.transferRolesSuccess, $localize`Roller overført`);
    this.subscribeAsError(OrganizationUserActions.transferRolesError, $localize`Kunne ikke overføre roller`);
  }

  private subscribeToItSystemEvents() {
    this.subscriptions.add(
      this.actions$
        .pipe(ofType(ITSystemUsageActions.patchITSystemUsageSuccess))
        .subscribe((params) => this.showDefault(params.customSuccessText ?? $localize`Feltet er opdateret.`))
    );
    this.subscriptions.add(
      this.actions$
        .pipe(ofType(ITSystemUsageActions.patchITSystemUsageError))
        .subscribe((params) => this.showError(params.customErrorText ?? $localize`Feltet kunne ikke opdateres.`))
    );

    this.subscribeAsDefault(ITSystemUsageActions.addItSystemUsageRelationSuccess, $localize`Relation tilføjet`);
    this.subscribeAsError(
      ITSystemUsageActions.addItSystemUsageRelationError,
      $localize`Der opstod en fejl! Kunne ikke tilføje relationen.`
    );

    this.subscribeAsDefault(ITSystemUsageActions.patchItSystemUsageRelationSuccess, $localize`Relation ændret`);
    this.subscribeAsError(
      ITSystemUsageActions.patchItSystemUsageRelationError,
      $localize`Der opstod en fejl! Kunne ikke redigere relationen`
    );

    this.subscribeAsDefault(ITSystemUsageActions.removeItSystemUsageRelationSuccess, $localize`Relationen er slettet`);
    this.subscribeAsError(
      ITSystemUsageActions.removeItSystemUsageRelationError,
      $localize`Kunne ikke slette relationen`
    );

    this.subscribeAsDefault(
      ITSystemUsageActions.addItSystemUsageJournalPeriodSuccess,
      $localize`Journalperioden blev tilføjet`
    );
    this.subscribeAsError(
      ITSystemUsageActions.addItSystemUsageJournalPeriodError,
      $localize`Der opstod en fejl! Kunne ikke tilføje journalperioden`
    );

    this.subscribeAsDefault(
      ITSystemUsageActions.patchItSystemUsageJournalPeriodSuccess,
      $localize`Journalperioden ændret`
    );
    this.subscribeAsError(
      ITSystemUsageActions.patchItSystemUsageJournalPeriodError,
      $localize`Der opstod en fejl! Kunne ikke redigere journalperioden`
    );

    this.subscribeAsDefault(
      ITSystemUsageActions.removeItSystemUsageJournalPeriodSuccess,
      $localize`Journalperioden er slettet`
    );
    this.subscribeAsError(
      ITSystemUsageActions.removeItSystemUsageJournalPeriodError,
      $localize`Kunne ikke slette journalperioden`
    );

    this.subscribeAsDefault(
      ITSystemUsageActions.deleteItSystemUsageByItSystemAndOrganizationSuccess,
      $localize`Anvendelsen er blevet slettet`
    );
    this.subscribeAsError(
      ITSystemUsageActions.deleteItSystemUsageByItSystemAndOrganizationError,
      $localize`Anvendelsen kunne ikke slettes`
    );

    this.subscribeAsDefault(ITSystemUsageActions.createItSystemUsageSuccess, $localize`Anvendelse oprettet`);
    this.subscribeAsError(
      ITSystemUsageActions.createItSystemUsageError,
      $localize`Oprettelse af anvendelse mislykkedes`
    );

    this.subscriptions.add(
      this.actions$
        .pipe(ofType(ITSystemActions.patchITSystemSuccess))
        .subscribe((params) => this.showDefault(params.customSuccessText ?? $localize`Feltet er opdateret`))
    );

    this.subscriptions.add(
      this.actions$
        .pipe(ofType(ITSystemActions.patchITSystemError))
        .subscribe((params) => this.showError(params.customErrorText ?? $localize`Feltet kunne ikke opdateres`))
    );

    this.subscribeAsDefault(ITInterfaceActions.deleteITInterfaceSuccess, $localize`Snitflade blev slettet`);
    this.subscribeAsError(ITInterfaceActions.deleteITInterfaceError, $localize`Snitflade kunne ikke slettes`);

    this.subscribeAsDefault(ITInterfaceActions.updateITInterfaceSuccess, $localize`Snitflade blev opdateret`);
    this.subscriptions.add(
      this.actions$
        .pipe(ofType(ITInterfaceActions.updateITInterfaceError))
        .subscribe((errMsg) => this.showError(errMsg.customErrorText ?? $localize`Snitflade kunne ikke opdateres`))
    );

    this.subscribeAsDefault(ITInterfaceActions.removeITInterfaceDataSuccess, $localize`Snitflade data blev slettet`);
    this.subscribeAsError(ITInterfaceActions.removeITInterfaceDataError, $localize`Snitflade data kunne ikke slettes`);

    this.subscribeAsDefault(ITInterfaceActions.updateITInterfaceDataSuccess, $localize`Snitflade data blev opdateret`);
    this.subscribeAsError(
      ITInterfaceActions.updateITInterfaceDataError,
      $localize`Snitflade data kunne ikke opdateres`
    );

    this.subscribeAsDefault(ITInterfaceActions.addITInterfaceDataSuccess, $localize`Snitflade data blev oprettet`);
    this.subscribeAsError(ITInterfaceActions.addITInterfaceDataError, $localize`Snitflade data kunne ikke oprettes`);
  }

  private subscribeToItContractEvents() {
    this.subscribeAsDefault(ITContractActions.patchITContractSuccess, $localize`Kontrakten blev opdateret`);
    this.subscribeAsError(ITContractActions.patchITContractError, $localize`Kontrakten kunne ikke opdateres`);

    this.subscribeAsDefault(
      ITContractActions.addITContractSystemAgreementElementSuccess,
      $localize`Aftaleelementet blev opdateret`
    );
    this.subscribeAsError(
      ITContractActions.addITContractSystemAgreementElementError,
      $localize`Aftaleelementet kunne ikke opdateres`
    );

    this.subscribeAsDefault(
      ITContractActions.addITContractSystemUsageSuccess,
      $localize`Kontrakt systemet blev opdateret`
    );
    this.subscribeAsError(
      ITContractActions.addITContractSystemUsageError,
      $localize`Kontrakt systemet kunne ikke opdateres`
    );

    this.subscribeAsDefault(
      ITContractActions.removeITContractSystemAgreementElementSuccess,
      $localize`Aftaleelementet blev slettet`
    );
    this.subscribeAsError(
      ITContractActions.removeITContractSystemAgreementElementError,
      $localize`Aftaleelementet kunne ikke slettes`
    );

    this.subscribeAsDefault(
      ITContractActions.removeITContractSystemUsageSuccess,
      $localize`Kontrakt systemet blev slettet`
    );
    this.subscribeAsError(
      ITContractActions.removeITContractSystemUsageError,
      $localize`Kontrakt systemet kunne ikke slettes`
    );

    this.subscribeAsDefault(
      ITContractActions.addITContractDataProcessingRegistrationSuccess,
      $localize`Tilknytningen blev oprettet`
    );
    this.subscribeAsError(
      ITContractActions.addITContractDataProcessingRegistrationError,
      $localize`Tilknytningen kunne ikke oprettes`
    );

    this.subscribeAsDefault(
      ITContractActions.removeITContractDataProcessingRegistrationSuccess,
      $localize`Tilknytningen blev slettet`
    );
    this.subscribeAsError(
      ITContractActions.removeITContractDataProcessingRegistrationError,
      $localize`Tilknytningen kunne ikke slettes`
    );

    this.subscribeAsDefault(ITContractActions.addItContractPaymentSuccess, $localize`Betalingen blev oprettet`);
    this.subscribeAsError(ITContractActions.addItContractPaymentError, $localize`Betalingen kunne ikke oprettes`);

    this.subscribeAsDefault(ITContractActions.updateItContractPaymentSuccess, $localize`Betalingen blev opdateret`);
    this.subscribeAsError(ITContractActions.updateItContractPaymentError, $localize`Betalingen kunne ikke opdateres`);

    this.subscribeAsDefault(ITContractActions.removeItContractPaymentSuccess, $localize`Betalingen blev slettet`);
    this.subscribeAsError(ITContractActions.removeItContractPaymentError, $localize`Betalingen kunne ikke slettes`);
  }

  private subscribeToDprEvents() {
    this.subscribeAsDefault(
      DataProcessingActions.createDataProcessingSuccess,
      $localize`Databehandlingen blev oprettet`
    );

    this.subscribeAsError(
      DataProcessingActions.createDataProcessingError,
      $localize`Databehandlingen kunne ikke oprettes`
    );

    this.subscribeAsDefault(
      DataProcessingActions.patchDataProcessingSuccess,
      $localize`Databehandlingen blev opdateret`
    );
    this.subscribeAsError(
      DataProcessingActions.patchDataProcessingError,
      $localize`Databehandlingen kunne ikke opdateres`
    );

    this.subscribeAsDefault(
      DataProcessingActions.deleteDataProcessingSuccess,
      $localize`Databehandlingen blev slettet`
    );
    this.subscribeAsError(
      DataProcessingActions.patchDataProcessingError,
      $localize`Databehandlingen kunne ikke slettes`
    );
  }
  /**
   * Consolidates notifications related to the "roles" which is used in multiple different modules
   */
  private subscribeToRoleNotifications() {
    this.subscribeMultipleDefault(
      ofType(ITSystemUsageActions.addItSystemUsageRoleSuccess, ITContractActions.addItContractRoleSuccess),
      $localize`Tildelingen blev tilføjet`
    );

    this.subscribeMultipleError(
      ofType(ITSystemUsageActions.addItSystemUsageRoleError, ITContractActions.addItContractRoleError),
      $localize`Kunne ikke oprette tildelingen`
    );

    this.subscribeMultipleDefault(
      ofType(ITSystemUsageActions.removeItSystemUsageRoleSuccess, ITContractActions.removeItContractRoleSuccess),
      $localize`Tildelingen blev fjernet`
    );

    this.subscribeMultipleError(
      ofType(ITSystemUsageActions.removeItSystemUsageRoleError, ITContractActions.removeItContractRoleError),
      $localize`Kunne ikke fjerne tildelingen`
    );

    this.subscribeAsError(
      ofType(UIModuleConfigActions.getUIModuleConfigError),
      $localize`Kunne ikke hente lokal tilpasning af brugerfladen`
    );

    this.subscribeAsError(
      ofType(UIModuleConfigActions.putUIModuleCustomizationError),
      $localize`Kunne ikke opdatere lokal tilpasning af brugerfladen`
    );

    this.subscribeAsError(
      ofType(UIModuleConfigActions.putUIModuleCustomizationSuccess),
      $localize`Lokal tilpasning af brugerfladen blev opdateret`
    );
  }

  /**
   * Consolidates notifications related to the "Fk Organization" integration
   */
  private subscribeToFkOrganizationEvents() {
    this.subscribeAsDefault(
      FkOrgActions.createConnectionSuccess,
      $localize`Forbindelse til FK Organisation blev oprettet`
    );

    this.subscribeAsError(
      FkOrgActions.createConnectionError,
      $localize`Kunne ikke oprette en forbindelse til Fk Organisation`
    );

    this.subscribeAsDefault(
      FkOrgActions.updateConnectionSuccess,
      $localize`Forbindelse til FK Organisation er opdateret`
    );
    this.subscribeAsError(
      FkOrgActions.updateConnectionError,
      $localize`Kunne ikke opdatere forbindelsen til Fk Organisation`
    );

    this.subscribeAsDefault(
      FkOrgActions.deleteAutomaticUpdateSubscriptionSuccess,
      $localize`Automatisk import af opdateringer er opdateret`
    );
    this.subscribeAsError(
      FkOrgActions.deleteAutomaticUpdateSubscriptionSuccess,
      $localize`Kunne ikke opdatere automatisk import af opdateringer`
    );
  }

  /**
   * Consolidates notifications related to the generic term "external references" which is ealized in multiple different modules
   */
  private subscribeToExternalReferenceManagementEvents() {
    this.subscribeMultipleDefault(
      ofType(
        ITSystemUsageActions.addExternalReferenceSuccess,
        ITSystemActions.addExternalReferenceSuccess,
        ITContractActions.addExternalReferenceSuccess,
        DataProcessingActions.addExternalReferenceSuccess
      ),
      $localize`Referencen blev oprettet`
    );

    this.subscribeMultipleError(
      ofType(
        ITSystemUsageActions.addExternalReferenceError,
        ITSystemActions.addExternalReferenceError,
        ITContractActions.addExternalReferenceError,
        DataProcessingActions.addExternalReferenceError
      ),
      $localize`Referencen kunne ikke oprettes`
    );

    this.subscribeMultipleDefault(
      ofType(
        ITSystemUsageActions.editExternalReferenceSuccess,
        ITSystemActions.editExternalReferenceSuccess,
        ITContractActions.editExternalReferenceSuccess,
        DataProcessingActions.editExternalReferenceSuccess
      ),
      $localize`Referencen blev ændret`
    );

    this.subscribeMultipleError(
      ofType(
        ITSystemUsageActions.editExternalReferenceError,
        ITSystemActions.editExternalReferenceError,
        ITContractActions.editExternalReferenceError,
        DataProcessingActions.editExternalReferenceError
      ),
      $localize`Referencen kunne ikke ændres`
    );

    this.subscribeMultipleDefault(
      ofType(
        ITSystemUsageActions.removeExternalReferenceSuccess,
        ITSystemActions.removeExternalReferenceSuccess,
        ITContractActions.removeExternalReferenceSuccess,
        DataProcessingActions.removeExternalReferenceSuccess
      ),
      $localize`Referencen blev slettet`
    );

    this.subscribeMultipleError(
      ofType(
        ITSystemUsageActions.removeExternalReferenceError,
        ITSystemActions.removeExternalReferenceError,
        ITContractActions.removeExternalReferenceError,
        DataProcessingActions.removeExternalReferenceError
      ),
      $localize`Referencen kunne ikke slettes`
    );
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private subscribeAsDefault(actionType: any, msg: string) {
    this.subscribeToActionWithMessage(actionType, msg, PopupMessageType.default);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private subscribeAsError(actionType: any, msg: string) {
    this.subscribeToActionWithMessage(actionType, msg, PopupMessageType.error);
  }

  //Call this with single actionType
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private subscribeToActionWithMessage(actionType: any, msg: string, type: PopupMessageType) {
    this.subscribeToMultiple(ofType(actionType), msg, type);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private subscribeMultipleDefault(actionTypes: any, msg: string) {
    this.subscribeToMultiple(actionTypes, msg, PopupMessageType.default);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private subscribeMultipleError(actionTypes: any, msg: string) {
    this.subscribeToMultiple(actionTypes, msg, PopupMessageType.error);
  }

  //actionTypes should be" ofType(actionType1, actionType2, actionType3, ...)"
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private subscribeToMultiple(actionTypes: any, msg: string, type: PopupMessageType) {
    this.subscriptions.add(this.actions$.pipe(actionTypes).subscribe(() => this.show(msg, type)));
  }

  public show(text: string, type: PopupMessageType) {
    this.store.dispatch(PopupMessageActions.add(createPopupMessage(text, type)));
  }

  public showError(text: string): void {
    this.show(text, PopupMessageType.error);
  }

  public showInvalidFormField(fieldName: string): void {
    this.showError($localize`Feltet "${fieldName}" er ugyldigt`);
  }

  public showDefault(text: string): void {
    this.show(text, PopupMessageType.default);
  }
}
