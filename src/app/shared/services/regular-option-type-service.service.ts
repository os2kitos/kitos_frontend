import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
  APIRegularOptionResponseDTO,
  APIV2ItContractContractTypeService,
  APIV2ItInterfaceInterfaceTypeService,
  APIV2ItSystemBusinessTypeService,
  APIV2ItSystemUsageArchiveLocationTypeService,
  APIV2ItSystemUsageArchiveTestLocationTypeService,
  APIV2ItSystemUsageArchiveTypeService,
  APIV2ItSystemUsageDataClassificationTypeService,
  APIV2ItSystemUsageRelationFrequencyTypeService,
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
    private readonly dataClassificationTypesService: APIV2ItSystemUsageDataClassificationTypeService,
    private readonly relationFrequencyTypesService: APIV2ItSystemUsageRelationFrequencyTypeService,
    private readonly itSystemUsageArchiveTypesService: APIV2ItSystemUsageArchiveTypeService,
    private readonly itSystemUsageArchiveLocationTypesService: APIV2ItSystemUsageArchiveLocationTypeService,
    private readonly itSystemUsageArchiveLocationTestTypesService: APIV2ItSystemUsageArchiveTestLocationTypeService
  ) {}

  private resolveLocalOptionsEndpoint(
    optionType: RegularOptionTypes
  ): (organizationUuid: string) => Observable<Array<APIRegularOptionResponseDTO>> {
    switch (optionType) {
      case 'it-system_business-type':
        return (organizationUuid) =>
          this.businessTypesService.getManyItSystemBusinessTypeV2GetBusinessTypes({
            organizationUuid: organizationUuid,
          });
      case 'it-contract_contract-type':
        return (organizationUuid) =>
          this.contractTypesService.getManyItContractContractTypeV2Get({ organizationUuid: organizationUuid });
      case 'it-interface_interface-type':
        return (organizationUuid) =>
          this.interfaceTypesService.getManyItInterfaceInterfaceTypeV2Get({ organizationUuid: organizationUuid });
      case 'it-system_usage-data-classification-type':
        return (organizationUuid) =>
          this.dataClassificationTypesService.getManyItSystemUsageDataClassificationTypeV2Get({
            organizationUuid: organizationUuid,
          });
      case 'it-system_usage-relation-frequency-type':
        return (organizationUuid) =>
          this.relationFrequencyTypesService.getManyItSystemUsageRelationFrequencyTypeV2Get({ organizationUuid });
      case 'it-system_usage-archive-type':
        return (organizationUuid) =>
          this.itSystemUsageArchiveTypesService.getManyItSystemUsageArchiveTypeV2Get({
            organizationUuid: organizationUuid,
          });
      case 'it-system_usage-archive-location-type':
        return (organizationUuid) =>
          this.itSystemUsageArchiveLocationTypesService.getManyItSystemUsageArchiveLocationTypeV2Get({
            organizationUuid: organizationUuid,
          });
      case 'it-system_usage-archive-location-test-type':
        return (organizationUuid) =>
          this.itSystemUsageArchiveLocationTestTypesService.getManyItSystemUsageArchiveTestLocationTypeV2Get({
            organizationUuid: organizationUuid,
          });
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
    return this.resolveLocalOptionsEndpoint(optionType)(organizationUuid);
  }
}
