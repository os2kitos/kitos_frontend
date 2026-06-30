export interface ItSystemUsageArchiveOData {
  id: string;
  Uuid: string;
  ArchivingDate: string;
  ReferenceName: string | null;
  Note: string | null;
  LegacyName: string | null;
  LocalName: string | null;
  LocalId: string | null;
  SystemName: string | null;
  SystemUuid: string | null;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const adaptItSystemUsageArchive = (value: any): ItSystemUsageArchiveOData | undefined => {
  if (!value.Uuid) return;

  return {
    id: value.Uuid,
    Uuid: value.Uuid,
    ArchivingDate: value.ArchivingDate,
    ReferenceName: value.ReferenceName ?? null,
    Note: value.Note ?? null,
    LegacyName: value.LegacyName ?? null,
    LocalName: value.LocalName ?? null,
    LocalId: value.LocalId ?? null,
    SystemUuid: value.Snapshot?.ItSystem?.Uuid ?? null,
    SystemName: value.Snapshot?.ItSystem?.Name ?? null,
  };
};
