import { APIDataProcessingRegistrationReadModel } from "src/app/api/v1";

export interface IsAgreementConcluded {
  name: string,
  value: APIDataProcessingRegistrationReadModel.IsAgreementConcludedEnum
}

export const isAgreementConcludedOptions: IsAgreementConcluded[] = [
  {
    name: $localize`Ja`,
    value: APIDataProcessingRegistrationReadModel.IsAgreementConcludedEnum.Yes
  },
  {
    name: $localize`Nej`,
    value: APIDataProcessingRegistrationReadModel.IsAgreementConcludedEnum.No
  },
  {
    name: '',
    value: APIDataProcessingRegistrationReadModel.IsAgreementConcludedEnum.Undecided
  },
  {
    name: $localize`Ikke relevant`,
    value: APIDataProcessingRegistrationReadModel.IsAgreementConcludedEnum.Irrelevant
  }
]

export const mapIsAgreementConcluded = (
  source?: APIDataProcessingRegistrationReadModel.IsAgreementConcludedEnum
): IsAgreementConcluded | undefined => {
  return isAgreementConcludedOptions.find((option) => option.value === source)
}
