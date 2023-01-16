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
import { HttpHeaders }                                       from '@angular/common/http';

import { Observable }                                        from 'rxjs';

import { APICreateItSystemUsageRequestDTO } from '../model/models';
import { APIItSystemUsageResponseDTO } from '../model/models';
import { APISystemRelationResponseDTO } from '../model/models';
import { APISystemRelationWriteRequestDTO } from '../model/models';
import { APIUpdateItSystemUsageRequestDTO } from '../model/models';


import { Configuration }                                     from '../configuration';



export interface APIV2ItSystemUsageServiceInterface {
    defaultHeaders: HttpHeaders;
    configuration: Configuration;

    /**
     * Deletes a system usage.  NOTE: this action also clears any incoming relation e.g. relations from other system usages, contracts or data processing registrations.
     * 
     * @param systemUsageUuid 
     */
    dELETEItSystemUsageV2DeleteItSystemUsageGuidSystemUsageUuid(systemUsageUuid: string, extraHttpRequestParams?: any): Observable<object>;

    /**
     * Deletes a system relation
     * 
     * @param systemUsageUuid 
     * @param systemRelationUuid 
     */
    dELETEItSystemUsageV2DeleteSystemUsageRelationGuidSystemUsageUuidGuidSystemRelationUuid(systemUsageUuid: string, systemRelationUuid: string, extraHttpRequestParams?: any): Observable<object>;

    /**
     * Returns a specific IT-System usage (a specific IT-System in a specific Organization)
     * 
     * @param systemUsageUuid UUID of the system usage entity
     */
    gETItSystemUsageV2GetItSystemUsageGuidSystemUsageUuid(systemUsageUuid: string, extraHttpRequestParams?: any): Observable<APIItSystemUsageResponseDTO>;

    /**
     * Returns all IT-System usages available to the current user
     * 
     * @param organizationUuid Query usages within a specific organization
     * @param relatedToSystemUuid Query by systems with outgoing relations related to another system
     * @param relatedToSystemUsageUuid Query by system usages with outgoing relations to a specific system usage (more narrow search than using system id)
     * @param relatedToContractUuid Query by contracts which are part of a system relation
     * @param systemUuid Query usages of a specific system
     * @param systemNameContent 
     * @param changedSinceGtEq Include only changes which were LastModified (UTC) is equal to or greater than the provided value
     * @param page 0-based page number. Use this parameter to page through the requested collection.  Offset in the source collection will be (pageSize * page)  Range: [0,2^31] Default: 0
     * @param pageSize Size of the page referred by \&#39;page\&#39;.  Range: [1,100] Default: 100.
     */
    gETItSystemUsageV2GetItSystemUsagesNullable1OrganizationUuidNullable1RelatedToSystemUuidNullable1RelatedToSystemUsageUuidNullable1RelatedToContractUuidNullable1SystemUuidStringSystemNameContentNullable1ChangedSinceGtEqBoundedPaginationQueryPaginationQuery(organizationUuid?: string, relatedToSystemUuid?: string, relatedToSystemUsageUuid?: string, relatedToContractUuid?: string, systemUuid?: string, systemNameContent?: string, changedSinceGtEq?: string, page?: number, pageSize?: number, extraHttpRequestParams?: any): Observable<Array<APIItSystemUsageResponseDTO>>;

    /**
     * Gets a specific relation
     * 
     * @param systemUsageUuid 
     * @param systemRelationUuid 
     */
    gETItSystemUsageV2GetSystemUsageRelationGuidSystemUsageUuidGuidSystemRelationUuid(systemUsageUuid: string, systemRelationUuid: string, extraHttpRequestParams?: any): Observable<APISystemRelationResponseDTO>;

    /**
     * Allows partial updates of an existing system usage  NOTE:At the root level, defined sections will be mapped as changes e.g. {General: null} will reset the entire \&quot;General\&quot; section.  If the section is not provided in the json, the omitted section will remain unchanged.  At the moment we only manage PATCH at the root level so all levels below that must be provided in it\&#39;s entirety.
     * 
     * @param systemUsageUuid 
     * @param request 
     */
    pATCHItSystemUsageV2PatchSystemUsageGuidSystemUsageUuidUpdateItSystemUsageRequestDTORequest(systemUsageUuid: string, request: APIUpdateItSystemUsageRequestDTO, extraHttpRequestParams?: any): Observable<APIItSystemUsageResponseDTO>;

    /**
     * Creates an IT-System usage
     * 
     * @param request 
     */
    pOSTItSystemUsageV2PostItSystemUsageCreateItSystemUsageRequestDTORequest(request: APICreateItSystemUsageRequestDTO, extraHttpRequestParams?: any): Observable<object>;

    /**
     * Creates a system relation
     * 
     * @param systemUsageUuid 
     * @param request 
     */
    pOSTItSystemUsageV2PostSystemUsageRelationGuidSystemUsageUuidSystemRelationWriteRequestDTORequest(systemUsageUuid: string, request: APISystemRelationWriteRequestDTO, extraHttpRequestParams?: any): Observable<object>;

    /**
     * Perform a full update of an existing system usage.  Note: PUT expects a full version of the system usage. For partial updates, please use PATCH.
     * 
     * @param systemUsageUuid 
     * @param request 
     */
    pUTItSystemUsageV2PutSystemUsageGuidSystemUsageUuidUpdateItSystemUsageRequestDTORequest(systemUsageUuid: string, request: APIUpdateItSystemUsageRequestDTO, extraHttpRequestParams?: any): Observable<APIItSystemUsageResponseDTO>;

    /**
     * Updates the system relation
     * 
     * @param systemUsageUuid 
     * @param systemRelationUuid 
     * @param request 
     */
    pUTItSystemUsageV2PutSystemUsageRelationGuidSystemUsageUuidGuidSystemRelationUuidSystemRelationWriteRequestDTORequest(systemUsageUuid: string, systemRelationUuid: string, request: APISystemRelationWriteRequestDTO, extraHttpRequestParams?: any): Observable<APISystemRelationResponseDTO>;

}
