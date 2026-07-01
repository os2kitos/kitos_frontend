export interface ItSystemUsageArchiveOData {
  id: string;
  Uuid: string;
  ArchivingDate: string;
  ReferenceName: string | null;
  Note: string | null;
  Snapshot: ArchiveSnapshot | null;
  ArchivedByUser: ArchiveUser | null;
}

interface ArchiveSnapshot {
  LegacyName: string | null;
  LocalName: string | null;
  LocalId: string | null;
  ItSystem: {
    Uuid: string | null;
    Name: string | null;
  };
}

interface ArchiveUser {
  Name: string;
  LastName: string;
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
    Snapshot: value.Snapshot ?? null,
    ArchivedByUser: value.ArchivedByUser ?? null,
  };
};
