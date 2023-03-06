import { APIExpectedUsersIntervalDTO } from 'src/app/api/v2';

export interface NumberOfExpectedUsers {
  name: string;
  value: APIExpectedUsersIntervalDTO;
}

export const numberOfExpectedUsersOptions: NumberOfExpectedUsers[] = [
  { name: '<10', value: { lowerBound: 0, upperBound: 9 } },
  { name: '10-50', value: { lowerBound: 10, upperBound: 49 } },
  { name: '50-100', value: { lowerBound: 50, upperBound: 99 } },
  { name: '>100', value: { lowerBound: 100, upperBound: undefined } },
];
