/**
 * OS2Kitos API - V1
 * <b><i>OBS: Dokumentation for V2 findes ved at skifte version på dokumentet til 2 øverst på siden</i></b><br/><br/><b>BEMÆRK: Ekstern Adgang TIL størstedelen af API V1 LUKKES. <a href=\'https://os2web.atlassian.net/wiki/spaces/KITOS/pages/657293331/API+Design+V1#Varsling-om-lukning\'>LÆS MERE HER</a>.</b><br/><br/><b>BEMÆRK: Lukningen påvirker ikke authorize endpointet</b><br/><br/>
 *
 * The version of the OpenAPI document: 1
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */
import { APINamedEntityDTO } from './namedEntityDTO';
import { APIItSystemUsageSensitiveDataLevelDTO } from './itSystemUsageSensitiveDataLevelDTO';
import { APIRightOutputDTO } from './rightOutputDTO';
import { APIExternalReferenceDTO } from './externalReferenceDTO';
import { APIOrganizationDTO } from './organizationDTO';
import { APIItContractSystemDTO } from './itContractSystemDTO';
import { APIItSystemDTO } from './itSystemDTO';
import { APITaskRefDTO } from './taskRefDTO';


export interface APIItSystemUsageDTO { 
    reference?: APIExternalReferenceDTO;
    uuid?: string;
    id?: number;
    lastChanged?: string;
    lastChangedByUserName?: string;
    lastChangedByUserLastName?: string;
    note?: string;
    localSystemId?: string;
    version?: string;
    localCallName?: string;
    sensitiveDataTypeId?: number;
    sensitiveDataTypeName?: string;
    archiveTypeId?: number;
    archiveTypeName?: string;
    archiveLocationId?: number;
    archiveLocationName?: string;
    archiveTestLocationId?: number;
    archiveTestLocationName?: string;
    archiveSupplierId?: number;
    archiveSupplierName?: string;
    responsibleOrgUnitName?: string;
    organizationId?: number;
    organization?: APIOrganizationDTO;
    mainContractIsActive?: boolean;
    itSystemId?: number;
    itSystem?: APIItSystemDTO;
    itSystemParentName?: string;
    overviewId?: number;
    overviewItSystemName?: string;
    rights?: Array<APIRightOutputDTO>;
    taskRefs?: Array<APITaskRefDTO>;
    interfaceExhibitCount?: number;
    interfaceUseCount?: number;
    activeInterfaceUseCount?: number;
    mainContractId?: number;
    contracts?: Array<APIItContractSystemDTO>;
    objectOwnerName?: string;
    objectOwnerLastName?: string;
    readonly objectOwnerFullName?: string;
    externalReferences?: Array<APIExternalReferenceDTO>;
    referenceId?: number;
    activeAccordingToValidityPeriod?: boolean;
    lifeCycleStatus?: APIItSystemUsageDTO.LifeCycleStatusEnum;
    concluded?: string;
    expirationDate?: string;
    itSystemCategoriesId?: number;
    userCount?: APIItSystemUsageDTO.UserCountEnum;
    archiveDuty?: APIItSystemUsageDTO.ArchiveDutyEnum;
    archiveNotes?: string;
    archiveFreq?: number;
    registertype?: boolean;
    archiveFromSystem?: boolean;
    generalPurpose?: string;
    isBusinessCritical?: APIItSystemUsageDTO.IsBusinessCriticalEnum;
    linkToDirectoryUrlName?: string;
    linkToDirectoryUrl?: string;
    personalData?: Array<APIItSystemUsageDTO.PersonalDataEnum>;
    sensitiveDataLevels?: Array<APIItSystemUsageSensitiveDataLevelDTO>;
    precautions?: APIItSystemUsageDTO.PrecautionsEnum;
    precautionsOptionsEncryption?: boolean;
    precautionsOptionsPseudonomisering?: boolean;
    precautionsOptionsAccessControl?: boolean;
    precautionsOptionsLogning?: boolean;
    technicalSupervisionDocumentationUrlName?: string;
    technicalSupervisionDocumentationUrl?: string;
    userSupervision?: APIItSystemUsageDTO.UserSupervisionEnum;
    userSupervisionDate?: string;
    userSupervisionDocumentationUrlName?: string;
    userSupervisionDocumentationUrl?: string;
    riskAssessment?: APIItSystemUsageDTO.RiskAssessmentEnum;
    riskAssesmentDate?: string;
    preRiskAssessment?: APIItSystemUsageDTO.PreRiskAssessmentEnum;
    plannedRiskAssessmentDate?: string;
    riskSupervisionDocumentationUrlName?: string;
    riskSupervisionDocumentationUrl?: string;
    noteRisks?: string;
    dpia?: APIItSystemUsageDTO.DpiaEnum;
    dpiaDateFor?: string;
    dpiaSupervisionDocumentationUrlName?: string;
    dpiaSupervisionDocumentationUrl?: string;
    answeringDataDPIA?: APIItSystemUsageDTO.AnsweringDataDPIAEnum;
    dpiaDeleteDate?: string;
    numberDPIA?: number;
    hostedAt?: APIItSystemUsageDTO.HostedAtEnum;
    associatedDataProcessingRegistrations?: Array<APINamedEntityDTO>;
}
export namespace APIItSystemUsageDTO {
    export type LifeCycleStatusEnum = 'Undecided' | 'NotInUse' | 'PhasingIn' | 'Operational' | 'PhasingOut';
    export const LifeCycleStatusEnum = {
        Undecided: 'Undecided' as LifeCycleStatusEnum,
        NotInUse: 'NotInUse' as LifeCycleStatusEnum,
        PhasingIn: 'PhasingIn' as LifeCycleStatusEnum,
        Operational: 'Operational' as LifeCycleStatusEnum,
        PhasingOut: 'PhasingOut' as LifeCycleStatusEnum
    };
    export type UserCountEnum = 'BELOWTEN' | 'TENTOFIFTY' | 'FIFTYTOHUNDRED' | 'HUNDREDPLUS' | 'UNDECIDED';
    export const UserCountEnum = {
        Belowten: 'BELOWTEN' as UserCountEnum,
        Tentofifty: 'TENTOFIFTY' as UserCountEnum,
        Fiftytohundred: 'FIFTYTOHUNDRED' as UserCountEnum,
        Hundredplus: 'HUNDREDPLUS' as UserCountEnum,
        Undecided: 'UNDECIDED' as UserCountEnum
    };
    export type ArchiveDutyEnum = 'Undecided' | 'B' | 'K' | 'Unknown';
    export const ArchiveDutyEnum = {
        Undecided: 'Undecided' as ArchiveDutyEnum,
        B: 'B' as ArchiveDutyEnum,
        K: 'K' as ArchiveDutyEnum,
        Unknown: 'Unknown' as ArchiveDutyEnum
    };
    export type IsBusinessCriticalEnum = 'NO' | 'YES' | 'DONTKNOW' | 'UNDECIDED';
    export const IsBusinessCriticalEnum = {
        No: 'NO' as IsBusinessCriticalEnum,
        Yes: 'YES' as IsBusinessCriticalEnum,
        Dontknow: 'DONTKNOW' as IsBusinessCriticalEnum,
        Undecided: 'UNDECIDED' as IsBusinessCriticalEnum
    };
    export type PersonalDataEnum = 'CprNumber' | 'SocialProblems' | 'OtherPrivateMatters';
    export const PersonalDataEnum = {
        CprNumber: 'CprNumber' as PersonalDataEnum,
        SocialProblems: 'SocialProblems' as PersonalDataEnum,
        OtherPrivateMatters: 'OtherPrivateMatters' as PersonalDataEnum
    };
    export type PrecautionsEnum = 'NO' | 'YES' | 'DONTKNOW' | 'UNDECIDED';
    export const PrecautionsEnum = {
        No: 'NO' as PrecautionsEnum,
        Yes: 'YES' as PrecautionsEnum,
        Dontknow: 'DONTKNOW' as PrecautionsEnum,
        Undecided: 'UNDECIDED' as PrecautionsEnum
    };
    export type UserSupervisionEnum = 'NO' | 'YES' | 'DONTKNOW' | 'UNDECIDED';
    export const UserSupervisionEnum = {
        No: 'NO' as UserSupervisionEnum,
        Yes: 'YES' as UserSupervisionEnum,
        Dontknow: 'DONTKNOW' as UserSupervisionEnum,
        Undecided: 'UNDECIDED' as UserSupervisionEnum
    };
    export type RiskAssessmentEnum = 'NO' | 'YES' | 'DONTKNOW' | 'UNDECIDED';
    export const RiskAssessmentEnum = {
        No: 'NO' as RiskAssessmentEnum,
        Yes: 'YES' as RiskAssessmentEnum,
        Dontknow: 'DONTKNOW' as RiskAssessmentEnum,
        Undecided: 'UNDECIDED' as RiskAssessmentEnum
    };
    export type PreRiskAssessmentEnum = 'LOW' | 'MIDDLE' | 'HIGH' | 'UNDECIDED';
    export const PreRiskAssessmentEnum = {
        Low: 'LOW' as PreRiskAssessmentEnum,
        Middle: 'MIDDLE' as PreRiskAssessmentEnum,
        High: 'HIGH' as PreRiskAssessmentEnum,
        Undecided: 'UNDECIDED' as PreRiskAssessmentEnum
    };
    export type DpiaEnum = 'NO' | 'YES' | 'DONTKNOW' | 'UNDECIDED';
    export const DpiaEnum = {
        No: 'NO' as DpiaEnum,
        Yes: 'YES' as DpiaEnum,
        Dontknow: 'DONTKNOW' as DpiaEnum,
        Undecided: 'UNDECIDED' as DpiaEnum
    };
    export type AnsweringDataDPIAEnum = 'NO' | 'YES' | 'DONTKNOW' | 'UNDECIDED';
    export const AnsweringDataDPIAEnum = {
        No: 'NO' as AnsweringDataDPIAEnum,
        Yes: 'YES' as AnsweringDataDPIAEnum,
        Dontknow: 'DONTKNOW' as AnsweringDataDPIAEnum,
        Undecided: 'UNDECIDED' as AnsweringDataDPIAEnum
    };
    export type HostedAtEnum = 'UNDECIDED' | 'ONPREMISE' | 'EXTERNAL';
    export const HostedAtEnum = {
        Undecided: 'UNDECIDED' as HostedAtEnum,
        Onpremise: 'ONPREMISE' as HostedAtEnum,
        External: 'EXTERNAL' as HostedAtEnum
    };
}


