export interface ITSystem {
  id: string;
  name: string;
  disabled: boolean;
  lastChangedById: number;
  lastChangedAt: string;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const adaptITSystem = (value: any): ITSystem | undefined => {
  if (!value.Uuid) return;

  return {
    id: value.Uuid,
    name: value.Name,
    disabled: value.Disabled,
    lastChangedById: value.LastChangedByUserId,
    lastChangedAt: value.LastChanged,
  };
};
