import { APIArchiveDutyChoice } from 'src/app/api/v2';
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

export interface ArchiveDutyChoice {
  name: string;
  value: APIArchiveDutyChoice;
}

export const archiveDutyChoiceOptions: ArchiveDutyChoice[] = [
  {
    name: ARCHIVE_B_TYPE_TEXT,
    value: APIArchiveDutyChoice.B,
  },
  {
    name: ARCHIVE_BK_TYPE_TEXT,
    value: APIArchiveDutyChoice.Bk,
  },
  {
    name: ARCHIVE_PRESERVE_DATA_CAN_DISCARD_DOCUMENTS_TEXT,
    value: APIArchiveDutyChoice.PreserveDataCanDiscardDocuments,
  },
  {
    name: ARCHIVE_K_TYPE_TEXT,
    value: APIArchiveDutyChoice.K,
  },
  {
    name: ARCHIVE_KD_TYPE_TEXT,
    value: APIArchiveDutyChoice.Kd,
  },
  {
    name: ARCHIVE_KB_TYPE_TEXT,
    value: APIArchiveDutyChoice.Kb,
  },
  {
    name: ARCHIVE_DK_TYPE_TEXT,
    value: APIArchiveDutyChoice.Dk,
  },
  {
    name: ARCHIVE_DD_TYPE_TEXT,
    value: APIArchiveDutyChoice.Dd,
  },
  {
    name: ARCHIVE_TEXT_NO_RECOMMENDATION,
    value: APIArchiveDutyChoice.Unknown,
  },
];

export const mapArchiveDutyChoice = (value?: APIArchiveDutyChoice): ArchiveDutyChoice | undefined => {
  return archiveDutyChoiceOptions.find((option) => option.value === value);
};
