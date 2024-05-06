import { createActionGroup, emptyProps } from '@ngrx/store';
import {
  APIIdentityNamePairResponseDTO,
  APIItContractPermissionsResponseDTO,
  APIItContractResponseDTO,
  APIPaymentRequestDTO,
  APIResourceCollectionPermissionsResponseDTO,
  APIUpdateContractRequestDTO,
} from 'src/app/api/v2';
import { ExternalReferenceProperties } from 'src/app/shared/models/external-references/external-reference-properties.model';
import { GridState } from 'src/app/shared/models/grid-state.model';
import { ITContract } from 'src/app/shared/models/it-contract/it-contract.model';
import { PaymentTypes } from 'src/app/shared/models/it-contract/payment-types.model';

export const ITContractActions = createActionGroup({
  source: 'ITContract',
  events: {
    'Get IT Contract': (contractUuid: string) => ({ contractUuid }),
    'Get IT Contract Success': (itContract: APIItContractResponseDTO) => ({ itContract }),
    'Get IT Contract Error': emptyProps(),
    'Get IT Contracts': (odataString: string) => ({ odataString }),
    'Get IT Contracts Success': (itContracts: ITContract[], total: number) => ({ itContracts, total }),
    'Get IT Contracts Error': emptyProps(),
    'Update Grid State': (gridState: GridState) => ({ gridState }),
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

    'Remove It Contract Role': (userUuid: string, roleUuid: string) => ({ userUuid, roleUuid }),
    'Remove It Contract Role Success': (itContract: APIItContractResponseDTO) => ({ itContract }),
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
  },
});
