import { APIItSystemUsageValidityResponseDTO } from 'src/app/api/v2';

export interface LifeCycleStatus {
  name: string;
  value: APIItSystemUsageValidityResponseDTO.LifeCycleStatusEnum;
}

export const lifeCycleStatusOptions: LifeCycleStatus[] = [
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
): LifeCycleStatus | undefined => {
  return lifeCycleStatusOptions.find((option) => option.value === value);
};
