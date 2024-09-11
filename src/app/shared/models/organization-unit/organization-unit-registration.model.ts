import { APIIdentityNamePairResponseDTO, APINamedEntityV2DTO } from 'src/app/api/v2';

export interface RegistrationModel<T> {
  registration: T;
  isSelected: boolean;
}

export interface PaymentRegistrationModel {
  itContract: APIIdentityNamePairResponseDTO;
  itContractId: string;
  payments: RegistrationModel<APINamedEntityV2DTO>;
  isSelected: boolean;
}
