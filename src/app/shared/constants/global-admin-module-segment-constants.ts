import { SegmentButtonOption } from '../components/segment/segment.component';

export enum GlobalAdminModuleSegmentOptionType {
  RegularOptionTypes = 'RegularOptionTypes',
  RoleOptionTypes = 'RoleOptionTypes',
}

export const GlobalAdminModuleSegmentOptions: SegmentButtonOption<GlobalAdminModuleSegmentOptionType>[] = [
  { text: $localize`Tilpasning af udfaldsrum`, value: GlobalAdminModuleSegmentOptionType.RegularOptionTypes },
  { text: $localize`Tilpasning af roller`, value: GlobalAdminModuleSegmentOptionType.RoleOptionTypes },
];
