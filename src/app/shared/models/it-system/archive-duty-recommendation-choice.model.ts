import { APIRecommendedArchiveDutyChoice } from 'src/app/api/v2';
import {
  ARCHIVE_B_TYPE_TEXT,
  ARCHIVE_BK_TYPE_TEXT,
  ARCHIVE_DD_TYPE_TEXT,
  ARCHIVE_DK_TYPE_TEXT,
  ARCHIVE_K_TYPE_TEXT,
  ARCHIVE_KB_TYPE_TEXT,
  ARCHIVE_KD_TYPE_TEXT,
  ARCHIVE_PRESERVE_DATA_CAN_DISCARD_DOCUMENTS_TEXT,
  ARCHIVE_TEXT_NO_RECOMMENDATION,
} from '../../constants/archive.constants';

export interface ArchiveDutyRecommendationChoice {
  name: string;
  value: APIRecommendedArchiveDutyChoice;
}

export const archiveDutyRecommendationChoiceOptions: ArchiveDutyRecommendationChoice[] = [
  {
    name: ARCHIVE_B_TYPE_TEXT,
    value: APIRecommendedArchiveDutyChoice.B,
  },
  {
    name: ARCHIVE_BK_TYPE_TEXT,
    value: APIRecommendedArchiveDutyChoice.Bk,
  },
  {
    name: ARCHIVE_K_TYPE_TEXT,
    value: APIRecommendedArchiveDutyChoice.K,
  },
  {
    name: ARCHIVE_PRESERVE_DATA_CAN_DISCARD_DOCUMENTS_TEXT,
    value: APIRecommendedArchiveDutyChoice.PreserveDataCanDiscardDocuments,
  },
  {
    name: ARCHIVE_KD_TYPE_TEXT,
    value: APIRecommendedArchiveDutyChoice.Kd,
  },
  {
    name: ARCHIVE_KB_TYPE_TEXT,
    value: APIRecommendedArchiveDutyChoice.Kb,
  },
  {
    name: ARCHIVE_DK_TYPE_TEXT,
    value: APIRecommendedArchiveDutyChoice.Dk,
  },
  {
    name: ARCHIVE_DD_TYPE_TEXT,
    value: APIRecommendedArchiveDutyChoice.Dd,
  },
  {
    name: ARCHIVE_TEXT_NO_RECOMMENDATION,
    value: APIRecommendedArchiveDutyChoice.NoRecommendation,
  },
];

export const mapArchiveDutyRecommendationChoice = (
  value?: APIRecommendedArchiveDutyChoice,
): ArchiveDutyRecommendationChoice | undefined => {
  return archiveDutyRecommendationChoiceOptions.find((option) => option.value === value);
};
