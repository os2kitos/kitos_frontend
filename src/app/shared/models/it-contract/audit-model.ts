import { APIPaymentResponseDTO } from 'src/app/api/v2';

export interface AuditModel {
  name: string;
  id: APIPaymentResponseDTO.AuditStatusEnum;
}

export const baseAuditStatusValue = {
  name: $localize`Audit ikke gennemført`,
  id: APIPaymentResponseDTO.AuditStatusEnum.White,
};

export const auditStatusOptions: AuditModel[] = [
  baseAuditStatusValue,
  { name: $localize`Opfylder standarderne`, id: APIPaymentResponseDTO.AuditStatusEnum.Green },
  { name: $localize`Mindre forbedringer påkrævet`, id: APIPaymentResponseDTO.AuditStatusEnum.Yellow },
  { name: $localize`Væsentlige forbedringer nødvendige`, id: APIPaymentResponseDTO.AuditStatusEnum.Red },
];

export const mapAuditModel = (value?: APIPaymentResponseDTO.AuditStatusEnum): AuditModel | undefined => {
  return auditStatusOptions.find((option) => option.id === value);
};
