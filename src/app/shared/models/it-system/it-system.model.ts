import { entityWithUnavailableName } from '../../helpers/string.helpers';
import { AccessModifierChoice, mapAccessModifierEnumToAccessModifierChoice } from '../access-modifier.model';
import { IdentityNamePair } from '../identity-name-pair.model';
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
  ExternalUuid: string;
  Description: string;
  AccessModifier: AccessModifierChoice | undefined;
  KLEIds: { TaskKey: string };
  KLENames: { Description: string };
  Organization: { Name: string };
  LastChangedByUser: { Name: string };
  Disabled: boolean;
  LastChanged: string;
  ReferenceTitle?: string;
  ReferenceURL?: string;
  ReferenceExternalReferenceId?: string;
  ArchiveDuty: ArchiveDutyRecommendationChoice | undefined;
  ArchiveDutyComment: string;
  CanChangeUsageStatus: boolean;
  BelongsTo: { Name: string };
  BusinessType: { Name: string };
  Usages: IdentityNamePair[];
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const adaptITSystem = (value: any, currentOrganizationUuid: string): ITSystem | undefined => {
  if (!value.Uuid) return;
  const isDisabled = value.Disabled;

  const mappedUsages: IdentityNamePair[] = value.Usages.map(
    (usage: { Organization: { Name: string; Uuid: string } }) => {
      return { name: usage.Organization.Name, uuid: usage.Organization.Uuid };
    }
  );
  const reference = value.Reference;

  return {
    id: value.Uuid,
    Uuid: value.Uuid,
    Name: entityWithUnavailableName(value.Name, !isDisabled),
    IsInUse: value.Usages.some(
      (usage: { Organization: { Uuid: string } }) => usage.Organization.Uuid === currentOrganizationUuid
    ),
    PreviousName: value.PreviousName,
    Parent: { Name: entityWithUnavailableName(value.Parent?.Name, !value.Parent?.Disabled) },
    ExternalUuid: value.ExternalUuid,
    Description: value.Description,
    AccessModifier: mapAccessModifierEnumToAccessModifierChoice(value.AccessModifier),
    KLEIds: value.TaskRefs?.map((task: { TaskKey: string }) => task.TaskKey).join(', ') ?? '',
    KLENames: value.TaskRefs?.map((task: { Description: string }) => task.Description).join(', ') ?? '',
    Organization: value.Organization,
    LastChangedByUser: { Name: `${value.LastChangedByUser?.Name} ${value.LastChangedByUser?.LastName}` },
    LastChanged: value.LastChanged,
    Disabled: value.Disabled,
    ReferenceTitle: reference?.Title,
    ReferenceURL: reference?.URL,
    ReferenceExternalReferenceId: reference?.ExternalReferenceId,
    ArchiveDuty: mapArchiveDutyRecommendationChoice(value.ArchiveDuty),
    ArchiveDutyComment: value.ArchiveDutyComment,
    CanChangeUsageStatus: !isDisabled,
    BelongsTo: { Name: value.BelongsTo?.Name },
    BusinessType: value.BusinessType,
    Usages: mappedUsages,
  };
};
