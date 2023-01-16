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

import { APIIdentityNamePairResponseDTO } from '../model/models';
import { APIRegularOptionExtendedResponseDTO } from '../model/models';


import { Configuration }                                     from '../configuration';



export interface APIV2ItContractPaymentModelTypeServiceInterface {
    defaultHeaders: HttpHeaders;
    configuration: Configuration;

    /**
     * Returns It-Contract payment model type options
     * 
     * @param organizationUuid organization context for the payment model types availability
     * @param page 0-based page number. Use this parameter to page through the requested collection.  Offset in the source collection will be (pageSize * page)  Range: [0,2^31] Default: 0  NOTE: This parameter has no effect if \&#39;pageSize\&#39; is left unspecified
     * @param pageSize Size of the page referred by \&#39;page\&#39;.  Range: [1,2^31] Default: null.  If left unspecified, the entire result set will be returned.
     */
    gETItContractPaymentModelTypeV2GetGuidOrganizationUuidUnboundedPaginationQueryPagination(organizationUuid: string, page?: number, pageSize?: number, extraHttpRequestParams?: any): Observable<Array<APIIdentityNamePairResponseDTO>>;

    /**
     * Returns requested It-Contract payment model type
     * 
     * @param paymentModelTypeUuid payment model type identifier
     * @param organizationUuid organization context for the payment model type availability
     */
    gETItContractPaymentModelTypeV2GetGuidPaymentModelTypeUuidGuidOrganizationUuid(paymentModelTypeUuid: string, organizationUuid: string, extraHttpRequestParams?: any): Observable<APIRegularOptionExtendedResponseDTO>;

}
