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
import { APIIdentityNamePairResponseDTO } from './identityNamePairResponseDTO';


export interface APIItInterfaceResponseDTO { 
    /**
     * UTC timestamp of latest modification
     */
    lastModified: string;
    lastModifiedBy: APIIdentityNamePairResponseDTO;
    /**
     * UUID for IT-Interface
     */
    uuid: string;
    exposedBySystem?: APIIdentityNamePairResponseDTO;
    /**
     * Name of IT-Interface
     */
    name: string;
    /**
     * Identifier for IT-Interface
     */
    interfaceId?: string;
    /**
     * Version signifier for IT-Interface
     */
    version?: string;
    /**
     * General description of the IT-Interface
     */
    description?: string;
    /**
     * Internal notes regarding the IT-System (usually written by Global Admin)
     */
    notes?: string;
    /**
     * Url reference for further information
     */
    urlReference?: string;
    /**
     * Active status
     */
    deactivated: boolean;
    /**
     * Date of creation. (on some legacy systems , this information is not available. If so, it will be null)
     */
    created: string;
    createdBy: APIIdentityNamePairResponseDTO;
}

