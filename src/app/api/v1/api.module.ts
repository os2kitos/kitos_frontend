import { NgModule, ModuleWithProviders, SkipSelf, Optional } from '@angular/core';
import { Configuration } from './configuration';
import { HttpClient } from '@angular/common/http';

import { APIV1AuthorizeINTERNALService } from './api/v1AuthorizeINTERNAL.service';
import { APIV1DataProcessingRegistrationINTERNALService } from './api/v1DataProcessingRegistrationINTERNAL.service';
import { APIV1DprLocalRoleOptionTypesInternalV2INTERNALService } from './api/v1DprLocalRoleOptionTypesInternalV2INTERNAL.service';
import { APIV1ExcelINTERNALService } from './api/v1ExcelINTERNAL.service';
import { APIV1ItContractLocalRoleOptionTypesInternalV2INTERNALService } from './api/v1ItContractLocalRoleOptionTypesInternalV2INTERNAL.service';
import { APIV1ItSystemLocalRoleOptionTypesInternalV2INTERNALService } from './api/v1ItSystemLocalRoleOptionTypesInternalV2INTERNAL.service';
import { APIV1ItSystemUsageOptionsINTERNALService } from './api/v1ItSystemUsageOptionsINTERNAL.service';
import { APIV1ODATADataProcessingRegistrationReadModelsINTERNALService } from './api/v1ODATADataProcessingRegistrationReadModelsINTERNAL.service';
import { APIV1ODATAItContractOverviewReadModelsINTERNALService } from './api/v1ODATAItContractOverviewReadModelsINTERNAL.service';
import { APIV1ODATAItContractsINTERNALService } from './api/v1ODATAItContractsINTERNAL.service';
import { APIV1ODATAItInterfacesINTERNALService } from './api/v1ODATAItInterfacesINTERNAL.service';
import { APIV1ODATAItSystemRightsINTERNALService } from './api/v1ODATAItSystemRightsINTERNAL.service';
import { APIV1ODATAItSystemUsageOverviewReadModelsINTERNALService } from './api/v1ODATAItSystemUsageOverviewReadModelsINTERNAL.service';
import { APIV1ODATAItSystemUsagesINTERNALService } from './api/v1ODATAItSystemUsagesINTERNAL.service';
import { APIV1ODATAItSystemsINTERNALService } from './api/v1ODATAItSystemsINTERNAL.service';
import { APIV1ODATAOrganizationRightsINTERNALService } from './api/v1ODATAOrganizationRightsINTERNAL.service';
import { APIV1ODATAOrganizationUnitsINTERNALService } from './api/v1ODATAOrganizationUnitsINTERNAL.service';
import { APIV1ODATAOrganizationsINTERNALService } from './api/v1ODATAOrganizationsINTERNAL.service';
import { APIV1ODATASSOINTERNALService } from './api/v1ODATASSOINTERNAL.service';
import { APIV1ODATAUsersINTERNALService } from './api/v1ODATAUsersINTERNAL.service';
import { APIV1OrganizationUnitLocalRoleOptionTypesInternalV2INTERNALService } from './api/v1OrganizationUnitLocalRoleOptionTypesInternalV2INTERNAL.service';
import { APIV1TokenAuthenticationService } from './api/v1TokenAuthentication.service';

@NgModule({
  imports:      [],
  declarations: [],
  exports:      [],
  providers: []
})
export class ApiModule {
    public static forRoot(configurationFactory: () => Configuration): ModuleWithProviders<ApiModule> {
        return {
            ngModule: ApiModule,
            providers: [ { provide: Configuration, useFactory: configurationFactory } ]
        };
    }

    constructor( @Optional() @SkipSelf() parentModule: ApiModule,
                 @Optional() http: HttpClient) {
        if (parentModule) {
            throw new Error('ApiModule is already loaded. Import in your base AppModule only.');
        }
        if (!http) {
            throw new Error('You need to import the HttpClientModule in your AppModule! \n' +
            'See also https://github.com/angular/angular/issues/20575');
        }
    }
}
