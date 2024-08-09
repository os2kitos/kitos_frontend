import { mapToYesNoEnum, YesNoOptions } from '../yes-no.model';

export interface ITContract {
  id: string;
  IsActive: boolean;
  ContractId: string;
  ParentContractName: string;
  //Should be implemented in the backend: ParentContractUuid: string;
  Name: string;
  Concluded: Date;
  ExpirationDate: Date;
  CriticalityName: string;
  ResponsibleOrgUnitName: string;
  SupplierName: string;
  ContractSigner: string;
  ContractTypeName: string;
  ContractTemplateName: string;
  PurchaseFormName: string;
  ProcurementStrategyName: string;
  ProcurementPlan: string;
  ProcurementInitiated: YesNoOptions | undefined;
  DataProcessingAgreements: { id: string; value: string }[];
  ItSystemUsages: { id: string; value: string }[];
  SourceEntityUuid: string;
  NumberOfAssociatedSystemRelations: number;
  ActiveReferenceTitle: string;
  ActiveReferenceUrl: string;
  lastChangedById: number;
  lastChangedAt: string;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const adaptITContract = (value: any): ITContract | undefined => {
  if (!value.SourceEntityUuid) return;

  const procurementPlan = `${value.ProcurementPlanQuarter} | ${value.ProcurementPlanYear}`;
  return {
    id: value.SourceEntityUuid,
    IsActive: value.IsActive,
    ContractId: value.ContractId,
    ParentContractName: value.ParentContractName,
    Name: value.Name,
    Concluded: value.Concluded,
    ExpirationDate: value.ExpirationDate,
    CriticalityName: value.CriticalityName,
    ResponsibleOrgUnitName: value.ResponsibleOrgUnitName,
    SupplierName: value.SupplierName,
    ContractSigner: value.ContractSigner,
    ContractTypeName: value.ContractTypeName,
    ContractTemplateName: value.ContractTemplateName,
    PurchaseFormName: value.PurchaseFormName,
    ProcurementStrategyName: value.ProcurementStrategyName,
    ProcurementPlan: procurementPlan,
    ProcurementInitiated: mapToYesNoEnum(value.ProcurementInitiated),
    DataProcessingAgreements: value.DataProcessingAgreements.map(
      (dpa: { uuid: string; DataProcessingRegistrationName: string }) => ({
        id: 'IMPLEMENT IN BACKEND',
        value: dpa.DataProcessingRegistrationName,
      })
    ),
    ItSystemUsages: value.ItSystemUsages.map((dpa: { uuid: string; ItSystemName: string }) => ({
      id: 'IMPLEMENT IN BACKEND',
      value: dpa.ItSystemName,
    })),
    SourceEntityUuid: value.SourceEntityUuid,
    NumberOfAssociatedSystemRelations: value.NumberOfAssociatedSystemRelations,
    ActiveReferenceTitle: value.ActiveReferenceTitle,
    ActiveReferenceUrl: value.ActiveReferenceUrl,
    lastChangedById: value.LastEditedByUserId,
    lastChangedAt: value.LastEditedAtDate,
  };
};
