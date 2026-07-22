import { APIPaymentAuditStatus } from 'src/app/api/v2';

export interface OverviewAuditModel {
  total: number;
  green: number;
  red: number;
  yellow: number;
  white: number;
}

export interface AuditModel {
  name: string;
  id: APIPaymentAuditStatus;
}

export const baseAuditStatusValue = {
  name: $localize`Audit ikke gennemført`,
  id: APIPaymentAuditStatus.White,
};

export const auditStatusOptions: AuditModel[] = [
  baseAuditStatusValue,
  { name: $localize`Opfylder standarderne`, id: APIPaymentAuditStatus.Green },
  { name: $localize`Mindre forbedringer påkrævet`, id: APIPaymentAuditStatus.Yellow },
  { name: $localize`Væsentlige forbedringer nødvendige`, id: APIPaymentAuditStatus.Red },
];

export const mapAuditModel = (value?: APIPaymentAuditStatus): AuditModel | undefined => {
  return auditStatusOptions.find((option) => option.id === value);
};
