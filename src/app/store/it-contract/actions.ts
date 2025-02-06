import { createActionGroup, emptyProps } from '@ngrx/store';
import { APIBusinessRoleDTO } from 'src/app/api/v1';
import {
  APIAppliedProcurementPlanResponseDTO,
  APIColumnConfigurationRequestDTO,
  APIIdentityNamePairResponseDTO,
  APIItContractPermissionsResponseDTO,
  APIItContractResponseDTO,
  APIOrganizationGridConfigurationResponseDTO,
  APIPaymentRequestDTO,
  APIResourceCollectionPermissionsResponseDTO,
  APIUpdateContractRequestDTO,
} from 'src/app/api/v2';
import { ExternalReferenceProperties } from 'src/app/shared/models/external-references/external-reference-properties.model';
import { GridColumn } from 'src/app/shared/models/grid-column.model';
import { GridState } from 'src/app/shared/models/grid-state.model';
import { SavedFilterState } from 'src/app/shared/models/grid/saved-filter-state.model';
import { ITContract } from 'src/app/shared/models/it-contract/it-contract.model';
import { PaymentTypes } from 'src/app/shared/models/it-contract/payment-types.model';

export const ITContractActions = createActionGroup({
  source: 'ITContract',
  events: {
    'Get IT Contract': (contractUuid: string) => ({
      contractUuid,
    }),
    'Get IT Contract Success': (itContract: APIItContractResponseDTO) => ({ itContract }),
    'Get IT Contract Error': emptyProps(),
    'Get IT Contracts': (gridState: GridState, responsibleUnitUuid: string | undefined) => ({
      gridState,
      responsibleUnitUuid,
    }),
    'Get IT Contracts Success': (itContracts: ITContract[], total: number) => ({ itContracts, total }),
    'Get IT Contracts Error': emptyProps(),
    'Update Grid State': (gridState: GridState) => ({ gridState }),
    'Update Grid Columns': (gridColumns: GridColumn[]) => ({ gridColumns }),
    'Update Grid Columns Success': (gridColumns: GridColumn[]) => ({ gridColumns }),

    'Get It Contract Overview Roles': () => emptyProps(),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    'Get It Contract Overview Roles Success': (roles: APIBusinessRoleDTO[] | undefined) => ({ roles }),
    'Get It Contract Overview Roles Error': emptyProps(),

    'Delete IT Contract': emptyProps(),
    'Delete IT Contract Success': emptyProps(),
    'Delete IT Contract Error': emptyProps(),
    'Patch IT Contract': (
      itContract: APIUpdateContractRequestDTO,
      customSuccessText?: string,
      customErrorText?: string
    ) => ({ itContract, customSuccessText, customErrorText }),
    'Patch IT Contract Success': (itContract: APIItContractResponseDTO, customSuccessText?: string) => ({
      itContract,
      customSuccessText,
    }),
    'Patch IT Contract Error': (customErrorText?: string) => ({ customErrorText }),

    'Add IT Contract System Agreement Element': (agreementElement: APIIdentityNamePairResponseDTO) => ({
      agreementElement,
    }),
    'Add IT Contract System Agreement Element Success': (itContract: APIItContractResponseDTO) => ({ itContract }),
    'Add IT Contract System Agreement Element Error': emptyProps(),

    'Remove IT Contract System Agreement Element': (agreementElementUuid: string) => ({ agreementElementUuid }),
    'Remove IT Contract System Agreement Element Success': (itContract: APIItContractResponseDTO) => ({ itContract }),
    'Remove IT Contract System Agreement Element Error': emptyProps(),

    'Add IT Contract System Usage': (systemUsageUuid: string) => ({
      systemUsageUuid,
    }),
    'Add IT Contract System Usage Success': (itContract: APIItContractResponseDTO) => ({ itContract }),
    'Add IT Contract System Usage Error': emptyProps(),

    'Remove IT Contract System Usage': (systemUsageUuid: string) => ({ systemUsageUuid }),
    'Remove IT Contract System Usage Success': (itContract: APIItContractResponseDTO) => ({ itContract }),
    'Remove IT Contract System Usage Error': emptyProps(),

    'Add IT Contract Data Processing Registration': (dprUuid: string) => ({
      dprUuid,
    }),
    'Add IT Contract Data Processing Registration Success': (itContract: APIItContractResponseDTO) => ({ itContract }),
    'Add IT Contract Data Processing Registration Error': emptyProps(),

    'Remove IT Contract Data Processing Registration': (dprUuid: string) => ({ dprUuid }),
    'Remove IT Contract Data Processing Registration Success': (itContract: APIItContractResponseDTO) => ({
      itContract,
    }),
    'Remove IT Contract Data Processing Registration Error': emptyProps(),

    'Get IT Contract Permissions': (contractUuid: string) => ({ contractUuid }),
    'Get IT Contract Permissions Success ': (permissions?: APIItContractPermissionsResponseDTO) => ({
      permissions,
    }),
    'Get IT Contract Permissions Error': emptyProps(),

    'Get IT Contract Collection Permissions': () => emptyProps(),
    'Get IT Contract Collection Permissions Success': (
      collectionPermissions?: APIResourceCollectionPermissionsResponseDTO
    ) => ({ collectionPermissions }),
    'Get IT Contract Collection Permissions Error': emptyProps(),

    'Remove External Reference': (referenceUuid: string) => ({ referenceUuid }),
    'Remove External Reference Success': (itContract: APIItContractResponseDTO) => ({ itContract }),
    'Remove External Reference Error': () => emptyProps(),
    'Add External Reference': (externalReference: ExternalReferenceProperties) => ({ externalReference }),
    'Add External Reference Success': (itContract: APIItContractResponseDTO) => ({ itContract }),
    'Add External Reference Error': () => emptyProps(),
    'Edit External Reference': (referenceUuid: string, externalReference: ExternalReferenceProperties) => ({
      referenceUuid,
      externalReference,
    }),
    'Edit External Reference Success': (itContract: APIItContractResponseDTO) => ({ itContract }),
    'Edit External Reference Error': () => emptyProps(),

    'Add It Contract Role': (userUuid: string, roleUuid: string) => ({ userUuid, roleUuid }),
    'Add It Contract Role Success': (itContract: APIItContractResponseDTO) => ({ itContract }),
    'Add It Contract Role Error': emptyProps(),

    'Remove It Contract Role': (userUuid: string, roleUuid: string, contractUuid: string) => ({
      userUuid,
      roleUuid,
      contractUuid,
    }),
    'Remove It Contract Role Success': (
      itContract: APIItContractResponseDTO,
      userUuid: string,
      roleUuid: string,
      contractUuid: string
    ) => ({ itContract, userUuid, roleUuid, contractUuid }),
    'Remove It Contract Role Error': emptyProps(),

    'Create It Contract': (name: string, openAfterCreate: boolean) => ({ name, openAfterCreate }),
    'Create It Contract Success': (uuid: string, openAfterCreate: boolean) => ({ uuid, openAfterCreate }),
    'Create It Contract Error': emptyProps(),

    'Add It Contract Payment': (payment: APIPaymentRequestDTO, paymentType: PaymentTypes) => ({ payment, paymentType }),
    'Add It Contract Payment Success': (itContract: APIItContractResponseDTO) => ({ itContract }),
    'Add It Contract Payment Error': emptyProps(),

    'Update It Contract Payment': (paymentId: number, payment: APIPaymentRequestDTO, paymentType: PaymentTypes) => ({
      paymentId,
      payment,
      paymentType,
    }),
    'Update It Contract Payment Success': (itContract: APIItContractResponseDTO) => ({ itContract }),
    'Update It Contract Payment Error': emptyProps(),

    'Remove It Contract Payment': (paymentId: number, paymentType: PaymentTypes) => ({
      paymentId,
      paymentType,
    }),
    'Remove It Contract Payment Success': (itContract: APIItContractResponseDTO) => ({ itContract }),
    'Remove It Contract Payment Error': emptyProps(),

    'Save IT Contract Filter': (localStoreKey: string) => ({ localStoreKey }),
    'Apply IT Contract Filter': (state: SavedFilterState) => ({ state }),

    'Save Organizational IT Contract Column Configuration': (columnConfig: APIColumnConfigurationRequestDTO[]) => ({
      columnConfig,
    }),
    'Save Organizational IT Contract Column Configuration Success': () => emptyProps(),
    'Save Organizational IT Contract Column Configuration Error': () => emptyProps(),

    'Delete Organizational IT Contract Column Configuration': () => emptyProps(),
    'Delete Organizational IT Contract Column Configuration Success': () => emptyProps(),
    'Delete Organizational IT Contract Column Configuration Error': () => emptyProps(),

    'Reset To Organization IT Contract Column Configuration': () => emptyProps(),
    'Reset To Organization IT Contract Column Configuration Success': (
      response: APIOrganizationGridConfigurationResponseDTO
    ) => ({ response }),
    'Reset To Organization IT Contract Column Configuration Error': () => emptyProps(),

    'Initialize IT Contract Last Seen Grid Configuration': () => emptyProps(),
    'Initialize IT Contract Last Seen Grid Configuration Success': (
      response: APIOrganizationGridConfigurationResponseDTO
    ) => ({ response }),
    'Initialize IT Contract Last Seen Grid Configuration Error': () => emptyProps(),

    'Get applied procurement plans': emptyProps(),
    'Get applied procurement plans success': (response: APIAppliedProcurementPlanResponseDTO[]) => ({ response }),
    'Get applied procurement plans error': emptyProps(),
  },
});
