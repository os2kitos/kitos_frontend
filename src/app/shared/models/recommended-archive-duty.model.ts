import { APIRecommendedArchiveDutyResponseDTO } from 'src/app/api/v2';

export interface RecommendedArchiveDutyChoice {
  name: string;
  value: APIRecommendedArchiveDutyResponseDTO.IdEnum;
}

export const recommendedArchiveDutyChoiceOptions: RecommendedArchiveDutyChoice[] = [
  {
    name: $localize`Ikke besluttet`,
    value: APIRecommendedArchiveDutyResponseDTO.IdEnum.Undecided,
  },
  {
    name: $localize`B`,
    value: APIRecommendedArchiveDutyResponseDTO.IdEnum.B,
  },
  {
    name: $localize`K`,
    value: APIRecommendedArchiveDutyResponseDTO.IdEnum.K,
  },
  {
    name: $localize`Ingen vejledning`,
    value: APIRecommendedArchiveDutyResponseDTO.IdEnum.NoRecommendation,
  },
];

export const mapRecommendedArchiveDutyChoice = (
  value?: APIRecommendedArchiveDutyResponseDTO.IdEnum
): RecommendedArchiveDutyChoice | undefined => {
  return recommendedArchiveDutyChoiceOptions.find((option) => option.value === value);
};

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
