import { createActionGroup, emptyProps } from '@ngrx/store';
import {
  APIChangeOrganizationUnitRegistrationV2RequestDTO,
  APICreateOrganizationUnitRequestDTO,
  APINamedEntityV2DTO,
  APINamedEntityWithEnabledStatusV2DTO,
  APINamedEntityWithUserFullNameV2DTO,
  APIOrganizationRegistrationUnitResponseDTO,
  APIOrganizationUnitResponseDTO,
  APITransferOrganizationUnitRegistrationV2RequestDTO,
  APIUnitAccessRightsResponseDTO,
  APIUnitAccessRightsWithUnitDataResponseDTO,
  APIUpdateOrganizationUnitRequestDTO,
} from 'src/app/api/v2';
import { OrganizationUnitRegistrationTypes } from 'src/app/shared/models/organization/organization-unit/organization-unit-registration-type';
import {
  PaymentRegistrationModel,
  RegistrationModel,
} from 'src/app/shared/models/organization/organization-unit/organization-unit-registration.model';

export const OrganizationUnitActions = createActionGroup({
  source: 'OrganizationUnit',
  events: {
    'Get organization units': () => emptyProps(),
    'Get organization units Success': (units: APIOrganizationUnitResponseDTO[]) => ({
      units,
    }),
    'Get organization units Error': emptyProps(),

    'Get organization units paged': (
      pageSize?: number,
      currentPage?: number,
      units?: APIOrganizationUnitResponseDTO[]
    ) => ({
      units,
      currentPage,
      pageSize,
    }),
    'Get organization units paged Success': (units: APIOrganizationUnitResponseDTO[]) => ({
      units,
    }),
    'Get organization units paged Error': emptyProps(),

    'Update current unit uuid': (uuid: string) => ({ uuid }),

    'Get hierarchy': (organizationUuid: string) => ({ organizationUuid }),
    'Get hierarchy Success': (hierarchy: APIOrganizationUnitResponseDTO[]) => ({ hierarchy }),
    'Get hierarchy Error': emptyProps(),

    'Delete organization unit': (uuid: string) => ({ uuid }),
    'Delete organization unit Success': (uuid: string) => ({ uuid }),
    'Delete organization unit Error': emptyProps(),

    'Create organization subunit': (subunitToCreate: APICreateOrganizationUnitRequestDTO) => ({ subunitToCreate }),
    'Create organization subunit Success': (unit: APIOrganizationUnitResponseDTO) => ({ unit }),
    'Create organization subunit Error': emptyProps(),

    'Patch organization unit': (unitUuid: string, request: APIUpdateOrganizationUnitRequestDTO) => ({
      unitUuid,
      request,
    }),
    'Patch organization unit Success': (unit: APIOrganizationUnitResponseDTO) => ({ unit }),
    'Patch organization unit Error': emptyProps(),

    'Update hierarchy': (unit: APIOrganizationUnitResponseDTO, units: APIOrganizationUnitResponseDTO[]) => ({
      unit,
      units,
    }),
    'Add expanded nodes': (uuids: string[]) => ({ uuids }),
    'Remove expanded node': (uuid: string) => ({ uuid }),

    'Add organization unit role': (userUuid: string, roleUuid: string) => ({ userUuid, roleUuid }),
    'Add organization unit role Success': emptyProps(),
    'Add organization unit role Error': emptyProps(),

    'Delete organization unit role': (userUuid: string, roleUuid: string, unitUuid: string) => ({
      userUuid,
      roleUuid,
      unitUuid,
    }),
    'Delete organization unit role Success': (userUuid: string, roleUuid: string, unitUuid: string) => ({
      userUuid,
      roleUuid,
      unitUuid,
    }),
    'Delete organization unit role Error': emptyProps(),

    'Get registrations': (unitUuid: string) => ({ unitUuid }),
    'Get registrations Success': (registrations: APIOrganizationRegistrationUnitResponseDTO) => ({ registrations }),
    'Get registrations Error': emptyProps(),

    'Remove registrations': (unitUuid: string, request: APIChangeOrganizationUnitRegistrationV2RequestDTO) => ({
      unitUuid,
      request,
    }),
    'Remove registrations Success': (removedRegistrations: APIChangeOrganizationUnitRegistrationV2RequestDTO) => ({
      removedRegistrations,
    }),
    'Remove registrations Error': emptyProps(),

    'Transfer registrations': (unitUuid: string, request: APITransferOrganizationUnitRegistrationV2RequestDTO) => ({
      unitUuid,
      request,
    }),
    'Transfer registrations Success': (
      transferedRegistrations: APITransferOrganizationUnitRegistrationV2RequestDTO
    ) => ({ transferedRegistrations }),
    'Transfer registrations Error': emptyProps(),

    'Change organization unit registration select': (
      registration: RegistrationModel<APINamedEntityWithUserFullNameV2DTO>
    ) => ({ registration }),
    'Change it contract registration select': (registration: RegistrationModel<APINamedEntityV2DTO>) => ({
      registration,
    }),
    'Change internal payment select': (registration: PaymentRegistrationModel) => ({
      registration,
    }),
    'Change external payment select': (registration: PaymentRegistrationModel) => ({
      registration,
    }),
    'Change responsible system select': (registration: RegistrationModel<APINamedEntityWithEnabledStatusV2DTO>) => ({
      registration,
    }),
    'Change relevant system select': (registration: RegistrationModel<APINamedEntityWithEnabledStatusV2DTO>) => ({
      registration,
    }),

    'Change collection select': (value: boolean, registrationType: OrganizationUnitRegistrationTypes) => ({
      value,
      registrationType,
    }),
    'Change all select': (value: boolean) => ({ value }),

    'Get permissions': (unitUuid: string) => ({ unitUuid }),
    'Get permissions Success': (permissions: APIUnitAccessRightsResponseDTO) => ({ permissions }),
    'Get permissions Error': emptyProps(),

    'Get collection permissions': emptyProps(),
    'Get collection permissions Success': (permissions: APIUnitAccessRightsWithUnitDataResponseDTO) => ({
      permissions,
    }),
    'Get collection permissions Error': emptyProps(),
  },
});
