/**
 * OS2Kitos API - V2
 * <b><i>OBS: Dokumentation for V1 findes ved at skifte version på dokumentet til 1 øverst på siden</i></b><br/><br/>KITOS API V2 understøtter både læse- og skriveoperationer for de væsentlige registreringsobjekter i KITOS. <br/><br/>Se mere om designet og konventionerne i API\'et her: <a href=\'https://os2web.atlassian.net/wiki/spaces/KITOS/pages/2059599873/API+Design+V2\'>API V2</a>.<br/><br/>Generelt er anvendelsen af KITOS API(er) beskrevet på projektets <a href=\'https://os2web.atlassian.net/wiki/spaces/KITOS/pages/658145384/S+dan+kommer+du+igang\'>Confluence side</a>.<br/><br/><b>KENDTE FEJL OG BEGRÆNSNINGER PÅ DENNE HJÆLPESIDE SAMT WORKAROUND</b><br/>Felter der består af lister af enum værdier vises ikke rigtigt i denne UI. Konkret vises de mulige valg ikke, men i stedet vises \'Array[string]\'. For et retvisende billede af dokumentationen anbefales derfor følgende workaround:<br/><br/>- JSON downloades via \'docs linket i toppen\'<br/>- Indholdet indsættes i anden editor f.eks. <a href=\'https://editor.swagger.io\' target=\'_blank\'>Swagger.io</a><br/><br/><b>BEMÆRK</b>: Funktionen \'Try it out\' virker p.t. ikke i den eksterne editor.
 *
 * The version of the OpenAPI document: 2
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */


export interface ContractAgreementPeriodDataWriteRequestDTO { 
    /**
     * If the agreement has a fixed duration, optionally define the years + months for which it is valid  Constraints:      - If DurationMonths/Years are defined then IsContinuous must be null or false
     */
    durationYears?: number;
    /**
     * If the agreement has a fixed duration, optionally define the years + months for which it is valid  Constraints:      - If DurationMonths/Years are defined then IsContinuous must be null or false
     */
    durationMonths?: number;
    /**
     * Determines if the agreement has no fixed duration  Constraints:      - If set to true, the DurationMonths/Years must be null
     */
    isContinuous?: boolean;
    /**
     * Optional agreement extension option  Constraints:      - If changed from current state, the option type must be available in the organization
     */
    extensionOptionsUuid?: string;
    /**
     * Determines how many of the agreement available extension options that have been used
     */
    extensionOptionsUsed?: number;
    /**
     * The agreement cannot be revoked before this date
     */
    irrevocableUntil?: string;
}

