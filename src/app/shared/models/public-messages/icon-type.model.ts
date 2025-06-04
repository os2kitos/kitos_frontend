import { APIPublicMessageRequestDTO } from 'src/app/api/v2';
import { IconType } from '../icon-type';

export interface PublicMessageIconType {
  name: string;
  icon: IconType;
  value: APIPublicMessageRequestDTO.IconTypeEnum;
}

export const iconTypeOptions: PublicMessageIconType[] = [
  {
    name: $localize`Dokument`,
    icon: 'document',
    value: APIPublicMessageRequestDTO.IconTypeEnum.Document,
  },
  {
    name: $localize`Udklipsholder`,
    icon: 'clipboard',
    value: APIPublicMessageRequestDTO.IconTypeEnum.Clipboard,
  },
  {
    name: $localize`Indstillinger`,
    icon: 'settings',
    value: APIPublicMessageRequestDTO.IconTypeEnum.Settings,
  },
  {
    name: $localize`Kalendar`,
    icon: 'calendar',
    value: APIPublicMessageRequestDTO.IconTypeEnum.Calendar,
  },
  {
    name: $localize`Brugere`,
    icon: 'multiple-users',
    value: APIPublicMessageRequestDTO.IconTypeEnum.MultipleUsers,
  },
  {
    name: $localize`Mail`,
    icon: 'mail',
    value: APIPublicMessageRequestDTO.IconTypeEnum.Mail,
  },
];

export const mapIconType = (value?: APIPublicMessageRequestDTO.IconTypeEnum): PublicMessageIconType | undefined => {
  return iconTypeOptions.find((option) => option.value === value);
};
