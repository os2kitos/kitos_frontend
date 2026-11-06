import { APISystemRelationDirectionChoice } from 'src/app/api/v2';
import { DropdownOption } from '../dropdown-option.model';

export const systemRelationDirectionOptions: DropdownOption<APISystemRelationDirectionChoice>[] = [
  { name: $localize`Indgående data`, value: APISystemRelationDirectionChoice.IncomingData },
  { name: $localize`Udgående data`, value: APISystemRelationDirectionChoice.OutgoingData },
  { name: $localize`Bidirektionel`, value: APISystemRelationDirectionChoice.BidirectionalData },
];

export const mapSystemRelationDirection = (
  value?: APISystemRelationDirectionChoice,
): DropdownOption<APISystemRelationDirectionChoice> | undefined => {
  return systemRelationDirectionOptions.find((option) => option.value === value);
};
