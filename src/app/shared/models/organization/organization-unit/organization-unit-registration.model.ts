import { APIIdentityNamePairResponseDTO, APINamedEntityV2DTO } from 'src/app/api/v2';

export interface RegistrationModel<T> {
  registration: T;
  isSelected: boolean;
}

export interface PaymentRegistrationModel extends RegistrationModel<APINamedEntityV2DTO> {
  itContract: APIIdentityNamePairResponseDTO;
  itContractId: number;
}
