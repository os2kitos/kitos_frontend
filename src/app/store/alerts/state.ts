import { EntityState } from '@ngrx/entity';
import { APIAlertResponseDTO, APIAlertType } from 'src/app/api/v2';

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
  alertType?: AlertType;
  message?: string;
  created?: string;
}

export enum AlertType {
  Advis = 'Advis',
}

function mapAlertType(alertType: APIAlertType): AlertType {
  switch (alertType) {
    case APIAlertType.Advis:
      return AlertType.Advis;
    default:
      throw new Error(`Unknown alert type: ${alertType}`);
  }
}

export function adaptAlert(alert: APIAlertResponseDTO): Alert {
  return {
    uuid: alert.uuid,
    entityUuid: alert.entityUuid,
    name: alert.name ?? $localize`Ikke angivet`,
    alertType: alert.alertType ? mapAlertType(alert.alertType) : undefined,
    message: alert.message ?? undefined,
    created: alert.created ?? undefined,
  };
}
