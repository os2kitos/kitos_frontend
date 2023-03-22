import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
  APIRegularOptionResponseDTO,
  APIV2ItContractContractTypeService,
  APIV2ItInterfaceInterfaceTypeService,
  APIV2ItSystemBusinessTypeService,
  APIV2ItSystemUsageDataClassificationTypeService,
} from 'src/app/api/v2';
import { RegularOptionTypes } from '../models/options/regular-option-types.model';

@Injectable({
  providedIn: 'root',
})
export class RegularOptionTypeServiceService {
  constructor(
    private readonly businessTypesService: APIV2ItSystemBusinessTypeService,
    private readonly contractTypesService: APIV2ItContractContractTypeService,
    private readonly interfaceTypesService: APIV2ItInterfaceInterfaceTypeService,
    private readonly dataClassificationTypesService: APIV2ItSystemUsageDataClassificationTypeService
  ) {}

  private resolveLocalOptionsEndpoint(
    optionType: RegularOptionTypes
  ): (requestParameters: { organizationUuid: string }) => Observable<Array<APIRegularOptionResponseDTO>> {
    switch (optionType) {
      case 'it-system_business-type':
        return this.businessTypesService.getManyItSystemBusinessTypeV2GetBusinessTypes;
      case 'it-contract_contract-type':
        return this.contractTypesService.getManyItContractContractTypeV2Get;
      case 'it-interface_interface-type':
        return this.interfaceTypesService.getManyItInterfaceInterfaceTypeV2Get;
      case 'it-system_usage-data-classification-type':
        return this.dataClassificationTypesService.getManyItSystemUsageDataClassificationTypeV2Get;
    }
  }

  /**
   * Returns options available within the provided organization
   * @param organizationUuid uuid of the organization
   * @param optionType type of regular option
   * @returns
   */
  public getAvailableOptions(
    organizationUuid: string,
    optionType: RegularOptionTypes
  ): Observable<Array<APIRegularOptionResponseDTO>> {
    return this.resolveLocalOptionsEndpoint(optionType)({ organizationUuid: organizationUuid });
  }
}
