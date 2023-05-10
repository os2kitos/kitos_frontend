import { Injectable, OnDestroy } from '@angular/core';
import { Actions } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { Observable, Subscription, of } from 'rxjs';
import { APIExternalReferenceDataResponseDTO } from 'src/app/api/v2';
import { ITSystemUsageActions } from 'src/app/store/it-system-usage/actions';
import { selectItSystemUsageExternalReferences } from 'src/app/store/it-system-usage/selectors';
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
    //TODO: Kill if not really needed
  }

  public selectExternalReferences(
    entityType: RegistrationEntityTypes
  ): Observable<Array<APIExternalReferenceDataResponseDTO> | undefined> {
    switch (entityType) {
      case 'it-system-usage':
        return this.store.select(selectItSystemUsageExternalReferences);
      default:
        console.error(`Missing support for entity type:${entityType}`);
        return of([]);
    }
  }

  dispatchDeleteExternalReference(entityType: RegistrationEntityTypes, referenceUuid: string): void {
    switch (entityType) {
      case 'it-system-usage':
        return this.store.dispatch(ITSystemUsageActions.removeExternalReference(referenceUuid));
      default:
        console.error(`Missing support for entity type:${entityType}`);
        break;
    }
  }

  dispatchCreateExternalReference(entityType: RegistrationEntityTypes, properties: ExternalReferenceProperties): void {
    switch (entityType) {
      case 'it-system-usage':
        return this.store.dispatch(ITSystemUsageActions.addExternalReference(properties));
      default:
        console.error(`Missing support for entity type:${entityType}`);
        break;
    }
  }

  dispatchEditExternalReference(
    entityType: RegistrationEntityTypes,
    referenceUuid: string,
    properties: ExternalReferenceProperties
  ): void {
    switch (entityType) {
      case 'it-system-usage':
        return this.store.dispatch(ITSystemUsageActions.editExternalReference(referenceUuid, properties));
      default:
        console.error(`Missing support for entity type:${entityType}`);
        break;
    }
  }
}
