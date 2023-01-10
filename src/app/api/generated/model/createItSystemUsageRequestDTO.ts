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
import { GDPRWriteRequestDTO } from './gDPRWriteRequestDTO';
import { OrganizationUsageWriteRequestDTO } from './organizationUsageWriteRequestDTO';
import { RoleAssignmentRequestDTO } from './roleAssignmentRequestDTO';
import { ArchivingWriteRequestDTO } from './archivingWriteRequestDTO';
import { LocalKLEDeviationsRequestDTO } from './localKLEDeviationsRequestDTO';
import { ExternalReferenceDataDTO } from './externalReferenceDataDTO';
import { GeneralDataWriteRequestDTO } from './generalDataWriteRequestDTO';


export interface CreateItSystemUsageRequestDTO { 
    /**
     * Points to the main system which the usage will extend.  Constraints:      - must be accessible to the authorized user      - must not already be in use in the organization      - system must be active iow. not in a disabled state
     */
    systemUuid: string;
    organizationUuid: string;
    general?: GeneralDataWriteRequestDTO;
    /**
     * A collection of IT-System usage role option assignments  Constraint: Duplicates are not allowed
     */
    roles?: Array<RoleAssignmentRequestDTO>;
    organizationUsage?: OrganizationUsageWriteRequestDTO;
    localKleDeviations?: LocalKLEDeviationsRequestDTO;
    archiving?: ArchivingWriteRequestDTO;
    gdpr?: GDPRWriteRequestDTO;
    /**
     * User defined external references.  The external reference marked as \"master reference\" will be shown in overviews and on the system front page in KITOS  Constraint:      - If the list is not empty one (and only one) must be marked as the master reference.
     */
    externalReferences?: Array<ExternalReferenceDataDTO>;
}

