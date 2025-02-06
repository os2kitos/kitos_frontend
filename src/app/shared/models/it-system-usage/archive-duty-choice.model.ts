import { APIArchivingRegistrationsResponseDTO } from 'src/app/api/v2';
import {
  ARCHIVE_B_TYPE_TEXT,
  ARCHIVE_K_TYPE_TEXT,
  ARCHIVE_PRESERVE_DATA_CAN_DISCARD_DOCUMENTS_TEXT,
} from '../../constants/archive.constants';

export interface ArchiveDutyChoice {
  name: string;
  value: APIArchivingRegistrationsResponseDTO.ArchiveDutyEnum;
}

export const archiveDutyChoiceOptions: ArchiveDutyChoice[] = [
  {
    name: ARCHIVE_B_TYPE_TEXT,
    value: APIArchivingRegistrationsResponseDTO.ArchiveDutyEnum.B,
  },
  {
    name: ARCHIVE_K_TYPE_TEXT,
    value: APIArchivingRegistrationsResponseDTO.ArchiveDutyEnum.K,
  },
  {
    name: ARCHIVE_PRESERVE_DATA_CAN_DISCARD_DOCUMENTS_TEXT,
    value: APIArchivingRegistrationsResponseDTO.ArchiveDutyEnum.PreserveDataCanDiscardDocuments,
  },
  {
    name: $localize`Ved ikke`,
    value: APIArchivingRegistrationsResponseDTO.ArchiveDutyEnum.Unknown,
  },
];

export const mapArchiveDutyChoice = (
  value?: APIArchivingRegistrationsResponseDTO.ArchiveDutyEnum
): ArchiveDutyChoice | undefined => {
  return archiveDutyChoiceOptions.find((option) => option.value === value);
};
