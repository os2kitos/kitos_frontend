export interface ITInterface {
  id: string;
  name: string;
  Enabled: boolean;
  lastChangedById: number;
  LastChanged: string;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const adaptITInterface = (value: any): ITInterface | undefined => {
  if (!value.Uuid) return;

  return {
    id: value.Uuid,
    name: value.Name,
    Enabled: !value.Disabled,
    lastChangedById: value.LastChangedByUserId,
    LastChanged: value.LastChanged,
  };
};
