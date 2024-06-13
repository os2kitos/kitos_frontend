export interface ITInterface {
  id: string;
  name: string;
  Disabled: boolean;
  LastChangedByUserId: number;
  LastChanged: string;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const adaptITInterface = (value: any): ITInterface | undefined => {
  if (!value.Uuid) return;

  return {
    id: value.Uuid,
    name: value.Name,
    Disabled: value.Disabled,
    LastChangedByUserId: value.LastChangedByUserId,
    LastChanged: value.LastChanged,
  };
};
