import { APIExternalReferenceDataResponseDTO, APIUpdateExternalReferenceDataWriteRequestDTO } from 'src/app/api/v2';
import { ExternalReferenceProperties } from 'src/app/shared/models/external-references/external-reference-properties.model';

export function prepareExternalReferenceToAdd(
  newExternalReference: { externalReference: ExternalReferenceProperties },
  externalReferences: APIExternalReferenceDataResponseDTO[]
): ExternalReferenceProperties[] {
  const externalReferenceToAdd = newExternalReference.externalReference;
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

export function prepareExternalReferenceToEdit(
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

export function prepareExternalReferenceToDelete(
  referenceUuid: string,
  externalReferences: APIExternalReferenceDataResponseDTO[]
): ExternalReferenceProperties[] {
  const currentState = externalReferences.filter((externalReference) => externalReference.uuid !== referenceUuid);
  return currentState.filter((reference) => reference.uuid !== referenceUuid);
}
