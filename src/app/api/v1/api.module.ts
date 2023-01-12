import { NgModule, ModuleWithProviders, SkipSelf, Optional } from '@angular/core';
import { Configuration } from './configuration';
import { HttpClient } from '@angular/common/http';

import { APIV1AuthorizeService } from './api/aPIV1Authorize.service';
import { APIV1ContactpersonService } from './api/aPIV1Contactperson.service';
import { APIV1DataProcessingRegistrationService } from './api/aPIV1DataProcessingRegistration.service';
import { APIV1DataProtectionAdvisorService } from './api/aPIV1DataProtectionAdvisor.service';
import { APIV1DataResponsibleService } from './api/aPIV1DataResponsible.service';
import { APIV1DataRowService } from './api/aPIV1DataRow.service';
import { APIV1EconomyStreamService } from './api/aPIV1EconomyStream.service';
import { APIV1ExhibitService } from './api/aPIV1Exhibit.service';
import { APIV1ItContractService } from './api/aPIV1ItContract.service';
import { APIV1ItContractItSystemUsageService } from './api/aPIV1ItContractItSystemUsage.service';
import { APIV1ItContractRightService } from './api/aPIV1ItContractRight.service';
import { APIV1ItInterfaceService } from './api/aPIV1ItInterface.service';
import { APIV1ItSystemService } from './api/aPIV1ItSystem.service';
import { APIV1ItSystemUsageService } from './api/aPIV1ItSystemUsage.service';
import { APIV1ItSystemUsageOrgUnitUsageService } from './api/aPIV1ItSystemUsageOrgUnitUsage.service';
import { APIV1ItSystemUsageRightsService } from './api/aPIV1ItSystemUsageRights.service';
import { APIV1ODATAArchivePeriodsService } from './api/aPIV1ODATAArchivePeriods.service';
import { APIV1ODATAAttachedOptionsService } from './api/aPIV1ODATAAttachedOptions.service';
import { APIV1ODATADataProcessingRegistrationRightsService } from './api/aPIV1ODATADataProcessingRegistrationRights.service';
import { APIV1ODATAItContractAgreementElementTypesService } from './api/aPIV1ODATAItContractAgreementElementTypes.service';
import { APIV1ODATAItContractItSystemUsagesService } from './api/aPIV1ODATAItContractItSystemUsages.service';
import { APIV1ODATAItContractRightsService } from './api/aPIV1ODATAItContractRights.service';
import { APIV1ODATAItContractsService } from './api/aPIV1ODATAItContracts.service';
import { APIV1ODATAItInterfaceExhibitsService } from './api/aPIV1ODATAItInterfaceExhibits.service';
import { APIV1ODATAItInterfacesService } from './api/aPIV1ODATAItInterfaces.service';
import { APIV1ODATAItSystemRightsService } from './api/aPIV1ODATAItSystemRights.service';
import { APIV1ODATAItSystemUsagesService } from './api/aPIV1ODATAItSystemUsages.service';
import { APIV1ODATAItSystemsService } from './api/aPIV1ODATAItSystems.service';
import { APIV1ODATALocalDataProcessingBasisForTransferOptionsService } from './api/aPIV1ODATALocalDataProcessingBasisForTransferOptions.service';
import { APIV1ODATALocalDataProcessingCountryOptionsService } from './api/aPIV1ODATALocalDataProcessingCountryOptions.service';
import { APIV1ODATALocalDataProcessingDataResponsibleOptionsService } from './api/aPIV1ODATALocalDataProcessingDataResponsibleOptions.service';
import { APIV1ODATALocalDataProcessingOversightOptionsService } from './api/aPIV1ODATALocalDataProcessingOversightOptions.service';
import { APIV1ODATALocalDataProcessingRegistrationRolesService } from './api/aPIV1ODATALocalDataProcessingRegistrationRoles.service';
import { APIV1ODATALocalItSystemRolesService } from './api/aPIV1ODATALocalItSystemRoles.service';
import { APIV1PasswordResetRequestService } from './api/aPIV1PasswordResetRequest.service';
import { APIV1ReferenceService } from './api/aPIV1Reference.service';
import { APIV1SystemRelationService } from './api/aPIV1SystemRelation.service';
import { APIV1TaskRefService } from './api/aPIV1TaskRef.service';
import { APIV1TextService } from './api/aPIV1Text.service';
import { APIV1UserAdministrationPermissionsService } from './api/aPIV1UserAdministrationPermissions.service';
import { APIV1UserDeletionService } from './api/aPIV1UserDeletion.service';

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
