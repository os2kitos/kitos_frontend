import { AppPath } from 'src/app/shared/enums/app-path';

export interface NavMenuItem {
  text: string;
  path: AppPath;
  icon?: string;
  items?: NavMenuItem[];
}
