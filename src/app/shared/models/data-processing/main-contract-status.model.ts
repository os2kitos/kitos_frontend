export type MainContractStatus = 'NoContract' | 'Active' | 'Inactive';

export const mainContractStatusOptions = [
  { name: $localize`Ingen kontrakt`, value: 'NoContract' },
  { name: $localize`Aktiv`, value: 'Active' },
  { name: $localize`Ikke aktiv`, value: 'Inactive' },
];

export function mapMainContractStatus(mainContractId: number | null | undefined, isActive: boolean): MainContractStatus {
  if (mainContractId == null) return 'NoContract';
  return isActive ? 'Active' : 'Inactive';
}

export function applyMainContractStatusFilter(query: string): string {
  return query.replace(/ActiveAccordingToMainContract eq '(NoContract|Active|Inactive)'/g, (_, status: MainContractStatus) => {
    if (status === 'NoContract') return 'SourceEntity/MainContractId eq null';
    return `(SourceEntity/MainContractId ne null and ActiveAccordingToMainContract eq ${status === 'Active'})`;
  });
}
