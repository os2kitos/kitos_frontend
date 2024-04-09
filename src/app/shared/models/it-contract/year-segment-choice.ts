import { APIContractTerminationTermsRequestDTO } from 'src/app/api/v2';

export interface YearSegmentChoice {
  name: string;
  value:
    | APIContractTerminationTermsRequestDTO.NoticePeriodExtendsCurrentEnum
    | APIContractTerminationTermsRequestDTO.NoticeByEndOfEnum;
}

export const yearSegmentChoiceOptions: YearSegmentChoice[] = [
  {
    name: $localize`Kalenderår`,
    value: APIContractTerminationTermsRequestDTO.NoticePeriodExtendsCurrentEnum.EndOfCalendarYear,
  },
  {
    name: $localize`Kvartal`,
    value: APIContractTerminationTermsRequestDTO.NoticePeriodExtendsCurrentEnum.EndOfQuarter,
  },
  {
    name: $localize`Måned`,
    value: APIContractTerminationTermsRequestDTO.NoticePeriodExtendsCurrentEnum.EndOfMonth,
  },
];

export const mapYearSegmentChoice = (
  value?:
    | APIContractTerminationTermsRequestDTO.NoticePeriodExtendsCurrentEnum
    | APIContractTerminationTermsRequestDTO.NoticeByEndOfEnum
): YearSegmentChoice | undefined => {
  return yearSegmentChoiceOptions.find((option) => option.value === value);
};
