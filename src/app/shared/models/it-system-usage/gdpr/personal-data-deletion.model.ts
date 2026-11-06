import { APIPersonalDataDeletionCapabilityChoice, APIPersonalDataDeletionMethodChoice } from 'src/app/api/v2';
import { DropdownOption } from '../../dropdown-option.model';

export const personalDataDeletionCapabilityOptions: DropdownOption<APIPersonalDataDeletionCapabilityChoice>[] = [
  { value: 'No', name: $localize`Nej` },
  { value: 'IndividualRecords', name: $localize`Ja, enkelte poster` },
  { value: 'BulkDeletion', name: $localize`Ja, massesletning` },
];
export const personalDataDeletionMethodOptions: DropdownOption<APIPersonalDataDeletionMethodChoice>[] = [
  { value: 'AutomaticallyBySystem', name: $localize`Sletning foretages automatisk i systemet` },
  { value: 'ManuallyByOrganization', name: $localize`Sletning foretages manuelt i organisationen` },
  { value: 'BySupplierOnRequest', name: $localize`Sletning foretages på bestilling hos leverandøren` },
];
export function supportsPersonalDataDeletion(capability?: APIPersonalDataDeletionCapabilityChoice | null): boolean {
  return capability === 'IndividualRecords' || capability === 'BulkDeletion';
}
