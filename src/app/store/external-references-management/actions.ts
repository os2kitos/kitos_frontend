import { createActionGroup } from '@ngrx/store';
import { ExternalReferenceProperties } from 'src/app/shared/models/external-references/external-reference-properties.model';
import { RegistrationEntityTypes } from 'src/app/shared/models/registrations/registration-entity-categories.model';

export const ExternalReferencesManagmentActions = createActionGroup({
  source: 'ExternalReferencesManagment',
  events: {
    Add: (entityType: RegistrationEntityTypes, properties: ExternalReferenceProperties) => ({
      entityType,
      properties,
    }),
    'Add Success': (entityType: RegistrationEntityTypes, properties: ExternalReferenceProperties) => ({
      entityType,
      properties,
    }),
    'Add Error': (entityType: RegistrationEntityTypes, properties: ExternalReferenceProperties) => ({
      entityType,
      properties,
    }),
    Edit: (entityType: RegistrationEntityTypes, referenceUuid: string, properties: ExternalReferenceProperties) => ({
      entityType,
      referenceUuid,
      properties,
    }),
    'Edit Success': (
      entityType: RegistrationEntityTypes,
      referenceUuid: string,
      properties: ExternalReferenceProperties
    ) => ({ entityType, referenceUuid, properties }),
    'Edit Error': (
      entityType: RegistrationEntityTypes,
      referenceUuid: string,
      properties: ExternalReferenceProperties
    ) => ({ entityType, referenceUuid, properties }),
    Delete: (entityType: RegistrationEntityTypes, referenceUuid: string) => ({ entityType, referenceUuid }),
    'Delete Success': (entityType: RegistrationEntityTypes, referenceUuid: string) => ({ entityType, referenceUuid }),
    'Delete Error': (entityType: RegistrationEntityTypes, referenceUuid: string) => ({ entityType, referenceUuid }),
  },
});
