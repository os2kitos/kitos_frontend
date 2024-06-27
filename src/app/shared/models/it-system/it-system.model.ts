import { AccessModifierChoice, mapAccessModifierEnumToAccessModifierChoice } from '../access-modifier.model';
import { ArchiveDutyChoice, mapArchiveDutyChoice } from '../it-system-usage/archive-duty-choice.model';

export interface ITSystem {
  id: string;
  Uuid: string;
  Name: string;
  PreviousName: string;
  Parent: { Disabled: boolean; Name: string };
  EksternalUuid: string;
  AccessModifier: AccessModifierChoice | undefined;
  KLEIds: string;
  KLENames: string;
  Organization: { Name: string };
  LastChangedByUser: { Name: string };
  Disabled: boolean;
  LastChanged: string;
  Reference: { Title: string; URL: string; ExternalReferenceId: string };
  ArchiveDuty: ArchiveDutyChoice | undefined;
  ArchiveDutyComment: string;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const adaptITSystem = (value: any): ITSystem | undefined => {
  if (!value.Uuid) return;

  return {
    id: value.Uuid,
    Uuid: value.Uuid,
    Name: value.Name,
    PreviousName: value.PreviousName,
    Parent: value.Parent,
    EksternalUuid: value.ExternalUuid,
    AccessModifier: mapAccessModifierEnumToAccessModifierChoice(value.AccessModifier),
    KLEIds: value.TaskRefs?.map((task: { TaskKey: string }) => task.TaskKey).join(', ') ?? '',
    KLENames: value.TaskRefs?.map((task: { Description: string }) => task.Description).join(', ') ?? '',
    Organization: value.Organization,
    LastChangedByUser: { Name: `${value.LastChangedByUser?.Name} ${value.LastChangedByUser?.LastName}` },
    LastChanged: value.LastChanged,
    Disabled: value.Disabled,
    Reference: value.Reference,
    ArchiveDuty: mapArchiveDutyChoice(value.ArchiveDuty),
    ArchiveDutyComment: value.ArchiveDutyComment,
  };
};
