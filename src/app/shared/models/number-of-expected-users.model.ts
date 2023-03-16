import { APIExpectedUsersIntervalDTO } from 'src/app/api/v2';

export interface NumberOfExpectedUsers {
  name: string;
  value: APIExpectedUsersIntervalDTO;
}

export const numberOfExpectedUsersOptions: NumberOfExpectedUsers[] = [
  { name: '<10', value: { lowerBound: 0, upperBound: 9 } },
  { name: '10-50', value: { lowerBound: 10, upperBound: 50 } },
  { name: '50-100', value: { lowerBound: 50, upperBound: 100 } },
  { name: '>100', value: { lowerBound: 100, upperBound: undefined } },
];

export const mapNumberOfExpectedUsers = (
  numberOfExpectedUsers?: APIExpectedUsersIntervalDTO
): NumberOfExpectedUsers | undefined => {
  return numberOfExpectedUsersOptions.find((option) => option.value.lowerBound === numberOfExpectedUsers?.lowerBound);
};
