import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { APIRoleOptionResponseDTO, APIV2ItSystemUsageRoleTypeService } from 'src/app/api/v2';
import { RoleOptionTypes } from '../models/options/role-option-types.model';

@Injectable({
  providedIn: 'root',
})
export class RoleOptionTypeService {
  constructor(private readonly systemUsageRoleService: APIV2ItSystemUsageRoleTypeService) {}

  private resolveGetRoleOptionsEndpoints(
    optionType: RoleOptionTypes
  ): (organizationUuid: string) => Observable<Array<APIRoleOptionResponseDTO>> {
    switch (optionType) {
      case 'it-system-usage':
        return (organizationUuid: string) =>
          this.systemUsageRoleService.getManyItSystemUsageRoleTypeV2Get({ organizationUuid });
    }
  }

  /**
   * Returns options available within the provided type
   * @param organizationUuid uuid of the entity
   * @param optionType type of regular option
   */
  public getAvailableOptions(
    organizationUuid: string,
    optionType: RoleOptionTypes
  ): Observable<Array<APIRoleOptionResponseDTO>> {
    return this.resolveGetRoleOptionsEndpoints(optionType)(organizationUuid);
  }
}
