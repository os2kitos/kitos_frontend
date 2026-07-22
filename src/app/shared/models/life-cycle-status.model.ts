import { APILifeCycleStatusChoice } from 'src/app/api/v2';

export interface LifeCycleStatus {
  name: string;
  value: APILifeCycleStatusChoice;
}

export const lifeCycleStatusOptions: LifeCycleStatus[] = [
  { name: $localize`Ikke i drift`, value: APILifeCycleStatusChoice.NotInUse },
  { name: $localize`Under afprøvning`, value: APILifeCycleStatusChoice.Pilot },
  {
    name: $localize`Under indfasning`,
    value: APILifeCycleStatusChoice.PhasingIn,
  },
  { name: $localize`I drift`, value: APILifeCycleStatusChoice.Operational },
  {
    name: $localize`Under udfasning`,
    value: APILifeCycleStatusChoice.PhasingOut,
  },
];

export const mapLifeCycleStatus = (value?: APILifeCycleStatusChoice): LifeCycleStatus | undefined => {
  return lifeCycleStatusOptions.find((option) => option.value === value);
};
