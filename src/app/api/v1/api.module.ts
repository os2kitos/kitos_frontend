import { NgModule, ModuleWithProviders, SkipSelf, Optional } from '@angular/core';
import { Configuration } from './configuration';
import { HttpClient } from '@angular/common/http';

import { APIV1AuthorizeService } from './api/v1Authorize.service';
import { APIV1ContactpersonService } from './api/v1Contactperson.service';
import { APIV1DataProcessingRegistrationService } from './api/v1DataProcessingRegistration.service';
import { APIV1DataProtectionAdvisorService } from './api/v1DataProtectionAdvisor.service';
import { APIV1DataResponsibleService } from './api/v1DataResponsible.service';
import { APIV1DataRowService } from './api/v1DataRow.service';
import { APIV1EconomyStreamService } from './api/v1EconomyStream.service';
import { APIV1ExhibitService } from './api/v1Exhibit.service';
import { APIV1ItContractService } from './api/v1ItContract.service';
import { APIV1ItContractItSystemUsageService } from './api/v1ItContractItSystemUsage.service';
import { APIV1ItContractRightService } from './api/v1ItContractRight.service';
import { APIV1ItInterfaceService } from './api/v1ItInterface.service';
import { APIV1ItSystemService } from './api/v1ItSystem.service';
import { APIV1ItSystemUsageService } from './api/v1ItSystemUsage.service';
import { APIV1ItSystemUsageOrgUnitUsageService } from './api/v1ItSystemUsageOrgUnitUsage.service';
import { APIV1ItSystemUsageRightsService } from './api/v1ItSystemUsageRights.service';
import { APIV1ODATAArchivePeriodsService } from './api/v1ODATAArchivePeriods.service';
import { APIV1ODATAAttachedOptionsService } from './api/v1ODATAAttachedOptions.service';
import { APIV1ODATADataProcessingRegistrationRightsService } from './api/v1ODATADataProcessingRegistrationRights.service';
import { APIV1ODATAItContractAgreementElementTypesService } from './api/v1ODATAItContractAgreementElementTypes.service';
import { APIV1ODATAItContractItSystemUsagesService } from './api/v1ODATAItContractItSystemUsages.service';
import { APIV1ODATAItContractRightsService } from './api/v1ODATAItContractRights.service';
import { APIV1ODATAItContractsService } from './api/v1ODATAItContracts.service';
import { APIV1ODATAItInterfaceExhibitsService } from './api/v1ODATAItInterfaceExhibits.service';
import { APIV1ODATAItInterfacesService } from './api/v1ODATAItInterfaces.service';
import { APIV1ODATAItSystemRightsService } from './api/v1ODATAItSystemRights.service';
import { APIV1ODATAItSystemUsagesService } from './api/v1ODATAItSystemUsages.service';
import { APIV1ODATAItSystemsService } from './api/v1ODATAItSystems.service';
import { APIV1ODATALocalDataProcessingBasisForTransferOptionsService } from './api/v1ODATALocalDataProcessingBasisForTransferOptions.service';
import { APIV1ODATALocalDataProcessingCountryOptionsService } from './api/v1ODATALocalDataProcessingCountryOptions.service';
import { APIV1ODATALocalDataProcessingDataResponsibleOptionsService } from './api/v1ODATALocalDataProcessingDataResponsibleOptions.service';
import { APIV1ODATALocalDataProcessingOversightOptionsService } from './api/v1ODATALocalDataProcessingOversightOptions.service';
import { APIV1ODATALocalDataProcessingRegistrationRolesService } from './api/v1ODATALocalDataProcessingRegistrationRoles.service';
import { APIV1ODATALocalItSystemRolesService } from './api/v1ODATALocalItSystemRoles.service';
import { APIV1PasswordResetRequestService } from './api/v1PasswordResetRequest.service';
import { APIV1ReferenceService } from './api/v1Reference.service';
import { APIV1SystemRelationService } from './api/v1SystemRelation.service';
import { APIV1TaskRefService } from './api/v1TaskRef.service';
import { APIV1TextService } from './api/v1Text.service';
import { APIV1UserAdministrationPermissionsService } from './api/v1UserAdministrationPermissions.service';
import { APIV1UserDeletionService } from './api/v1UserDeletion.service';

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
