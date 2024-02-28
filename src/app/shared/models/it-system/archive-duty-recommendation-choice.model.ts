import { APIRecommendedArchiveDutyResponseDTO } from 'src/app/api/v2';

export interface ArchiveDutyRecommendationChoice {
  name: string;
  value: APIRecommendedArchiveDutyResponseDTO.IdEnum;
}

export const archiveDutyRecommendationChoiceOptions: ArchiveDutyRecommendationChoice[] = [
  {
    name: $localize`B`,
    value: APIRecommendedArchiveDutyResponseDTO.IdEnum.B,
  },
  {
    name: $localize`K`,
    value: APIRecommendedArchiveDutyResponseDTO.IdEnum.K,
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
