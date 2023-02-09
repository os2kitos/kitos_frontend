export interface ITSystem {
  id: string;
  systemName: string;
  systemActive: boolean;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const adaptITSystem = (value: any): ITSystem | undefined => {
  if (!value.SourceEntityUuid) return;

  return {
    id: value.SourceEntityUuid,
    systemName: value.SystemName,
    systemActive: value.SystemActive,
  };
};
