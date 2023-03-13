import { APIItSystemUsageValidityResponseDTO } from 'src/app/api/v2';

export const lifeCycleStatusOptions = [
  {
    name: $localize`Under indfasning`,
    value: APIItSystemUsageValidityResponseDTO.LifeCycleStatusEnum.PhasingIn,
  },
  { name: $localize`I drift`, value: APIItSystemUsageValidityResponseDTO.LifeCycleStatusEnum.Operational },
  {
    name: $localize`Under udfasning`,
    value: APIItSystemUsageValidityResponseDTO.LifeCycleStatusEnum.PhasingOut,
  },
  { name: $localize`Ikke i drift`, value: APIItSystemUsageValidityResponseDTO.LifeCycleStatusEnum.NotInUse },
];

export const mapLifeCycleStatus = (
  value?: APIItSystemUsageValidityResponseDTO.LifeCycleStatusEnum
): APIItSystemUsageValidityResponseDTO.LifeCycleStatusEnum | undefined => {
  switch (value) {
    case APIItSystemUsageValidityResponseDTO.LifeCycleStatusEnum.Undecided:
      return undefined;
    default:
      return value;
  }
};
