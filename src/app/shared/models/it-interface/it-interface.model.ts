import {
  AccessModifierChoice,
  mapAccessModifierEnumToAccessModifierChoice,
} from './it-interface-access-modifier.model';

export interface ITInterface {
  id: string;
  ItInterfaceId: string;
  Name: string;
  Version: string;
  AccessModifier: AccessModifierChoice | undefined;
  Disabled: boolean;
  Url: string;
  ExhibitedBy: { ItSystem: { BelongsTo: { Name: string } } };
  LastChangedByUserId: number;
  LastChanged: string;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const adaptITInterface = (value: any): ITInterface | undefined => {
  if (!value.Uuid) return;

  return {
    id: value.Uuid,
    ItInterfaceId: value.itInterfaceId,
    Name: value.Name,
    AccessModifier: mapAccessModifierEnumToAccessModifierChoice(value.AccessModifier),
    Version: value.Version,
    Disabled: value.Disabled,
    Url: value.Url,
    ExhibitedBy: value.ExhibitedBy,
    LastChangedByUserId: value.LastChangedByUserId,
    LastChanged: value.LastChanged,
  };
};
