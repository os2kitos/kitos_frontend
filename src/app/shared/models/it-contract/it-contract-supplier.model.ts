import { ITContractSupplierType, mapITContractSupplierType } from './it-contract-supplier-type';

export interface ITContractSupplier {
  id: number;
  OrganizationId: number;
  OrganizationUuid: string;
  OrganizationName: string;
  SupplierId: number;
  SupplierType: ITContractSupplierType | undefined;
  SupplierUuid: string;
  SupplierName: string;
  SupplierCvr: string;
  IsSupplierDisabled: boolean;
  HighestCriticalityUuid: string | null;
  HighestCriticalityName: string | null;
  HighestCriticalityRank: number | null;
  ContractsAtHighestCriticalityCsv: string | null;
  ContractsAtHighestCriticality: { id: string; value: string }[];
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const adaptITContractSupplier = (value: any): ITContractSupplier | undefined => {
  if (!value.SupplierUuid) return;

  return {
    id: value.Id,
    OrganizationId: value.OrganizationId,
    OrganizationUuid: value.Organization.Uuid,
    OrganizationName: value.Organization.Name,
    SupplierId: value.SupplierId,
    SupplierType: mapITContractSupplierType(value.SupplierType),
    SupplierUuid: value.SupplierUuid,
    SupplierName: value.SupplierName,
    SupplierCvr: value.SupplierCvr,
    IsSupplierDisabled: value.IsSupplierDisabled,
    HighestCriticalityUuid: value.HighestCriticalityUuid,
    HighestCriticalityName: value.HighestCriticalityName,
    HighestCriticalityRank: value.HighestCriticalityRank,
    ContractsAtHighestCriticalityCsv: value.ContractsAtHighestCriticalityCsv,
    ContractsAtHighestCriticality: (value.ContractsAtHighestCriticality || []).map(
      (relation: { ContractUuid: string; ContractName: string }) => ({
        id: relation.ContractUuid,
        value: relation.ContractName,
      }),
    ),
  };
};
