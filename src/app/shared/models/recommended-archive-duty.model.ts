import { APIRecommendedArchiveDutyResponseDTO } from 'src/app/api/v2';

export const mapRecommendedArchiveDutyToString = (value: APIRecommendedArchiveDutyResponseDTO): string | undefined => {
  switch (value.id) {
    case APIRecommendedArchiveDutyResponseDTO.IdEnum.Undecided:
      return undefined;
    case APIRecommendedArchiveDutyResponseDTO.IdEnum.NoRecommendation:
      return $localize`Ingen vejledning`;
    default:
      return value.id;
  }
};

export const mapRecommendedArchiveDutyComment = (value: APIRecommendedArchiveDutyResponseDTO): string => {
  if (!value.id || value.id === APIRecommendedArchiveDutyResponseDTO.IdEnum.Undecided) return '';
  return value.comment || '';
};
