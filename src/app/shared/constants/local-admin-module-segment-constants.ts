import { SegmentButtonOption } from "../components/segment/segment.component";

export enum LocalAdminModuleSegmentOptionType {
  UiCustomization = 'UiCustomization',
  RegularOptionTypes = 'RegularOptionTypes',
  RoleOptionTypes = 'RoleOptionTypes',
}

export const LocalAdminModuleSegmentOptions: SegmentButtonOption<LocalAdminModuleSegmentOptionType>[] = [
  { text: $localize`Lokal tilpasning af brugerfladen`, value: LocalAdminModuleSegmentOptionType.UiCustomization },
    { text: $localize`Lokal tilpasning af udfaldsrum`, value: LocalAdminModuleSegmentOptionType.RegularOptionTypes },
    { text: $localize`Lokal tilpasning af roller`, value: LocalAdminModuleSegmentOptionType.RoleOptionTypes },
]
