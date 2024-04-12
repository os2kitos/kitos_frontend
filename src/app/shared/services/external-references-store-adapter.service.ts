import { Injectable, OnDestroy } from '@angular/core';
import { Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { Observable, Subscription, first, of } from 'rxjs';
import { APIExternalReferenceDataResponseDTO } from 'src/app/api/v2';
import { ExternalReferencesManagmentActions } from 'src/app/store/external-references-management/actions';
import { selectItContractExternalReferences } from 'src/app/store/it-contract/selectors';
import { ITSystemUsageActions } from 'src/app/store/it-system-usage/actions';
import { selectItSystemUsageExternalReferences } from 'src/app/store/it-system-usage/selectors';
import { ITSystemActions } from 'src/app/store/it-system/actions';
import { selectItSystemExternalReferences } from 'src/app/store/it-system/selectors';
import { ExternalReferenceProperties } from '../models/external-references/external-reference-properties.model';
import { RegistrationEntityTypes } from '../models/registrations/registration-entity-categories.model';

@Injectable({
  providedIn: 'root',
})
export class ExternalReferencesStoreAdapterService implements OnDestroy {
  public subscriptions = new Subscription();
  constructor(private readonly store: Store, private readonly actions$: Actions) {}

  public ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  public subscribeOnActions() {
    this.subscribeCommandMediators();
  }

  private subscribeCommandMediators() {
    this.subscriptions.add(
      this.actions$
        .pipe(ofType(ExternalReferencesManagmentActions.delete))
        .subscribe((deleteCommand) =>
          this.dispatchDeleteExternalReference(deleteCommand.entityType, deleteCommand.referenceUuid)
        )
    );
    this.subscriptions.add(
      this.actions$
        .pipe(ofType(ExternalReferencesManagmentActions.add))
        .subscribe((addCommand) => this.dispatchCreateExternalReference(addCommand.entityType, addCommand.properties))
    );
    this.subscriptions.add(
      this.actions$
        .pipe(ofType(ExternalReferencesManagmentActions.edit))
        .subscribe((editCommand) =>
          this.dispatchEditExternalReference(editCommand.entityType, editCommand.referenceUuid, editCommand.properties)
        )
    );
  }

  //***************** */
  //****SELECTION**** */
  //***************** */

  public selectExternalReferences(
    entityType: RegistrationEntityTypes
  ): Observable<Array<APIExternalReferenceDataResponseDTO> | undefined> {
    switch (entityType) {
      case 'it-system-usage':
        return this.store.select(selectItSystemUsageExternalReferences);
      case 'it-system':
        return this.store.select(selectItSystemExternalReferences);
      case 'it-contract':
        return this.store.select(selectItContractExternalReferences);
      default:
        console.error(`Missing support for entity type:${entityType}`);
        return of([]);
    }
  }

  //************** */
  //****DELETE**** */
  //************** */

  private dispatchDeleteExternalReference(entityType: RegistrationEntityTypes, referenceUuid: string): void {
    switch (entityType) {
      case 'it-system-usage':
        return this.dispatchRemoveItSystemUsageReference(referenceUuid);
      case 'it-system':
        return this.dispatchRemoveItSystemReference(referenceUuid);
      default:
        console.error(`Missing support for entity type:${entityType}`);
        break;
    }
  }

  private dispatchRemoveItSystemUsageReference(referenceUuid: string) {
    this.subscriptions.add(
      this.actions$
        .pipe(ofType(ITSystemUsageActions.removeExternalReferenceSuccess), first())
        .subscribe(() => this.dispatchGenericDeleteSuccess('it-system-usage', referenceUuid))
    );
    this.subscriptions.add(
      this.actions$
        .pipe(ofType(ITSystemUsageActions.removeExternalReferenceError), first())
        .subscribe(() => this.dispatchGenericDeleteError('it-system-usage', referenceUuid))
    );
    return this.store.dispatch(ITSystemUsageActions.removeExternalReference(referenceUuid));
  }

  private dispatchRemoveItSystemReference(referenceUuid: string) {
    this.subscriptions.add(
      this.actions$
        .pipe(ofType(ITSystemActions.removeExternalReferenceSuccess), first())
        .subscribe(() => this.dispatchGenericDeleteSuccess('it-system', referenceUuid))
    );
    this.subscriptions.add(
      this.actions$
        .pipe(ofType(ITSystemActions.removeExternalReferenceError), first())
        .subscribe(() => this.dispatchGenericDeleteError('it-system', referenceUuid))
    );
    return this.store.dispatch(ITSystemActions.removeExternalReference(referenceUuid));
  }

  private dispatchGenericDeleteError(entityType: RegistrationEntityTypes, referenceUuid: string): void {
    return this.store.dispatch(ExternalReferencesManagmentActions.deleteError(entityType, referenceUuid));
  }

  private dispatchGenericDeleteSuccess(entityType: RegistrationEntityTypes, referenceUuid: string): void {
    return this.store.dispatch(ExternalReferencesManagmentActions.deleteSuccess(entityType, referenceUuid));
  }

  //************** */
  //****CREATE**** */
  //************** */

  private dispatchCreateExternalReference(
    entityType: RegistrationEntityTypes,
    properties: ExternalReferenceProperties
  ): void {
    switch (entityType) {
      case 'it-system-usage':
        return this.dispatchCreateItSystemUsageReference(properties);
      case 'it-system':
        return this.dispatchCreateItSystemReference(properties);
      default:
        console.error(`Missing support for entity type:${entityType}`);
        break;
    }
  }

  private dispatchCreateItSystemUsageReference(properties: ExternalReferenceProperties) {
    this.subscriptions.add(
      this.actions$
        .pipe(ofType(ITSystemUsageActions.addExternalReferenceSuccess), first())
        .subscribe(() => this.dispatchGenericAddSuccess('it-system-usage', properties))
    );
    this.subscriptions.add(
      this.actions$
        .pipe(ofType(ITSystemUsageActions.addExternalReferenceError), first())
        .subscribe(() => this.dispatchGenericAddError('it-system-usage', properties))
    );
    return this.store.dispatch(ITSystemUsageActions.addExternalReference(properties));
  }

  private dispatchCreateItSystemReference(properties: ExternalReferenceProperties) {
    this.subscriptions.add(
      this.actions$
        .pipe(ofType(ITSystemActions.addExternalReferenceSuccess), first())
        .subscribe(() => this.dispatchGenericAddSuccess('it-system', properties))
    );
    this.subscriptions.add(
      this.actions$
        .pipe(ofType(ITSystemActions.addExternalReferenceError), first())
        .subscribe(() => this.dispatchGenericAddError('it-system', properties))
    );

    return this.store.dispatch(ITSystemActions.addExternalReference(properties));
  }

  private dispatchGenericAddError(entityType: RegistrationEntityTypes, properties: ExternalReferenceProperties): void {
    return this.store.dispatch(ExternalReferencesManagmentActions.addError(entityType, properties));
  }

  private dispatchGenericAddSuccess(
    entityType: RegistrationEntityTypes,
    properties: ExternalReferenceProperties
  ): void {
    return this.store.dispatch(ExternalReferencesManagmentActions.addSuccess(entityType, properties));
  }

  //************ */
  //****EDIT**** */
  //************ */
  private dispatchEditExternalReference(
    entityType: RegistrationEntityTypes,
    referenceUuid: string,
    properties: ExternalReferenceProperties
  ): void {
    switch (entityType) {
      case 'it-system-usage':
        return this.dispatchEditItSystemUsageReference(referenceUuid, properties);
      case 'it-system':
        return this.dispatchEditItSystemReference(referenceUuid, properties);
      default:
        console.error(`Missing support for entity type:${entityType}`);
        break;
    }
  }

  private dispatchEditItSystemUsageReference(referenceUuid: string, properties: ExternalReferenceProperties) {
    this.subscriptions.add(
      this.actions$
        .pipe(ofType(ITSystemUsageActions.editExternalReferenceSuccess), first())
        .subscribe(() => this.dispatchGenericEditSuccess('it-system-usage', referenceUuid, properties))
    );
    this.subscriptions.add(
      this.actions$
        .pipe(ofType(ITSystemUsageActions.editExternalReferenceError), first())
        .subscribe(() => this.dispatchGenericEditError('it-system-usage', referenceUuid, properties))
    );
    return this.store.dispatch(ITSystemUsageActions.editExternalReference(referenceUuid, properties));
  }

  private dispatchEditItSystemReference(referenceUuid: string, properties: ExternalReferenceProperties) {
    this.subscriptions.add(
      this.actions$
        .pipe(ofType(ITSystemActions.editExternalReferenceSuccess), first())
        .subscribe(() => this.dispatchGenericEditSuccess('it-system', referenceUuid, properties))
    );
    this.subscriptions.add(
      this.actions$
        .pipe(ofType(ITSystemActions.editExternalReferenceError), first())
        .subscribe(() => this.dispatchGenericEditError('it-system', referenceUuid, properties))
    );
    return this.store.dispatch(ITSystemActions.editExternalReference(referenceUuid, properties));
  }

  private dispatchGenericEditError(
    entityType: RegistrationEntityTypes,
    referenceUuid: string,
    properties: ExternalReferenceProperties
  ): void {
    return this.store.dispatch(ExternalReferencesManagmentActions.editError(entityType, referenceUuid, properties));
  }

  private dispatchGenericEditSuccess(
    entityType: RegistrationEntityTypes,
    referenceUuid: string,
    properties: ExternalReferenceProperties
  ): void {
    return this.store.dispatch(ExternalReferencesManagmentActions.editSuccess(entityType, referenceUuid, properties));
  }
}
