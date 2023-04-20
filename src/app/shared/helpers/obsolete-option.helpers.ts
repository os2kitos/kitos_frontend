import { Dictionary } from '../models/primitives/dictionary.model';

export function mapObsoleteValue<T extends { name: string }>(
  selectedUuid: string,
  selectedValue: string,
  availableValues: Dictionary<T>
) {
  const availableOption = availableValues[selectedUuid];
  const obsoletedText = $localize`udgået`;
  return availableOption?.name ?? `${selectedValue} (${obsoletedText})`;
}
