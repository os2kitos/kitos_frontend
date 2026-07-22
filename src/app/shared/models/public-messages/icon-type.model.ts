import { APIPublicMessageIconTypeChoice } from 'src/app/api/v2';
import { IconType } from '../icon-type';

export interface PublicMessageIconType {
  name: string;
  icon: IconType;
  value: APIPublicMessageIconTypeChoice;
}

export const iconTypeOptions: PublicMessageIconType[] = [
  {
    name: $localize`Dokument`,
    icon: 'document',
    value: APIPublicMessageIconTypeChoice.Document,
  },
  {
    name: $localize`Udklipsholder`,
    icon: 'clipboard',
    value: APIPublicMessageIconTypeChoice.Clipboard,
  },
  {
    name: $localize`Indstillinger`,
    icon: 'settings',
    value: APIPublicMessageIconTypeChoice.Settings,
  },
  {
    name: $localize`Kalendar`,
    icon: 'calendar',
    value: APIPublicMessageIconTypeChoice.Calendar,
  },
  {
    name: $localize`Brugere`,
    icon: 'multiple-users',
    value: APIPublicMessageIconTypeChoice.MultipleUsers,
  },
  {
    name: $localize`Mail`,
    icon: 'mail',
    value: APIPublicMessageIconTypeChoice.Mail,
  },
];

export const mapIconType = (value?: APIPublicMessageIconTypeChoice): PublicMessageIconType | undefined => {
  return iconTypeOptions.find((option) => option.value === value);
};
