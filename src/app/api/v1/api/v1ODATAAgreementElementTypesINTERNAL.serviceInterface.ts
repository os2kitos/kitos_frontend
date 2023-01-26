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
import { HttpHeaders }                                       from '@angular/common/http';

import { Observable }                                        from 'rxjs';

import { APIAgreementElementType } from '../model/models';


import { Configuration }                                     from '../configuration';



export interface APIV1ODATAAgreementElementTypesINTERNALServiceInterface {
    defaultHeaders: HttpHeaders;
    configuration: Configuration;

    /**
     * Returns the EntitySet AgreementElementTypes
     * 
     * @param $expand Expands related entities inline.
     * @param $filter Filters the results, based on a Boolean condition.
     * @param $select Selects which properties to include in the response.
     * @param $orderby Sorts the results.
     * @param $top Returns only the first n results.
     * @param $skip Skips the first n results.
     * @param $count Includes a count of the matching results in the response.
     */
    gETAgreementElementTypesGet($expand?: string, $filter?: string, $select?: string, $orderby?: string, $top?: number, $skip?: number, $count?: boolean, extraHttpRequestParams?: any): Observable<object>;

    /**
     * Returns the entity with the key from AgreementElementTypes
     * 
     * @param id key: Id
     * @param $expand Expands related entities inline.
     * @param $select Selects which properties to include in the response.
     */
    gETAgreementElementTypesGetInt32KeyById(id: number, $expand?: string, $select?: string, extraHttpRequestParams?: any): Observable<object>;

    /**
     * Update entity in EntitySet AgreementElementTypes
     * 
     * @param id key: Id
     * @param agreementElementType The entity to patch
     */
    pATCHAgreementElementTypesPatchDelta1DeltaInt32KeyById(id: number, agreementElementType: APIAgreementElementType, extraHttpRequestParams?: any): Observable<object>;

}
