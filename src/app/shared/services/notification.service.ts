import { Injectable, OnDestroy } from '@angular/core';
import { Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { DataProcessingActions } from 'src/app/store/data-processing/actions';
import { ITContractActions } from 'src/app/store/it-contract/actions';
import { ITInterfaceActions } from 'src/app/store/it-system-interfaces/actions';
import { ITSystemUsageActions } from 'src/app/store/it-system-usage/actions';
import { ITSystemActions } from 'src/app/store/it-system/actions';
import { OrganizationUnitActions } from 'src/app/store/organization-unit/actions';
import { PopupMessageActions } from 'src/app/store/popup-messages/actions';
import { UserActions } from 'src/app/store/user-store/actions';
import { PopupMessageType } from '../enums/popup-message-type';
import { createPopupMessage } from '../models/popup-messages/popup-message.model';
import { OrganizationUserActions } from 'src/app/store/organization-user/actions';

@Injectable({ providedIn: 'root' })
export class NotificationService implements OnDestroy {
  public subscriptions = new Subscription();

  constructor(private actions$: Actions, private readonly store: Store) {}

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  public subscribeOnActions() {
    this.subscriptions.add(
      this.actions$
        .pipe(ofType(UserActions.loginSuccess))
        .subscribe(() => this.showDefault($localize`Du er nu logget ind`))
    );
    this.subscriptions.add(
      this.actions$
        .pipe(ofType(UserActions.loginError))
        .subscribe(() => this.showError($localize`Kunne ikke logge ind`))
    );

    this.subscriptions.add(
      this.actions$
        .pipe(ofType(UserActions.logoutSuccess))
        .subscribe(() => this.showDefault($localize`Du er nu logget ud`))
    );
    this.subscriptions.add(
      this.actions$
        .pipe(ofType(UserActions.logoutError))
        .subscribe(() => this.showError($localize`Kunne ikke logge ud`))
    );

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

    this.subscriptions.add(
      this.actions$
        .pipe(ofType(ITSystemUsageActions.addItSystemUsageRelationSuccess))
        .subscribe(() => this.showDefault($localize`Relation tilføjet`))
    );
    this.subscriptions.add(
      this.actions$
        .pipe(ofType(ITSystemUsageActions.addItSystemUsageRelationError))
        .subscribe(() => this.showError($localize`Der opstod en fejl! Kunne ikke tilføje relationen.`))
    );

    this.subscriptions.add(
      this.actions$
        .pipe(ofType(ITSystemUsageActions.patchItSystemUsageRelationSuccess))
        .subscribe(() => this.showDefault($localize`Relation ændret`))
    );
    this.subscriptions.add(
      this.actions$
        .pipe(ofType(ITSystemUsageActions.patchItSystemUsageRelationError))
        .subscribe(() => this.showError($localize`Der opstod en fejl! Kunne ikke redigere relationen`))
    );

    this.subscriptions.add(
      this.actions$
        .pipe(ofType(ITSystemUsageActions.removeItSystemUsageRelationSuccess))
        .subscribe(() => this.showDefault($localize`Relationen er slettet`))
    );
    this.subscriptions.add(
      this.actions$
        .pipe(ofType(ITSystemUsageActions.removeItSystemUsageRelationError))
        .subscribe(() => this.showError($localize`Kunne ikke slette relationen`))
    );

    this.subscriptions.add(
      this.actions$
        .pipe(ofType(ITSystemUsageActions.addItSystemUsageJournalPeriodSuccess))
        .subscribe(() => this.showDefault($localize`Journalperioden blev tilføjet`))
    );
    this.subscriptions.add(
      this.actions$
        .pipe(ofType(ITSystemUsageActions.addItSystemUsageJournalPeriodError))
        .subscribe(() => this.showError($localize`Der opstod en fejl! Kunne ikke tilføje journalperioden`))
    );

    this.subscriptions.add(
      this.actions$
        .pipe(ofType(ITSystemUsageActions.patchItSystemUsageJournalPeriodSuccess))
        .subscribe(() => this.showDefault($localize`Journalperioden ændret`))
    );
    this.subscriptions.add(
      this.actions$
        .pipe(ofType(ITSystemUsageActions.patchItSystemUsageJournalPeriodError))
        .subscribe(() => this.showError($localize`Der opstod en fejl! Kunne ikke redigere journalperioden`))
    );

    this.subscriptions.add(
      this.actions$
        .pipe(ofType(ITSystemUsageActions.removeItSystemUsageJournalPeriodSuccess))
        .subscribe(() => this.showDefault($localize`Journalperioden er slettet`))
    );
    this.subscriptions.add(
      this.actions$
        .pipe(ofType(ITSystemUsageActions.removeItSystemUsageJournalPeriodError))
        .subscribe(() => this.showError($localize`Kunne ikke slette journalperioden`))
    );

    this.subscriptions.add(
      this.actions$
        .pipe(ofType(ITSystemUsageActions.deleteItSystemUsageByItSystemAndOrganizationSuccess))
        .subscribe(() => this.showDefault($localize`Anvendelsen er blevet slettet`))
    );

    this.subscriptions.add(
      this.actions$
        .pipe(ofType(ITSystemUsageActions.deleteItSystemUsageByItSystemAndOrganizationError))
        .subscribe(() => this.showError($localize`Anvendelsen kunne ikke slettes`))
    );

    this.subscriptions.add(
      this.actions$
        .pipe(ofType(ITSystemUsageActions.createItSystemUsageSuccess))
        .subscribe(() => this.showDefault($localize`Anvendelse oprettet`))
    );

    this.subscriptions.add(
      this.actions$
        .pipe(ofType(ITSystemUsageActions.createItSystemUsageError))
        .subscribe(() => this.showError($localize`Oprettelse af anvendelse mislykkedes`))
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

    this.subscriptions.add(
      this.actions$
        .pipe(ofType(ITInterfaceActions.deleteITInterfaceSuccess))
        .subscribe(() => this.showDefault($localize`Snitflade blev slettet`))
    );

    this.subscriptions.add(
      this.actions$
        .pipe(ofType(ITInterfaceActions.deleteITInterfaceError))
        .subscribe(() => this.showError($localize`Snitflade kunne ikke slettes`))
    );

    this.subscriptions.add(
      this.actions$
        .pipe(ofType(ITInterfaceActions.updateITInterfaceSuccess))
        .subscribe(() => this.showDefault($localize`Snitflade blev opdateret`))
    );

    this.subscriptions.add(
      this.actions$
        .pipe(ofType(ITInterfaceActions.updateITInterfaceError))
        .subscribe((errMsg) => this.showError(errMsg.customErrorText ?? $localize`Snitflade kunne ikke opdateres`))
    );

    this.subscriptions.add(
      this.actions$
        .pipe(ofType(ITInterfaceActions.removeITInterfaceDataSuccess))
        .subscribe(() => this.showDefault($localize`Snitflade data blev slettet`))
    );

    this.subscriptions.add(
      this.actions$
        .pipe(ofType(ITInterfaceActions.removeITInterfaceDataError))
        .subscribe(() => this.showError($localize`Snitflade data kunne ikke slettes`))
    );

    this.subscriptions.add(
      this.actions$
        .pipe(ofType(ITInterfaceActions.updateITInterfaceDataSuccess))
        .subscribe(() => this.showDefault($localize`Snitflade data blev opdateret`))
    );

    this.subscriptions.add(
      this.actions$
        .pipe(ofType(ITInterfaceActions.updateITInterfaceDataError))
        .subscribe(() => this.showError($localize`Snitflade data kunne ikke opdateres`))
    );

    this.subscriptions.add(
      this.actions$
        .pipe(ofType(ITInterfaceActions.addITInterfaceDataSuccess))
        .subscribe(() => this.showDefault($localize`Snitflade data blev oprettet`))
    );

    this.subscriptions.add(
      this.actions$
        .pipe(ofType(ITInterfaceActions.addITInterfaceDataError))
        .subscribe(() => this.showError($localize`Snitflade data kunne ikke oprettes`))
    );

    this.subscriptions.add(
      this.actions$
        .pipe(ofType(ITContractActions.patchITContractSuccess))
        .subscribe(() => this.showDefault($localize`Kontrakten blev opdateret`))
    );

    this.subscriptions.add(
      this.actions$
        .pipe(ofType(ITContractActions.patchITContractError))
        .subscribe(() => this.showError($localize`Kontrakten kunne ikke opdateres`))
    );

    this.subscriptions.add(
      this.actions$
        .pipe(ofType(ITContractActions.addITContractSystemAgreementElementSuccess))
        .subscribe(() => this.showDefault($localize`Aftaleelementet blev opdateret`))
    );

    this.subscriptions.add(
      this.actions$
        .pipe(ofType(ITContractActions.addITContractSystemAgreementElementError))
        .subscribe(() => this.showError($localize`Aftaleelementet kunne ikke opdateres`))
    );

    this.subscriptions.add(
      this.actions$
        .pipe(ofType(ITContractActions.addITContractSystemUsageSuccess))
        .subscribe(() => this.showDefault($localize`Kontrakt systemet blev opdateret`))
    );

    this.subscriptions.add(
      this.actions$
        .pipe(ofType(ITContractActions.addITContractSystemUsageError))
        .subscribe(() => this.showError($localize`Kontrakt systemet kunne ikke opdateres`))
    );

    this.subscriptions.add(
      this.actions$
        .pipe(ofType(ITContractActions.removeITContractSystemAgreementElementSuccess))
        .subscribe(() => this.showDefault($localize`Aftaleelementet blev slettet`))
    );

    this.subscriptions.add(
      this.actions$
        .pipe(ofType(ITContractActions.removeITContractSystemAgreementElementError))
        .subscribe(() => this.showError($localize`Aftaleelementet kunne ikke slettes`))
    );

    this.subscriptions.add(
      this.actions$
        .pipe(ofType(ITContractActions.removeITContractSystemUsageSuccess))
        .subscribe(() => this.showDefault($localize`Kontrakt systemet blev slettet`))
    );

    this.subscriptions.add(
      this.actions$
        .pipe(ofType(ITContractActions.removeITContractSystemUsageError))
        .subscribe(() => this.showError($localize`Kontrakt systemet kunne ikke slettes`))
    );

    this.subscriptions.add(
      this.actions$
        .pipe(ofType(ITContractActions.addITContractDataProcessingRegistrationSuccess))
        .subscribe(() => this.showDefault($localize`Tilknytningen blev oprettet`))
    );

    this.subscriptions.add(
      this.actions$
        .pipe(ofType(ITContractActions.addITContractDataProcessingRegistrationError))
        .subscribe(() => this.showError($localize`Tilknytningen kunne ikke oprettes`))
    );

    this.subscriptions.add(
      this.actions$
        .pipe(ofType(ITContractActions.removeITContractDataProcessingRegistrationSuccess))
        .subscribe(() => this.showDefault($localize`Tilknytningen blev slettet`))
    );

    this.subscriptions.add(
      this.actions$
        .pipe(ofType(ITContractActions.removeITContractDataProcessingRegistrationError))
        .subscribe(() => this.showError($localize`Tilknytningen kunne ikke slettes`))
    );

    this.subscriptions.add(
      this.actions$
        .pipe(ofType(ITContractActions.addItContractPaymentSuccess))
        .subscribe(() => this.showDefault($localize`Betalingen blev oprettet`))
    );

    this.subscriptions.add(
      this.actions$
        .pipe(ofType(ITContractActions.addItContractPaymentError))
        .subscribe(() => this.showError($localize`Betalingen kunne ikke oprettes`))
    );

    this.subscriptions.add(
      this.actions$
        .pipe(ofType(ITContractActions.updateItContractPaymentSuccess))
        .subscribe(() => this.showDefault($localize`Betalingen blev opdateret`))
    );

    this.subscriptions.add(
      this.actions$
        .pipe(ofType(ITContractActions.updateItContractPaymentError))
        .subscribe(() => this.showError($localize`Betalingen kunne ikke opdateres`))
    );

    this.subscriptions.add(
      this.actions$
        .pipe(ofType(ITContractActions.removeItContractPaymentSuccess))
        .subscribe(() => this.showDefault($localize`Betalingen blev slettet`))
    );

    this.subscriptions.add(
      this.actions$
        .pipe(ofType(ITContractActions.removeExternalReferenceError))
        .subscribe(() => this.showError($localize`Betalingen kunne ikke slettes`))
    );

    this.subscriptions.add(
      this.actions$
        .pipe(ofType(DataProcessingActions.patchDataProcessingSuccess))
        .subscribe(() => this.showDefault($localize`Databehandlingen blev opdateret`))
    );

    this.subscriptions.add(
      this.actions$
        .pipe(ofType(DataProcessingActions.patchDataProcessingError))
        .subscribe(() => this.showDefault($localize`Databehandlingen kunne ikke opdateres`))
    );

    this.subscriptions.add(
      this.actions$
        .pipe(ofType(DataProcessingActions.deleteDataProcessingSuccess))
        .subscribe(() => this.showDefault($localize`Databehandlingen blev slettet`))
    );

    this.subscriptions.add(
      this.actions$
        .pipe(ofType(DataProcessingActions.patchDataProcessingError))
        .subscribe(() => this.showDefault($localize`Databehandlingen kunne ikke slettes`))
    );

    this.subscriptions.add(
      this.actions$.pipe(ofType(OrganizationUnitActions.deleteOrganizationUnitSuccess)).subscribe(() => {
        this.showDefault($localize`Enheden blev slettet!`);
      })
    );

    this.subscriptions.add(
      this.actions$.pipe(ofType(OrganizationUnitActions.deleteOrganizationUnitError)).subscribe(() => {
        this.showError($localize`Der skete en fejl under sletning af enheden`);
      })
    );

    this.subscriptions.add(
      this.actions$.pipe(ofType(OrganizationUnitActions.createOrganizationSubunitSuccess)).subscribe(({ unit }) => {
        this.showDefault($localize`${unit.name} er gemt`);
      })
    );

    this.subscriptions.add(
      this.actions$.pipe(ofType(OrganizationUnitActions.createOrganizationSubunitError)).subscribe(() => {
        this.showError($localize`Fejl! Enheden kunne ikke oprettes!`);
      })
    );

    this.subscriptions.add(
      this.actions$
        .pipe(ofType(OrganizationUnitActions.patchOrganizationUnitSuccess))
        .subscribe(() => this.showDefault($localize`Organisationslag blev opdateret`))
    );

    this.subscriptions.add(
      this.actions$
        .pipe(ofType(OrganizationUnitActions.patchOrganizationUnitError))
        .subscribe(() => this.showError($localize`Organisationslag kunne ikke opdateres`))
    );

    this.subscriptions.add(
      this.actions$
        .pipe(ofType(OrganizationUnitActions.removeRegistrationsSuccess))
        .subscribe(() => this.showDefault($localize`Registrering blev fjernet`))
    );

    this.subscriptions.add(
      this.actions$
        .pipe(ofType(OrganizationUnitActions.removeRegistrationsError))
        .subscribe(() => this.showError($localize`Registrering kunne ikke fjernet`))
    );

    this.subscriptions.add(
      this.actions$
        .pipe(ofType(OrganizationUnitActions.transferRegistrationsSuccess))
        .subscribe(() => this.showDefault($localize`Registrering blev opdateret`))
    );

    this.subscriptions.add(
      this.actions$
        .pipe(ofType(OrganizationUnitActions.transferRegistrationsError))
        .subscribe(() => this.showError($localize`Registrering kunne ikke opdateres`))
    );

    this.subscriptions.add(
      this.actions$
        .pipe(ofType(OrganizationUnitActions.addOrganizationUnitRoleSuccess))
        .subscribe(() => this.showDefault($localize`Rollen blev tilføjet`))
    );

    this.subscriptions.add(
      this.actions$
        .pipe(ofType(OrganizationUnitActions.addOrganizationUnitRoleError))
        .subscribe(() => this.showError($localize`Rollen kunne ikke tilføjes`))
    );

    this.subscriptions.add(
      this.actions$
        .pipe(ofType(OrganizationUnitActions.deleteOrganizationUnitRoleSuccess))
        .subscribe(() => this.showDefault($localize`Rollen blev fjernet`))
    );

    this.subscriptions.add(
      this.actions$
        .pipe(ofType(OrganizationUnitActions.deleteOrganizationUnitRoleError))
        .subscribe(() => this.showError($localize`Rollen kunne ikke fjernes`))
    );

    this.subscriptions.add(
      this.actions$
        .pipe(ofType(OrganizationUserActions.sendNotificationSuccess))
        .subscribe(() => this.showDefault($localize`Besked sendt`))
    );

    this.subscriptions.add(
      this.actions$
        .pipe(ofType(OrganizationUserActions.sendNotificationError))
        .subscribe(() => this.showError($localize`Beskeden kunne ikke sendes`))
    );

    this.subscriptions.add(
      this.actions$
        .pipe(ofType(OrganizationUserActions.updateUserSuccess))
        .subscribe(() => this.showDefault($localize`Brugeren blev opdateret`))
    );

    this.subscriptions.add(
      this.actions$
        .pipe(ofType(OrganizationUserActions.updateUserError))
        .subscribe(() => this.showError($localize`Brugeren kunne ikke opdateres`))
    );

    this.subscribeToExternalReferenceManagementEvents();
    this.subscribeToRoleNotifications();
  }

  /**
   * Consolidates notifications related to the "roles" which is used in multiple different modules
   */
  private subscribeToRoleNotifications() {
    this.subscriptions.add(
      this.actions$
        .pipe(ofType(ITSystemUsageActions.addItSystemUsageRoleSuccess, ITContractActions.addItContractRoleSuccess))
        .subscribe(() => this.showDefault($localize`Tildelingen blev tilføjet`))
    );
    this.subscriptions.add(
      this.actions$
        .pipe(ofType(ITSystemUsageActions.addItSystemUsageRoleError, ITContractActions.addItContractRoleError))
        .subscribe(() => this.showError($localize`Kunne ikke oprette tildelingen`))
    );
    this.subscriptions.add(
      this.actions$
        .pipe(
          ofType(ITSystemUsageActions.removeItSystemUsageRoleSuccess, ITContractActions.removeItContractRoleSuccess)
        )
        .subscribe(() => this.showDefault($localize`Tildelingen blev fjernet`))
    );
    this.subscriptions.add(
      this.actions$
        .pipe(ofType(ITSystemUsageActions.removeItSystemUsageRoleError, ITContractActions.removeItContractRoleError))
        .subscribe(() => this.showError($localize`Kunne ikke fjerne tildelingen`))
    );
  }

  /**
   * Consolidates notifications related to the generic term "external references" which is ealized in multiple different modules
   */
  private subscribeToExternalReferenceManagementEvents() {
    this.subscriptions.add(
      this.actions$
        .pipe(
          ofType(
            ITSystemUsageActions.addExternalReferenceSuccess,
            ITSystemActions.addExternalReferenceSuccess,
            ITContractActions.addExternalReferenceSuccess,
            DataProcessingActions.addExternalReferenceSuccess
          )
        )
        .subscribe(() => this.showReferenceAdded())
    );
    this.subscriptions.add(
      this.actions$
        .pipe(
          ofType(
            ITSystemUsageActions.addExternalReferenceError,
            ITSystemActions.addExternalReferenceError,
            ITContractActions.addExternalReferenceError,
            DataProcessingActions.addExternalReferenceError
          )
        )
        .subscribe(() => this.showReferenceAddedFailure())
    );
    this.subscriptions.add(
      this.actions$
        .pipe(
          ofType(
            ITSystemUsageActions.editExternalReferenceSuccess,
            ITSystemActions.editExternalReferenceSuccess,
            ITContractActions.editExternalReferenceSuccess,
            DataProcessingActions.editExternalReferenceSuccess
          )
        )
        .subscribe(() => this.showReferenceEdited())
    );
    this.subscriptions.add(
      this.actions$
        .pipe(
          ofType(
            ITSystemUsageActions.editExternalReferenceError,
            ITSystemActions.editExternalReferenceError,
            ITContractActions.editExternalReferenceError,
            DataProcessingActions.editExternalReferenceError
          )
        )
        .subscribe(() => this.showReferenceEditFailure())
    );
    this.subscriptions.add(
      this.actions$
        .pipe(
          ofType(
            ITSystemUsageActions.removeExternalReferenceSuccess,
            ITSystemActions.removeExternalReferenceSuccess,
            ITContractActions.removeExternalReferenceSuccess,
            DataProcessingActions.removeExternalReferenceSuccess
          )
        )
        .subscribe(() => this.showReferenceDeleted())
    );
    this.subscriptions.add(
      this.actions$
        .pipe(
          ofType(
            ITSystemUsageActions.removeExternalReferenceError,
            ITSystemActions.removeExternalReferenceError,
            ITContractActions.removeExternalReferenceError,
            DataProcessingActions.removeExternalReferenceError
          )
        )
        .subscribe(() => this.showReferenceDeleteFailure())
    );
  }

  private showReferenceAddedFailure(): void {
    return this.showError($localize`Referencen kunne ikke oprettes`);
  }

  private showReferenceAdded(): void {
    return this.showDefault($localize`Referencen blev oprettet`);
  }

  private showReferenceEditFailure(): void {
    return this.showError($localize`Referencen kunne ikke ændres`);
  }

  private showReferenceEdited(): void {
    return this.showDefault($localize`Referencen blev ændret`);
  }

  private showReferenceDeleteFailure(): void {
    return this.showError($localize`Referencen kunne ikke slettes`);
  }

  private showReferenceDeleted(): void {
    return this.showDefault($localize`Referencen blev slettet`);
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
