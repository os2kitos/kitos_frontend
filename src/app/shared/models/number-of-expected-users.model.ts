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
  { name: $localize`10-50`, value: { lowerBound: 10, upperBound: 50 } },
  { name: $localize`50-100`, value: { lowerBound: 50, upperBound: 100 } },
  { name: $localize`>100`, value: { lowerBound: 100, upperBound: undefined } },
];

export const mapNumberOfExpectedUsers = (
  numberOfExpectedUsers?: APIExpectedUsersIntervalDTO
): NumberOfExpectedUsers | undefined => {
  return numberOfExpectedUsersOptions.find((option) => option.value.lowerBound === numberOfExpectedUsers?.lowerBound);
};

export const numberOfExpectedUsersOptionsGrid: NumberOfExpectedUsersGrid[] = [
  { name: $localize`<10`, value: 'BELOWTEN' },
  { name: $localize`10-50`, value: 'TENTOFIFTY' },
  { name: $localize`50-100`, value: 'FIFTYTOHUNDRED' },
  { name: $localize`>100`, value: 'HUNDREDPLUS' },
];

export const mapGridNumberOfExpectedUsers = (value?: string): NumberOfExpectedUsersGrid | undefined => {
  return numberOfExpectedUsersOptionsGrid.find((option) => option.value === value);
};
