import { APIPublicMessageStatusChoice } from 'src/app/api/v2';

export interface StatusType {
  name: string;
  value: APIPublicMessageStatusChoice;
}

export const statusTypeOptions: StatusType[] = [
  {
    name: $localize`Normal drift`,
    value: APIPublicMessageStatusChoice.Active,
  },
  {
    name: $localize`Ustabil drift`,
    value: APIPublicMessageStatusChoice.Inactive,
  },
];

export const mapStatusType = (value?: APIPublicMessageStatusChoice): StatusType | undefined => {
  return statusTypeOptions.find((option) => option.value === value);
};
