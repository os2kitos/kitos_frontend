import { Injectable, OnDestroy } from '@angular/core';
import { Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { ITSystemUsageActions } from 'src/app/store/it-system-usage/actions';
import { ITSystemActions } from 'src/app/store/it-system/actions';
import { PopupMessageActions } from 'src/app/store/popup-messages/actions';
import { UserActions } from 'src/app/store/user-store/actions';
import { PopupMessageType } from '../enums/popup-message-type';
import { createPopupMessage } from '../models/popup-messages/popup-message.model';

@Injectable({ providedIn: 'root' })
export class NotificationService implements OnDestroy {
  public subscriptions = new Subscription();

  constructor(private actions$: Actions, private readonly store: Store) { }

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
        .pipe(ofType(ITSystemUsageActions.addItSystemUsageRoleSuccess))
        .subscribe(() => this.showDefault($localize`Tildelingen blev tilføjet`))
    );
    this.subscriptions.add(
      this.actions$
        .pipe(ofType(ITSystemUsageActions.addItSystemUsageRoleError))
        .subscribe(() => this.showError($localize`Kunne ikke oprette tildelingen`))
    );
    this.subscriptions.add(
      this.actions$
        .pipe(ofType(ITSystemUsageActions.removeItSystemUsageRoleSuccess))
        .subscribe(() => this.showDefault($localize`Tildelingen blev fjernet`))
    );
    this.subscriptions.add(
      this.actions$
        .pipe(ofType(ITSystemUsageActions.removeItSystemUsageRoleError))
        .subscribe(() => this.showError($localize`Kunne ikke fjerne tildelingen`))
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
        .subscribe(() => this.showDefault($localize`Oprettelse af anvendelse mislykkedes`))
    );

    this.subscriptions.add(
      this.actions$
        .pipe(ofType(ITSystemActions.patchITSystemSuccess))
        .subscribe((params) => this.showDefault(params.customSuccessText ?? $localize`Feltet er opdateret`))
    );

    this.subscriptions.add(
      this.actions$
        .pipe(ofType(ITSystemActions.patchITSystemError))
        .subscribe((params) => this.showDefault(params.customErrorText ?? $localize`Feltet kunne ikke opdateres`))
    );

    this.subscribeToExternalReferenceManagementEvents();
  }

  /**
   * Consolidates notifications related to the generic term "external references" which is ealized in multiple different modules
   */
  private subscribeToExternalReferenceManagementEvents() {
    this.subscriptions.add(
      this.actions$
        .pipe(ofType(ITSystemUsageActions.addExternalReferenceSuccess, ITSystemActions.addExternalReferenceSuccess))
        .subscribe(() => this.showReferenceAdded())
    );
    this.subscriptions.add(
      this.actions$
        .pipe(ofType(ITSystemUsageActions.addExternalReferenceError, ITSystemActions.addExternalReferenceError))
        .subscribe(() => this.showReferenceAddedFailure())
    );
    this.subscriptions.add(
      this.actions$
        .pipe(ofType(ITSystemUsageActions.editExternalReferenceSuccess, ITSystemActions.editExternalReferenceSuccess))
        .subscribe(() => this.showReferenceEdited())
    );
    this.subscriptions.add(
      this.actions$
        .pipe(ofType(ITSystemUsageActions.editExternalReferenceError, ITSystemActions.editExternalReferenceError))
        .subscribe(() => this.showReferenceEditFailure())
    );
    this.subscriptions.add(
      this.actions$
        .pipe(
          ofType(ITSystemUsageActions.removeExternalReferenceSuccess, ITSystemActions.removeExternalReferenceSuccess)
        )
        .subscribe(() => this.showReferenceDeleted())
    );
    this.subscriptions.add(
      this.actions$
        .pipe(ofType(ITSystemUsageActions.removeExternalReferenceError, ITSystemActions.removeExternalReferenceError))
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
