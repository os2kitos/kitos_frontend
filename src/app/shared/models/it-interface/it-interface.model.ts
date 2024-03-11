export interface ITInterface {
  id: string;
  name: string;
  lastChangedById: number;
  lastChangedAt: string;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const adaptITInterface = (value: any): ITInterface | undefined => {
  if (!value.Uuid) return;

  return {
    id: value.Uuid,
    name: value.Name,
    lastChangedById: value.LastChangedByUserId,
    lastChangedAt: value.LastChanged,
  };
};
