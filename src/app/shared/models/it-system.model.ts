export interface ITSystem {
  id: string;
  systemName: string;
  systemActive: boolean;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const adaptITSystem = (value: any): ITSystem | undefined => {
  if (!value.ItSystemUuid) return;

  return {
    id: value.ItSystemUuid,
    systemName: value.SystemName,
    systemActive: value.SystemActive,
  };
};
