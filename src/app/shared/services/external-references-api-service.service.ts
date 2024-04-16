import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import {
  APIExternalReferenceDataResponseDTO,
  APIUpdateExternalReferenceDataWriteRequestDTO,
  APIV2ItContractService,
  APIV2ItSystemService,
  APIV2ItSystemUsageService,
} from 'src/app/api/v2';
import { ExternalReferenceProperties } from '../models/external-references/external-reference-properties.model';
import { RegistrationEntityTypes } from '../models/registrations/registration-entity-categories.model';

@Injectable({
  providedIn: 'root',
})
export class ExternalReferencesApiService {
  constructor(
    private readonly apiItSystemUsageService: APIV2ItSystemUsageService,
    private readonly apiItSystemService: APIV2ItSystemService,
    private readonly apiItContractService: APIV2ItContractService
  ) {}

  public addExternalReference<T>(
    newExternalReference: ExternalReferenceProperties,
    externalReferences: APIExternalReferenceDataResponseDTO[] | undefined,
    entityUuid: string | undefined,
    entityType: RegistrationEntityTypes
  ): Observable<T> {
    if (newExternalReference && externalReferences && entityUuid) {
      const nextState = this.prepareAdd(newExternalReference, externalReferences);

      switch (entityType) {
        case 'it-system-usage':
          return this.apiItSystemUsageService.patchSingleItSystemUsageV2PatchSystemUsage({
            systemUsageUuid: entityUuid,
            request: { externalReferences: nextState },
          });
        case 'it-system':
          return this.apiItSystemService.patchSingleItSystemV2PatchItSystem({
            uuid: entityUuid,
            request: { externalReferences: nextState },
          });
        case 'it-contract':
          return this.apiItContractService.patchSingleItContractV2PatchItContract({
            contractUuid: entityUuid,
            request: { externalReferences: nextState },
          });
        default:
          console.error(`Missing support for entity type:${entityType}`);
          return of() as Observable<T>;
      }
    }
    throw new Error('ExternalReferenceApiService:addExternalReference Missing required parameters');
  }

  public editExternalReference<T>(
    editData: { referenceUuid: string; externalReference: ExternalReferenceProperties },
    externalReferences: APIExternalReferenceDataResponseDTO[] | undefined,
    entityUuid: string | undefined,
    entityType: RegistrationEntityTypes
  ): Observable<T> {
    if (editData && externalReferences && entityUuid) {
      const nextState = this.prepareEdit(editData, externalReferences);

      switch (entityType) {
        case 'it-system-usage':
          return this.apiItSystemUsageService.patchSingleItSystemUsageV2PatchSystemUsage({
            systemUsageUuid: entityUuid,
            request: { externalReferences: nextState },
          });
        case 'it-system':
          return this.apiItSystemService.patchSingleItSystemV2PatchItSystem({
            uuid: entityUuid,
            request: { externalReferences: nextState },
          });
        case 'it-contract':
          return this.apiItContractService.patchSingleItContractV2PatchItContract({
            contractUuid: entityUuid,
            request: { externalReferences: nextState },
          });
        default:
          console.error(`Missing support for entity type:${entityType}`);
          return of() as Observable<T>;
      }
    }
    throw new Error('ExternalReferenceApiService:editExternalReference Missing required parameters');
  }

  public deleteExternalReference<T>(
    referenceUuid: string,
    externalReferences: APIExternalReferenceDataResponseDTO[] | undefined,
    entityUuid: string | undefined,
    entityType: RegistrationEntityTypes
  ): Observable<T> {
    if (referenceUuid && externalReferences && entityUuid) {
      const nextState = this.prepareDelete(referenceUuid, externalReferences);

      switch (entityType) {
        case 'it-system-usage':
          return this.apiItSystemUsageService.patchSingleItSystemUsageV2PatchSystemUsage({
            systemUsageUuid: entityUuid,
            request: { externalReferences: nextState },
          });
        case 'it-system':
          return this.apiItSystemService.patchSingleItSystemV2PatchItSystem({
            uuid: entityUuid,
            request: { externalReferences: nextState },
          });
        case 'it-contract':
          return this.apiItContractService.patchSingleItContractV2PatchItContract({
            contractUuid: entityUuid,
            request: { externalReferences: nextState },
          });
        default:
          console.error(`Missing support for entity type:${entityType}`);
          return of() as Observable<T>;
      }
    }
    throw new Error('ExternalReferenceApiService:deleteExternalReference Missing required parameters');
  }

  private prepareAdd(
    newExternalReference: ExternalReferenceProperties,
    externalReferences: APIExternalReferenceDataResponseDTO[]
  ): ExternalReferenceProperties[] {
    const externalReferenceToAdd = newExternalReference;
    const nextState = externalReferences.map((externalReference: APIUpdateExternalReferenceDataWriteRequestDTO) => ({
      ...externalReference,
      //If the new reference is master we must reset the existing as the api dictates to provide only one
      masterReference: !externalReferenceToAdd.masterReference && externalReference.masterReference,
    }));
    //Add the new reference
    nextState.push({
      ...externalReferenceToAdd,
      masterReference: externalReferenceToAdd.masterReference,
    });

    return nextState;
  }

  private prepareEdit(
    editData: { referenceUuid: string; externalReference: ExternalReferenceProperties },
    externalReferences: APIExternalReferenceDataResponseDTO[]
  ): ExternalReferenceProperties[] {
    const externalReferenceToEdit = editData.externalReference;

    return externalReferences.map((externalReference: APIUpdateExternalReferenceDataWriteRequestDTO) => {
      //Map changes to the edited
      if (externalReference.uuid === editData.referenceUuid) {
        return {
          ...externalReferenceToEdit,
          masterReference: externalReferenceToEdit.masterReference,
        };
      } else {
        return {
          ...externalReference,
          //If the edited reference is master we must reset the existing as the api dictates to provide only one
          masterReference: !externalReferenceToEdit.masterReference && externalReference.masterReference,
        };
      }
    });
  }

  private prepareDelete(
    referenceUuid: string,
    externalReferences: APIExternalReferenceDataResponseDTO[]
  ): ExternalReferenceProperties[] {
    const currentState = externalReferences.filter((externalReference) => externalReference.uuid !== referenceUuid);
    return currentState.filter((reference) => reference.uuid !== referenceUuid);
  }
}
