import { APIDataSensitivityLevelChoice } from 'src/app/api/v2';

export interface DataSensitivityLevel {
  name: string;
  value: APIDataSensitivityLevelChoice;
}

export const dataSensitivityLevelOptions: DataSensitivityLevel[] = [
  { name: $localize`Ingen personoplysninger`, value: APIDataSensitivityLevelChoice.None },
  {
    name: $localize`Almindelige personoplysninger`,
    value: APIDataSensitivityLevelChoice.PersonData,
  },
  {
    name: $localize`Følsomme personoplysninger`,
    value: APIDataSensitivityLevelChoice.SensitiveData,
  },
  {
    name: $localize`Straffedomme og lovovertrædelser`,
    value: APIDataSensitivityLevelChoice.LegalData,
  },
];

export const mapDataSensitivityLevel = (value?: APIDataSensitivityLevelChoice): DataSensitivityLevel | undefined => {
  return dataSensitivityLevelOptions.find((option) => option.value === value);
};

const dataSensitivityLevelStringToNumberMap: { [key: string]: number } = {
  None: 0,
  PersonData: 1,
  SensitiveData: 2,
  LegalData: 3,
};

export const convertDataSensitivityLevelStringToNumberMap = (str: string): number | undefined => {
  return dataSensitivityLevelStringToNumberMap[str];
};
