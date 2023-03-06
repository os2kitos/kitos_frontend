import { APIRecommendedArchiveDutyResponseDTO } from 'src/app/api/v2';

export const mapRecommendedArchiveDutyToString = (value: APIRecommendedArchiveDutyResponseDTO): string | undefined => {
  switch (value.id) {
    case APIRecommendedArchiveDutyResponseDTO.IdEnum.Undecided:
      return undefined;
    case APIRecommendedArchiveDutyResponseDTO.IdEnum.NoRecommendation:
      return $localize`Ved ikke`;
    default:
      return value.id;
  }
};
