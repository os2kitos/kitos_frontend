import { APIRecommendedArchiveDutyResponseDTO } from 'src/app/api/v2';
import {
  ARCHIVE_B_TYPE_TEXT,
  ARCHIVE_K_TYPE_TEXT,
  ARCHIVE_PRESERVE_DATA_CAN_DISCARD_DOCUMENTS_TEXT,
  ARCHIVE_TEXT_NO_RECOMMENDATION,
} from '../constants/archive.constants';

export const mapRecommendedArchiveDutyToString = (value: APIRecommendedArchiveDutyResponseDTO): string | undefined => {
  switch (value.id) {
    case APIRecommendedArchiveDutyResponseDTO.IdEnum.Undecided:
      return undefined;
    case APIRecommendedArchiveDutyResponseDTO.IdEnum.NoRecommendation:
      return ARCHIVE_TEXT_NO_RECOMMENDATION;
    case APIRecommendedArchiveDutyResponseDTO.IdEnum.B:
      return ARCHIVE_B_TYPE_TEXT;
    case APIRecommendedArchiveDutyResponseDTO.IdEnum.K:
      return ARCHIVE_K_TYPE_TEXT;
    case APIRecommendedArchiveDutyResponseDTO.IdEnum.PreserveDataCanDiscardDocuments:
      return ARCHIVE_PRESERVE_DATA_CAN_DISCARD_DOCUMENTS_TEXT;
    default:
      throw new Error(`Unknown archive duty recommendation: ${value.id}`);
  }
};

export const mapRecommendedArchiveDutyComment = (value: APIRecommendedArchiveDutyResponseDTO): string => {
  if (!value.id || value.id === APIRecommendedArchiveDutyResponseDTO.IdEnum.Undecided) return '';
  return value.comment || '';
};
