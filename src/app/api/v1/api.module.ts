import { NgModule, ModuleWithProviders, SkipSelf, Optional } from '@angular/core';
import { Configuration } from './configuration';
import { HttpClient } from '@angular/common/http';

import { AuthorizeService } from './api/authorize.service';
import { DataProcessingRegistrationService } from './api/dataProcessingRegistration.service';
import { DataProcessingRegistrationReadModelsService } from './api/dataProcessingRegistrationReadModels.service';
import { ExcelExportService } from './api/excelExport.service';
import { HealthCheckService } from './api/healthCheck.service';
import { ItContractOverviewReadModelsService } from './api/itContractOverviewReadModels.service';
import { ItSystemUsageOptionsService } from './api/itSystemUsageOptions.service';
import { ItSystemUsageOverviewReadModelsService } from './api/itSystemUsageOverviewReadModels.service';
import { LocalAdminExcelService } from './api/localAdminExcel.service';
import { MetadataService } from './api/metadata.service';
import { SSOService } from './api/sSO.service';
import { TokenAuthenticationService } from './api/tokenAuthentication.service';

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
