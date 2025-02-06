import { EntityState } from '@ngrx/entity';
import { APIAlertResponseDTO } from 'src/app/api/v2';

export interface AlertsState {
  alerts: { [key in RelatedEntityType]: EntityState<Alert> };
  cacheTimes: { [key in RelatedEntityType]: number | undefined };
}

export enum RelatedEntityType {
  ItSystemUsage = 'ItSystemUsage',
  ItContract = 'ItContract',
  DataProcessingRegistration = 'DataProcessingRegistration',
}

export interface Alert {
  uuid: string;
  entityUuid: string;
  name: string;
  alertType: APIAlertResponseDTO.AlertTypeEnum;
  message?: string;
  created?: string;
}

export function adaptAlert(alert: APIAlertResponseDTO): Alert {
  return {
    uuid: alert.uuid,
    entityUuid: alert.entityUuid,
    name: alert.name ?? $localize`Ikke angivet`,
    alertType: alert.alertType ?? 'Advis', //The only alert type atm (11/12/2024)
    message: alert.message,
    created: alert.created,
  };
}
