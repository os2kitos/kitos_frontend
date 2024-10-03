/**
 * OS2Kitos API - V2
 * <b><i>OBS: Dokumentation for V1 (authorize endpoint) findes ved at skifte version på dokumentet til 1 øverst på siden</i></b><br/><br/>KITOS API V2 understøtter både læse- og skriveoperationer for de væsentlige registreringsobjekter i KITOS. <br/><br/>Se mere om designet og konventionerne i API\'et her: <a href=\'https://os2web.atlassian.net/wiki/spaces/KITOS/pages/2059599873/API+Design+V2\'>API V2</a>.<br/><br/>Generelt er anvendelsen af KITOS API(er) beskrevet på projektets <a href=\'https://os2web.atlassian.net/wiki/spaces/KITOS/pages/658145384/S+dan+kommer+du+igang\'>Confluence side</a>.<br/><br/><b>KENDTE FEJL OG BEGRÆNSNINGER PÅ DENNE HJÆLPESIDE SAMT WORKAROUND</b><br/>Felter der består af lister af enum værdier vises ikke rigtigt i denne UI. Konkret vises de mulige valg ikke, men i stedet vises \'Array[string]\'. For et retvisende billede af dokumentationen anbefales derfor følgende workaround:<br/><br/>- JSON downloades via \'docs linket i toppen\'<br/>- Indholdet indsættes i anden editor f.eks. <a href=\'https://editor.swagger.io\' target=\'_blank\'>Swagger.io</a><br/><br/><b>BEMÆRK</b>: Funktionen \'Try it out\' virker p.t. ikke i den eksterne editor.
 *
 * The version of the OpenAPI document: 2
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */


export interface APIUpdateUserRequestDTO { 
    email?: string;
    firstName?: string;
    lastName?: string;
    phoneNumber?: string;
    defaultUserStartPreference?: APIUpdateUserRequestDTO.DefaultUserStartPreferenceEnum;
    hasApiAccess?: boolean;
    hasStakeHolderAccess?: boolean;
    roles?: Array<APIUpdateUserRequestDTO.RolesEnum>;
    sendMail?: boolean;
}
export namespace APIUpdateUserRequestDTO {
    export type DefaultUserStartPreferenceEnum = 'StartSite' | 'Organization' | 'ItSystemUsage' | 'ItSystemCatalog' | 'ItContract' | 'DataProcessing';
    export const DefaultUserStartPreferenceEnum = {
        StartSite: 'StartSite' as DefaultUserStartPreferenceEnum,
        Organization: 'Organization' as DefaultUserStartPreferenceEnum,
        ItSystemUsage: 'ItSystemUsage' as DefaultUserStartPreferenceEnum,
        ItSystemCatalog: 'ItSystemCatalog' as DefaultUserStartPreferenceEnum,
        ItContract: 'ItContract' as DefaultUserStartPreferenceEnum,
        DataProcessing: 'DataProcessing' as DefaultUserStartPreferenceEnum
    };
    export type RolesEnum = 'User' | 'LocalAdmin' | 'OrganizationModuleAdmin' | 'SystemModuleAdmin' | 'ContractModuleAdmin' | 'GlobalAdmin' | 'RightsHolderAccess';
    export const RolesEnum = {
        User: 'User' as RolesEnum,
        LocalAdmin: 'LocalAdmin' as RolesEnum,
        OrganizationModuleAdmin: 'OrganizationModuleAdmin' as RolesEnum,
        SystemModuleAdmin: 'SystemModuleAdmin' as RolesEnum,
        ContractModuleAdmin: 'ContractModuleAdmin' as RolesEnum,
        GlobalAdmin: 'GlobalAdmin' as RolesEnum,
        RightsHolderAccess: 'RightsHolderAccess' as RolesEnum
    };
}


