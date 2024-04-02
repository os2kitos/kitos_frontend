export interface ITContract {
  id: string;
  name: string;
  disabled: boolean;
  lastChangedById: number;
  lastChangedAt: string;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const adaptITContract = (value: any): ITContract | undefined => {
  if (!value.SourceEntityUuid) return;

  return {
    id: value.SourceEntityUuid,
    name: value.Name,
    disabled: value.IsActive === 'false',
    lastChangedById: value.LastEditedByUserId,
    lastChangedAt: value.LastEditedAtDate,
  };
};
