import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { APIExtendedRoleAssignmentResponseDTO, APIV2ItSystemUsageInternalINTERNALService } from 'src/app/api/v2';
import { RoleOptionTypes } from '../models/options/role-option-types.model';

@Injectable({
  providedIn: 'root',
})
export class RoleOptionTypeService {
  constructor(private readonly systemUsageService: APIV2ItSystemUsageInternalINTERNALService) {}

  private resolveRoleOptionsEndpoints(
    optionType: RoleOptionTypes
  ): (entityUuid: string) => Observable<Array<APIExtendedRoleAssignmentResponseDTO>> {
    switch (optionType) {
      case 'it-system-usage':
        return (systemUsageUuid: string) =>
          this.systemUsageService.getManyItSystemUsageInternalV2GetAddRoleAssignments({ systemUsageUuid });
    }
  }

  /**
   * Returns options available within the provided type
   * @param entityUuid uuid of the entity
   * @param optionType type of regular option
   */
  public getAvailableOptions(
    entityUuid: string,
    optionType: RoleOptionTypes
  ): Observable<Array<APIExtendedRoleAssignmentResponseDTO>> {
    return this.resolveRoleOptionsEndpoints(optionType)(entityUuid);
  }
}
