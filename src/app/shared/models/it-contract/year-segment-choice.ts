import { APIYearSegmentChoice } from 'src/app/api/v2';

export interface YearSegmentChoice {
  name: string;
  value: APIYearSegmentChoice;
}

export const yearSegmentChoiceOptions: YearSegmentChoice[] = [
  {
    name: $localize`Kalenderår`,
    value: APIYearSegmentChoice.EndOfCalendarYear,
  },
  {
    name: $localize`Kvartal`,
    value: APIYearSegmentChoice.EndOfQuarter,
  },
  {
    name: $localize`Måned`,
    value: APIYearSegmentChoice.EndOfMonth,
  },
  {
    name: $localize`Faktureringsperiode`,
    value: APIYearSegmentChoice.BillingPeriod,
  },
];

export const mapYearSegmentChoice = (value?: APIYearSegmentChoice): YearSegmentChoice | undefined => {
  return yearSegmentChoiceOptions.find((option) => option.value === value);
};
