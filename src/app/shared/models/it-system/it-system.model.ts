import { AccessModifierChoice, mapAccessModifierEnumToAccessModifierChoice } from '../access-modifier.model';
import {
  ArchiveDutyRecommendationChoice,
  mapArchiveDutyRecommendationChoice,
} from './archive-duty-recommendation-choice.model';

export interface ITSystem {
  id: string;
  Uuid: string;
  Name: string;
  IsInUse: boolean;
  PreviousName: string;
  Parent: { Name: string };
  EksternalUuid: string;
  Description: string;
  AccessModifier: AccessModifierChoice | undefined;
  KLEIds: { TaskKey: string };
  KLENames: { Description: string };
  Organization: { Name: string };
  LastChangedByUser: { Name: string };
  Disabled: boolean;
  LastChanged: string;
  Reference: { Title: string; URL: string; ExternalReferenceId: string };
  ArchiveDuty: ArchiveDutyRecommendationChoice | undefined;
  ArchiveDutyComment: string;
  CanChangeUsageStatus: boolean;
  BelongsTo: { Name: string };
  BusinessType: { Name: string };
  UsagesLength: number;
  Usages: string[];
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const adaptITSystem = (value: any, currentOrganizationUuid: string): ITSystem | undefined => {
  if (!value.Uuid) return;
  const isDisabled = value.Disabled;

  const mappedUsages: string[] = value.Usages.map((usage: {Organization: {Name: string}}) => {
    return usage.Organization.Name;
  });

  return {
    id: value.Uuid,
    Uuid: value.Uuid,
    Name: unavailableName(value.Name, isDisabled),
    IsInUse: value.Usages.some(
      (usage: { Organization: { Uuid: string } }) => usage.Organization.Uuid === currentOrganizationUuid
    ),
    PreviousName: value.PreviousName,
    Parent: { Name: unavailableName(value.Parent?.Name, value.Parent?.Disabled) },
    EksternalUuid: value.ExternalUuid,
    Description: value.Description,
    AccessModifier: mapAccessModifierEnumToAccessModifierChoice(value.AccessModifier),
    KLEIds: value.TaskRefs?.map((task: { TaskKey: string }) => task.TaskKey).join(', ') ?? '',
    KLENames: value.TaskRefs?.map((task: { Description: string }) => task.Description).join(', ') ?? '',
    Organization: value.Organization,
    LastChangedByUser: { Name: `${value.LastChangedByUser?.Name} ${value.LastChangedByUser?.LastName}` },
    LastChanged: value.LastChanged,
    Disabled: value.Disabled,
    Reference: value.Reference,
    ArchiveDuty: mapArchiveDutyRecommendationChoice(value.ArchiveDuty),
    ArchiveDutyComment: value.ArchiveDutyComment,
    CanChangeUsageStatus: !isDisabled,
    BelongsTo: { Name: value.BelongsTo?.Name },
    BusinessType: value.BusinessType,
    UsagesLength: value.Usages.length,
    Usages: mappedUsages,
  };
};

function unavailableName(name: string, isDisabled: boolean): string {
  return isDisabled ? name + ' ' + $localize`(Ikke tilgængeligt)` : name;
}
