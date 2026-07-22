import { APIGDPRPersonalDataChoice } from 'src/app/api/v2';

export interface SpecificPersonalData {
  name: string;
  value: APIGDPRPersonalDataChoice;
}

export const specificPersonalDataOptions: SpecificPersonalData[] = [
  { name: 'CprNumber', value: APIGDPRPersonalDataChoice.CprNumber },
  { name: 'SocialProblems', value: APIGDPRPersonalDataChoice.SocialProblems },
  { name: 'OtherPrivateMatters', value: APIGDPRPersonalDataChoice.OtherPrivateMatters },
];

export const mapSpecificPersonalData = (value?: APIGDPRPersonalDataChoice): SpecificPersonalData | undefined => {
  return specificPersonalDataOptions.find((option) => option.value === value);
};
