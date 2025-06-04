import { Injectable } from '@angular/core';
import { ComponentStore } from '@ngrx/component-store';
import { RegistrationEntityTypes } from '../../models/registrations/registration-entity-categories.model';
import {
  APIExternalReferenceWithLastChangedResponseDTO,
  APIV2ExternalReferencesInternalINTERNALService,
} from 'src/app/api/v2';
import { Observable, switchMap } from 'rxjs';
import { tapResponse } from '@ngrx/operators';

interface State {
  externalReferences: APIExternalReferenceWithLastChangedResponseDTO[];
}
/**
 * This store is used to manage the state of the external references component.
 * It's different from the external references in the normal entity stores, because it
 * also includes LastChanged and LastChangedBy fields.
 */
@Injectable()
export class ExternalReferencesComponentStore extends ComponentStore<State> {
  constructor(private readonly externalReferenceService: APIV2ExternalReferencesInternalINTERNALService) {
    super({ externalReferences: [] });
  }

  public readonly externalReferences$ = this.select((state) => state.externalReferences);

  private readonly setExternalReferences = this.updater(
    (state, externalReferences: APIExternalReferenceWithLastChangedResponseDTO[]): State => ({
      ...state,
      externalReferences,
    }),
  );

  public getExternalReferences = (entityType: RegistrationEntityTypes) =>
    this.effect((entityUuid$: Observable<string>) => {
      return entityUuid$.pipe(
        switchMap((entityUuid) =>
          this.getExternalReferencesMethod(entityType)(entityUuid).pipe(
            tapResponse(
              (externalReferences) => this.setExternalReferences(externalReferences),
              (e) => console.error(e),
            ),
          ),
        ),
      );
    });

  public getExternalReferencesMethod(
    entityType: RegistrationEntityTypes,
  ): (entityUuid: string) => Observable<APIExternalReferenceWithLastChangedResponseDTO[]> {
    switch (entityType) {
      case 'it-system':
        return (systemUuid) =>
          this.externalReferenceService.getManyExternalReferencesInternalV2GetItSystemReferences({
            systemUuid,
          });
      case 'it-system-usage':
        return (systemUsageUuid) =>
          this.externalReferenceService.getManyExternalReferencesInternalV2GetItSystemUsageReferences({
            systemUsageUuid,
          });
      case 'it-contract':
        return (contractUuid) =>
          this.externalReferenceService.getManyExternalReferencesInternalV2GetItContractReferences({
            contractUuid,
          });
      case 'data-processing-registration':
        return (dprUuid) =>
          this.externalReferenceService.getManyExternalReferencesInternalV2GetDataProcessingReferences({
            dprUuid,
          });
      default:
        throw new Error('Unsupported entity type');
    }
  }
}
