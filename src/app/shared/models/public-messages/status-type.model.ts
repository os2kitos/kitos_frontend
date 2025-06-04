import { APIPublicMessageRequestDTO } from 'src/app/api/v2';

export interface StatusType {
  name: string;
  value: APIPublicMessageRequestDTO.StatusEnum;
}

export const statusTypeOptions: StatusType[] = [
  {
    name: $localize`Normal drift`,
    value: APIPublicMessageRequestDTO.StatusEnum.Active,
  },
  {
    name: $localize`Ustabil drift`,
    value: APIPublicMessageRequestDTO.StatusEnum.Inactive,
  },
];

export const mapStatusType = (value?: APIPublicMessageRequestDTO.StatusEnum): StatusType | undefined => {
  return statusTypeOptions.find((option) => option.value === value);
};
