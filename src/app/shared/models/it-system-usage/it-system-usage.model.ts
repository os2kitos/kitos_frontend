export interface ITSystemUsage {
  id: string;
  systemName: string;
  systemActive: boolean;
  lastChangedById: number;
  lastChangedAt: string;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const adaptITSystemUsage = (value: any): ITSystemUsage | undefined => {
  if (!value.SourceEntityUuid) return;

  return {
    id: value.SourceEntityUuid,
    systemName: value.SystemName,
    systemActive: value.SystemActive,
    lastChangedById: value.LastChangedById,
    lastChangedAt: value.LastChangedAt,
  };
};
