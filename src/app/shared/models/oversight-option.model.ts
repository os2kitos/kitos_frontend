import { APIDataProcessingRegistrationOversightResponseDTO } from 'src/app/api/v2';

export interface OversightOption {
  name: string;
  value: APIDataProcessingRegistrationOversightResponseDTO.OversightOptionEnum;
}

export const oversightOptions: OversightOption[] = [
  {
    name: $localize`Egen kontrol`,
    value: APIDataProcessingRegistrationOversightResponseDTO.OversightOptionEnum.EgenKontrol
  },
  {
    name: $localize`Fysisk tilsyn`,
    value: APIDataProcessingRegistrationOversightResponseDTO.OversightOptionEnum.FysiskTilsyn
  },
  {
    name: $localize`ISAE 3000`,
    value: APIDataProcessingRegistrationOversightResponseDTO.OversightOptionEnum.ISAE3000
  },
  {
    name: $localize`ISAE 3402 type 1`,
    value: APIDataProcessingRegistrationOversightResponseDTO.OversightOptionEnum.ISAE3402Type1
  },
  {
    name: $localize`ISAE 3402 type 2`,
    value: APIDataProcessingRegistrationOversightResponseDTO.OversightOptionEnum.ISAE3402Type2
  },
  {
    name: $localize`Ledelseserklæring`,
    value: APIDataProcessingRegistrationOversightResponseDTO.OversightOptionEnum.Ledelseserklæring
  },
  {
    name: $localize`Skriftlig kontrol`,
    value: APIDataProcessingRegistrationOversightResponseDTO.OversightOptionEnum.SkriftligKontrol
  },
];

export const mapOversightOption = (
  value?: APIDataProcessingRegistrationOversightResponseDTO.OversightOptionEnum
): OversightOption | undefined => {
  return oversightOptions.find((option) => option.value === value);
}
