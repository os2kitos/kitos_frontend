import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { APIExternalReferenceDataResponseDTO } from 'src/app/api/v2';
import { selectItSystemUsageExternalReferences } from 'src/app/store/it-system-usage/selectors';
import { RegistrationEntityTypes } from '../models/registrations/registration-entity-categories.model';

@Injectable({
  providedIn: 'root',
})
export class ExternalReferencesStoreAdapterService {
  constructor(private readonly store: Store) {}
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
}
