import { APIExpectedUsersIntervalDTO } from 'src/app/api/v2';

export interface NumberOfExpectedUsers {
  name: string;
  value: APIExpectedUsersIntervalDTO;
}

export interface NumberOfExpectedUsersGrid {
  name: string;
  value: string;
}

export const numberOfExpectedUsersOptions: NumberOfExpectedUsers[] = [
  { name: $localize`<10`, value: { lowerBound: 0, upperBound: 9 } },
  { name: $localize`10-49`, value: { lowerBound: 10, upperBound: 49 } },
  { name: $localize`50-99`, value: { lowerBound: 50, upperBound: 99 } },
  { name: $localize`100-499`, value: { lowerBound: 100, upperBound: 499 } },
  { name: $localize`>500`, value: { lowerBound: 500, upperBound: undefined } },
];

export const mapNumberOfExpectedUsers = (
  numberOfExpectedUsers?: APIExpectedUsersIntervalDTO
): NumberOfExpectedUsers | undefined => {
  return numberOfExpectedUsersOptions.find((option) => option.value.lowerBound === numberOfExpectedUsers?.lowerBound);
};

export const numberOfExpectedUsersOptionsGrid: NumberOfExpectedUsersGrid[] = [
  { name: $localize`<10`, value: 'BELOWTEN' },
  { name: $localize`10-49`, value: 'TENTOFORTYNINE' },
  { name: $localize`50-99`, value: 'FIFTYTONINETYNINE' },
  { name: $localize`100-499`, value: 'HUNDREDTOFOURHUNDREDNINETYNINE' },
  { name: $localize`>500`, value: 'FIVEHUNDREDPLUS' },
];

export const mapGridNumberOfExpectedUsers = (value?: string): NumberOfExpectedUsersGrid | undefined => {
  return numberOfExpectedUsersOptionsGrid.find((option) => option.value === value);
};
