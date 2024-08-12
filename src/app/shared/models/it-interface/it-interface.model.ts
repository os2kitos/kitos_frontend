import { AccessModifierChoice, mapAccessModifierEnumToAccessModifierChoice } from '../access-modifier.model';

export interface ITInterface {
  id: string;
  Uuid: string;
  ItInterfaceId: string;
  Name: string;
  Version: string;
  AccessModifier: AccessModifierChoice | undefined;
  Disabled: boolean;
  Url: string | undefined;
  ExhibitedBy: { ItSystem: { Uuid: string; Name: string; BelongsTo: { Name: string } } };
  Interface: { Name: string };
  DataRows: string;
  Organization: { Name: string };
  ObjectOwner: { Name: string };
  LastChangedByUser: { Name: string };
  LastChangedByUserId: number;
  LastChanged: string;
  Usages: string[];
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const adaptITInterface = (value: any): ITInterface | undefined => {
  if (!value.Uuid) return;

  const objectOwner = value.ObjectOwner;
  const lastChangedByUser = value.LastChangedByUser;
  return {
    id: value.Uuid,
    Uuid: value.Uuid,
    ItInterfaceId: value.itInterfaceId ?? '',
    Name: value.Name ?? '',
    AccessModifier: mapAccessModifierEnumToAccessModifierChoice(value.AccessModifier),
    Version: value.Version,
    Disabled: value.Disabled,
    Url: value.Url,
    ExhibitedBy: value.ExhibitedBy,
    Interface: value.Interface,
    DataRows: value.DataRows?.map((row: { DataType: { Name: string } }) => row?.DataType?.Name)?.join(', ') ?? '',
    Organization: value.Organization,
    ObjectOwner: { Name: `${objectOwner?.Name} ${objectOwner?.LastName}` },
    LastChangedByUser: { Name: `${lastChangedByUser?.Name} ${lastChangedByUser?.LastName}` },
    LastChangedByUserId: value.LastChangedByUserId,
    LastChanged: value.LastChanged,
    Usages: value.UsedByOrganizationNames,
  };
};
