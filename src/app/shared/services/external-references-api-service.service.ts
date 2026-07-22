import { Inject, Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import {
  APIExternalReferenceDataResponseDTO,
  APIUpdateExternalReferenceDataWriteRequestDTO,
  DataProcessingRegistrationV2Service,
  ItContractV2Service,
  ItSystemUsageV2Service,
  ItSystemV2Service,
} from 'src/app/api/v2';
import { ExternalReferenceProperties } from '../models/external-references/external-reference-properties.model';
import { RegistrationEntityTypes } from '../models/registrations/registration-entity-categories.model';

@Injectable({
  providedIn: 'root',
})
export class ExternalReferencesApiService {
  constructor(
    @Inject(ItSystemUsageV2Service) private readonly apiItSystemUsageService: ItSystemUsageV2Service,
    @Inject(ItSystemV2Service) private readonly apiItSystemService: ItSystemV2Service,
    @Inject(ItContractV2Service) private readonly apiItContractService: ItContractV2Service,
    @Inject(DataProcessingRegistrationV2Service)
    private readonly apiDataProcessingRegistrationService: DataProcessingRegistrationV2Service,
  ) {}

  public addExternalReference<T>(
    newExternalReference: ExternalReferenceProperties,
    externalReferences: APIExternalReferenceDataResponseDTO[] | undefined,
    entityUuid: string | undefined,
    entityType: RegistrationEntityTypes,
  ): Observable<T> {
    if (newExternalReference && externalReferences && entityUuid) {
      const nextState = this.prepareAdd(newExternalReference, externalReferences);

      switch (entityType) {
        case 'it-system-usage':
          return this.apiItSystemUsageService.patchSingleItSystemUsageV2PatchSystemUsage({
            systemUsageUuid: entityUuid,
            aPIUpdateItSystemUsageRequestDTO: { externalReferences: nextState },
          });
        case 'it-system':
          return this.apiItSystemService.patchSingleItSystemV2PatchItSystem({
            uuid: entityUuid,
            aPIUpdateItSystemRequestDTO: { externalReferences: nextState },
          });
        case 'it-contract':
          return this.apiItContractService.patchSingleItContractV2PatchItContract({
            contractUuid: entityUuid,
            aPIUpdateContractRequestDTO: { externalReferences: nextState },
          });
        case 'data-processing-registration':
          return this.apiDataProcessingRegistrationService.patchSingleDataProcessingRegistrationV2PatchDataProcessingRegistration(
            {
              uuid: entityUuid,
              aPIUpdateDataProcessingRegistrationRequestDTO: { externalReferences: nextState },
            },
          );
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
    entityType: RegistrationEntityTypes,
  ): Observable<T> {
    if (editData && externalReferences && entityUuid) {
      const nextState = this.prepareEdit(editData, externalReferences);

      switch (entityType) {
        case 'it-system-usage':
          return this.apiItSystemUsageService.patchSingleItSystemUsageV2PatchSystemUsage({
            systemUsageUuid: entityUuid,
            aPIUpdateItSystemUsageRequestDTO: { externalReferences: nextState },
          });
        case 'it-system':
          return this.apiItSystemService.patchSingleItSystemV2PatchItSystem({
            uuid: entityUuid,
            aPIUpdateItSystemRequestDTO: { externalReferences: nextState },
          });
        case 'it-contract':
          return this.apiItContractService.patchSingleItContractV2PatchItContract({
            contractUuid: entityUuid,
            aPIUpdateContractRequestDTO: { externalReferences: nextState },
          });
        case 'data-processing-registration':
          return this.apiDataProcessingRegistrationService.patchSingleDataProcessingRegistrationV2PatchDataProcessingRegistration(
            { uuid: entityUuid, aPIUpdateDataProcessingRegistrationRequestDTO: { externalReferences: nextState } },
          );
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
    entityType: RegistrationEntityTypes,
  ): Observable<T> {
    if (referenceUuid && externalReferences && entityUuid) {
      const nextState = this.prepareDelete(referenceUuid, externalReferences);

      switch (entityType) {
        case 'it-system-usage':
          return this.apiItSystemUsageService.patchSingleItSystemUsageV2PatchSystemUsage({
            systemUsageUuid: entityUuid,
            aPIUpdateItSystemUsageRequestDTO: { externalReferences: nextState },
          });
        case 'it-system':
          return this.apiItSystemService.patchSingleItSystemV2PatchItSystem({
            uuid: entityUuid,
            aPIUpdateItSystemRequestDTO: { externalReferences: nextState },
          });
        case 'it-contract':
          return this.apiItContractService.patchSingleItContractV2PatchItContract({
            contractUuid: entityUuid,
            aPIUpdateContractRequestDTO: { externalReferences: nextState },
          });
        case 'data-processing-registration':
          return this.apiDataProcessingRegistrationService.patchSingleDataProcessingRegistrationV2PatchDataProcessingRegistration(
            { uuid: entityUuid, aPIUpdateDataProcessingRegistrationRequestDTO: { externalReferences: nextState } },
          );
        default:
          console.error(`Missing support for entity type:${entityType}`);
          return of() as Observable<T>;
      }
    }
    throw new Error('ExternalReferenceApiService:deleteExternalReference Missing required parameters');
  }

  private prepareAdd(
    newExternalReference: APIExternalReferenceDataResponseDTO,
    externalReferences: APIExternalReferenceDataResponseDTO[],
  ): APIExternalReferenceDataResponseDTO[] {
    const externalReferenceToAdd = newExternalReference;
    const nextState = externalReferences.map((externalReference: APIUpdateExternalReferenceDataWriteRequestDTO) => ({
      ...externalReference,
      //If the new reference is master we must reset the existing as the api dictates to provide only one
      masterReference: !externalReferenceToAdd.masterReference && externalReference.masterReference,
      uuid: externalReference.uuid ?? '',
    }));
    //Add the new reference
    nextState.push({
      ...externalReferenceToAdd,
      masterReference: externalReferenceToAdd.masterReference,
      uuid: externalReferenceToAdd.uuid ?? '',
    });

    return nextState;
  }

  private prepareEdit(
    editData: { referenceUuid: string; externalReference: APIExternalReferenceDataResponseDTO },
    externalReferences: APIExternalReferenceDataResponseDTO[],
  ): APIExternalReferenceDataResponseDTO[] {
    const externalReferenceToEdit = editData.externalReference;

    return externalReferences.map((externalReference: APIUpdateExternalReferenceDataWriteRequestDTO) => {
      //Map changes to the edited
      if (externalReference.uuid === editData.referenceUuid) {
        return {
          ...externalReferenceToEdit,
          masterReference: externalReferenceToEdit.masterReference,
          uuid: externalReferenceToEdit.uuid ?? '',
        };
      } else {
        return {
          ...externalReference,
          //If the edited reference is master we must reset the existing as the api dictates to provide only one
          masterReference: !externalReferenceToEdit.masterReference && externalReference.masterReference,
          uuid: externalReference.uuid ?? '',
        };
      }
    });
  }

  private prepareDelete(
    referenceUuid: string,
    externalReferences: APIExternalReferenceDataResponseDTO[],
  ): APIExternalReferenceDataResponseDTO[] {
    const currentState = externalReferences.filter((externalReference) => externalReference.uuid !== referenceUuid);
    return currentState.filter((reference) => reference.uuid !== referenceUuid);
  }
}
