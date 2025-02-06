import { APIRecommendedArchiveDutyResponseDTO } from 'src/app/api/v2';
import {
  ARCHIVE_B_TYPE_TEXT,
  ARCHIVE_K_TYPE_TEXT,
  ARCHIVE_PRESERVE_DATA_CAN_DISCARD_DOCUMENTS_TEXT,
} from '../../constants/archive.constants';

export interface ArchiveDutyRecommendationChoice {
  name: string;
  value: APIRecommendedArchiveDutyResponseDTO.IdEnum;
}

export const archiveDutyRecommendationChoiceOptions: ArchiveDutyRecommendationChoice[] = [
  {
    name: ARCHIVE_B_TYPE_TEXT,
    value: APIRecommendedArchiveDutyResponseDTO.IdEnum.B,
  },
  {
    name: ARCHIVE_K_TYPE_TEXT,
    value: APIRecommendedArchiveDutyResponseDTO.IdEnum.K,
  },
  {
    name: ARCHIVE_PRESERVE_DATA_CAN_DISCARD_DOCUMENTS_TEXT,
    value: APIRecommendedArchiveDutyResponseDTO.IdEnum.PreserveDataCanDiscardDocuments,
  },
  {
    name: $localize`Ved ikke`,
    value: APIRecommendedArchiveDutyResponseDTO.IdEnum.NoRecommendation,
  },
];

export const mapArchiveDutyRecommendationChoice = (
  value?: APIRecommendedArchiveDutyResponseDTO.IdEnum
): ArchiveDutyRecommendationChoice | undefined => {
  return archiveDutyRecommendationChoiceOptions.find((option) => option.value === value);
};
