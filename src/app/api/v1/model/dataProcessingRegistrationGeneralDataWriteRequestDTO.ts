/**
 * OS2Kitos API - V1
 * <b><i>OBS: Dokumentation for V2 findes ved at skifte version på dokumentet til 2 øverst på siden</i></b><br/><br/><b>BEMÆRK: ADGANG TIL API V1 LUKKES. <a href=\'https://os2web.atlassian.net/wiki/spaces/KITOS/pages/657293331/API+Design+V1#Varsling-om-lukning\'>LÆS MERE HER</a>.</b><br/><br/>Denne dokumentation udstiller Kitos API\'et til brug for applikationsudvikling.<br/><br/>Den første udgave af API\'et (V1) blev udviklet til understøttelse af projektets brugerflade og vil med tiden blive erstattet af et selvstændigt API (V2) udviklet til brug for integration med udefrakommende systemer. Du vil i en periode kunne anvende både V1 og V2. Bemærk dog, at overflødiggjorte V1 endpoints vil blive udfaset efter en rum tid. KITOS sekretariatet vil i god tid forinden varsle udfasning af overflødige endpoints.<br/><br/>Særligt for V1 gælder der følgende:<br/>ObjectOwnerId, LastChanged og LastChangedByUserId bliver som udgangspunkt sat af systemet automatisk.<br/>Der er udelukkende adgang til læseoperationer i V1. Ved behov for adgang til funktionalitet, der ændrer i data, kontakt da venligst KITOS sekretariatet.<br/><br/>Generelt er anvendelsen beskrevet på projektets <a href=\'https://os2web.atlassian.net/wiki/spaces/KITOS/pages/658145384/S+dan+kommer+du+igang\'>Confluence side</a>.<br/><br/><b>BEMÆRK: ADGANG TIL API V1 LUKKES. <a href=\'https://os2web.atlassian.net/wiki/spaces/KITOS/pages/657293331/API+Design+V1#Varsling-om-lukning\'>LÆS MERE HER</a>.</b><br/><br/><b>KENDTE FEJL OG BEGRÆNSNINGER PÅ DENNE HJÆLPESIDE SAMT WORKAROUND</b><br/>Felter der består af lister af enum værdier vises ikke rigtigt i denne UI. Konkret vises de mulige valg ikke, men i stedet vises \'Array[string]\'. For et retvisende billede af dokumentationen anbefales derfor følgende workaround:<br/><br/>- JSON downloades via \'docs linket i toppen\'<br/>- Indholdet indsættes i anden editor f.eks. <a href=\'https://editor.swagger.io\' target=\'_blank\'>Swagger.io</a><br/><br/><b>BEMÆRK</b>: Funktionen \'Try it out\' virker p.t. ikke i den eksterne editor.
 *
 * The version of the OpenAPI document: 1
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */
import { APIDataProcessorRegistrationSubDataProcessorWriteRequestDTO } from './dataProcessorRegistrationSubDataProcessorWriteRequestDTO';


export interface APIDataProcessingRegistrationGeneralDataWriteRequestDTO { 
    /**
     * Optional data responsible selection  Constraints:      - If changed from existing value, the option must currently be available in the organization
     */
    dataResponsibleUuid?: string;
    /**
     * Additional remark related to the data responsible
     */
    dataResponsibleRemark?: string;
    /**
     * Determines if a data processing agreement has been concluded
     */
    isAgreementConcluded?: APIDataProcessingRegistrationGeneralDataWriteRequestDTO.IsAgreementConcludedEnum;
    /**
     * Remark related to whether or not an agreement has been concluded
     */
    isAgreementConcludedRemark?: string;
    /**
     * Describes the date when the data processing agreement was concluded  Constraints:      - IsAgreementConcluded equals \'yes\'
     */
    agreementConcludedAt?: string;
    /**
     * Optional basis for transfer selection  Constraints:      - If changed from existing value, the option must currently be available in the organization
     */
    basisForTransferUuid?: string;
    /**
     * Determines if the data processing includes transfer to insecure third countries
     */
    transferToInsecureThirdCountries?: APIDataProcessingRegistrationGeneralDataWriteRequestDTO.TransferToInsecureThirdCountriesEnum;
    /**
     * Which insecure third countries are subject to data transfer as part of the data processing  Constraints:      - TransferToInsecureThirdCountries equals \'yes\'      - Duplicates are not allowed      - If changed from existing value, the options must currently be available in the organization
     */
    insecureCountriesSubjectToDataTransferUuids?: Array<string>;
    /**
     * UUID\'s of the organization entities selected as data processors  Constraints:      - No duplicates
     */
    dataProcessorUuids?: Array<string>;
    /**
     * Determines if the data processing involves sub data processors
     */
    hasSubDataProcessors?: APIDataProcessingRegistrationGeneralDataWriteRequestDTO.HasSubDataProcessorsEnum;
    /**
     * Sub data processors  Constraints:      - HasSubDataProcesors equals \'yes\'      - No duplicates allowed
     */
    subDataProcessors?: Array<APIDataProcessorRegistrationSubDataProcessorWriteRequestDTO>;
    /**
     * Defines the master contract for this Data Processing Registration (many contracts can point to a DPR but only one can be the master contract)  Constraint: The contract provided MUST point to this Data Processing Registration for it to be selected as \"main contract\".
     */
    mainContractUuid?: string;
}
export namespace APIDataProcessingRegistrationGeneralDataWriteRequestDTO {
    export type IsAgreementConcludedEnum = 'No' | 'Yes' | 'Irrelevant' | 'Undecided';
    export const IsAgreementConcludedEnum = {
        No: 'No' as IsAgreementConcludedEnum,
        Yes: 'Yes' as IsAgreementConcludedEnum,
        Irrelevant: 'Irrelevant' as IsAgreementConcludedEnum,
        Undecided: 'Undecided' as IsAgreementConcludedEnum
    };
    export type TransferToInsecureThirdCountriesEnum = 'No' | 'Yes' | 'Undecided';
    export const TransferToInsecureThirdCountriesEnum = {
        No: 'No' as TransferToInsecureThirdCountriesEnum,
        Yes: 'Yes' as TransferToInsecureThirdCountriesEnum,
        Undecided: 'Undecided' as TransferToInsecureThirdCountriesEnum
    };
    export type HasSubDataProcessorsEnum = 'No' | 'Yes' | 'Undecided';
    export const HasSubDataProcessorsEnum = {
        No: 'No' as HasSubDataProcessorsEnum,
        Yes: 'Yes' as HasSubDataProcessorsEnum,
        Undecided: 'Undecided' as HasSubDataProcessorsEnum
    };
}


