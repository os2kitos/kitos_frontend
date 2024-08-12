import { APIDataProcessingRegistrationReadModel } from "src/app/api/v1";

export interface IsOversightCompleted {
  name: string;
  value: APIDataProcessingRegistrationReadModel.IsOversightCompletedEnum;
}

export const isOversightCompletedOptions: IsOversightCompleted[] = [
  {
    name: $localize`Ja`,
    value: APIDataProcessingRegistrationReadModel.IsOversightCompletedEnum.Yes
  },
  {
    name: $localize`Nej`,
    value: APIDataProcessingRegistrationReadModel.IsOversightCompletedEnum.No
  },
  {
    name: '',
    value: APIDataProcessingRegistrationReadModel.IsOversightCompletedEnum.Undecided
  }
]

export const mapIsOversightCompleted = (
  source?: APIDataProcessingRegistrationReadModel.IsOversightCompletedEnum
): IsOversightCompleted | undefined => {
  return isOversightCompletedOptions.find((option) => option.value === source)
}
