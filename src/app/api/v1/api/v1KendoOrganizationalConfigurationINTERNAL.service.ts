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
/* tslint:disable:no-unused-variable member-ordering */

import { Inject, Injectable, Optional }                      from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams,
         HttpResponse, HttpEvent, HttpParameterCodec, HttpContext 
        }       from '@angular/common/http';
import { CustomHttpParameterCodec }                          from '../encoder';
import { Observable }                                        from 'rxjs';

// @ts-ignore
import { APIKendoOrganizationalConfigurationDTO } from '../model/aPIKendoOrganizationalConfigurationDTO';
// @ts-ignore
import { APIKendoOrganizationalConfigurationDTOApiReturnDTO } from '../model/aPIKendoOrganizationalConfigurationDTOApiReturnDTO';
// @ts-ignore
import { APIStringApiReturnDTO } from '../model/aPIStringApiReturnDTO';

// @ts-ignore
import { BASE_PATH, COLLECTION_FORMATS }                     from '../variables';
import { Configuration }                                     from '../configuration';



@Injectable({
  providedIn: 'root'
})
export class APIV1KendoOrganizationalConfigurationINTERNALService {

    protected basePath = 'https://kitos-dev.strongminds.dk';
    public defaultHeaders = new HttpHeaders();
    public configuration = new Configuration();
    public encoder: HttpParameterCodec;

    constructor(protected httpClient: HttpClient, @Optional()@Inject(BASE_PATH) basePath: string|string[], @Optional() configuration: Configuration) {
        if (configuration) {
            this.configuration = configuration;
        }
        if (typeof this.configuration.basePath !== 'string') {
            if (Array.isArray(basePath) && basePath.length > 0) {
                basePath = basePath[0];
            }

            if (typeof basePath !== 'string') {
                basePath = this.basePath;
            }
            this.configuration.basePath = basePath;
        }
        this.encoder = this.configuration.encoder || new CustomHttpParameterCodec();
    }


    // @ts-ignore
    private addToHttpParams(httpParams: HttpParams, value: any, key?: string): HttpParams {
        if (typeof value === "object" && value instanceof Date === false) {
            httpParams = this.addToHttpParamsRecursive(httpParams, value);
        } else {
            httpParams = this.addToHttpParamsRecursive(httpParams, value, key);
        }
        return httpParams;
    }

    private addToHttpParamsRecursive(httpParams: HttpParams, value?: any, key?: string): HttpParams {
        if (value == null) {
            return httpParams;
        }

        if (typeof value === "object") {
            if (Array.isArray(value)) {
                (value as any[]).forEach( elem => httpParams = this.addToHttpParamsRecursive(httpParams, elem, key));
            } else if (value instanceof Date) {
                if (key != null) {
                    httpParams = httpParams.append(key, (value as Date).toISOString().substr(0, 10));
                } else {
                   throw Error("key may not be null if value is Date");
                }
            } else {
                Object.keys(value).forEach( k => httpParams = this.addToHttpParamsRecursive(
                    httpParams, value[k], key != null ? `${key}.${k}` : k));
            }
        } else if (key != null) {
            httpParams = httpParams.append(key, value);
        } else {
            throw Error("key may not be null if value is not object or array");
        }
        return httpParams;
    }

    /**
     * @param organizationId 
     * @param overviewType 
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public dELETEKendoOrganizationalConfigurationDeleteConfigurationOverviewTypeOverviewTypeInt32OrganizationId(organizationId: number, overviewType: 'ItSystemUsage' | 'ItContract' | 'DataProcessingRegistration', observe?: 'body', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json' | 'text/json', context?: HttpContext}): Observable<object>;
    public dELETEKendoOrganizationalConfigurationDeleteConfigurationOverviewTypeOverviewTypeInt32OrganizationId(organizationId: number, overviewType: 'ItSystemUsage' | 'ItContract' | 'DataProcessingRegistration', observe?: 'response', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json' | 'text/json', context?: HttpContext}): Observable<HttpResponse<object>>;
    public dELETEKendoOrganizationalConfigurationDeleteConfigurationOverviewTypeOverviewTypeInt32OrganizationId(organizationId: number, overviewType: 'ItSystemUsage' | 'ItContract' | 'DataProcessingRegistration', observe?: 'events', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json' | 'text/json', context?: HttpContext}): Observable<HttpEvent<object>>;
    public dELETEKendoOrganizationalConfigurationDeleteConfigurationOverviewTypeOverviewTypeInt32OrganizationId(organizationId: number, overviewType: 'ItSystemUsage' | 'ItContract' | 'DataProcessingRegistration', observe: any = 'body', reportProgress: boolean = false, options?: {httpHeaderAccept?: 'application/json' | 'text/json', context?: HttpContext}): Observable<any> {
        if (organizationId === null || organizationId === undefined) {
            throw new Error('Required parameter organizationId was null or undefined when calling dELETEKendoOrganizationalConfigurationDeleteConfigurationOverviewTypeOverviewTypeInt32OrganizationId.');
        }
        if (overviewType === null || overviewType === undefined) {
            throw new Error('Required parameter overviewType was null or undefined when calling dELETEKendoOrganizationalConfigurationDeleteConfigurationOverviewTypeOverviewTypeInt32OrganizationId.');
        }

        let localVarQueryParameters = new HttpParams({encoder: this.encoder});
        if (organizationId !== undefined && organizationId !== null) {
          localVarQueryParameters = this.addToHttpParams(localVarQueryParameters,
            <any>organizationId, 'organizationId');
        }
        if (overviewType !== undefined && overviewType !== null) {
          localVarQueryParameters = this.addToHttpParams(localVarQueryParameters,
            <any>overviewType, 'overviewType');
        }

        let localVarHeaders = this.defaultHeaders;

        let localVarHttpHeaderAcceptSelected: string | undefined = options && options.httpHeaderAccept;
        if (localVarHttpHeaderAcceptSelected === undefined) {
            // to determine the Accept header
            const httpHeaderAccepts: string[] = [
                'application/json',
                'text/json'
            ];
            localVarHttpHeaderAcceptSelected = this.configuration.selectHeaderAccept(httpHeaderAccepts);
        }
        if (localVarHttpHeaderAcceptSelected !== undefined) {
            localVarHeaders = localVarHeaders.set('Accept', localVarHttpHeaderAcceptSelected);
        }

        let localVarHttpContext: HttpContext | undefined = options && options.context;
        if (localVarHttpContext === undefined) {
            localVarHttpContext = new HttpContext();
        }


        let responseType_: 'text' | 'json' | 'blob' = 'json';
        if (localVarHttpHeaderAcceptSelected) {
            if (localVarHttpHeaderAcceptSelected.startsWith('text')) {
                responseType_ = 'text';
            } else if (this.configuration.isJsonMime(localVarHttpHeaderAcceptSelected)) {
                responseType_ = 'json';
            } else {
                responseType_ = 'blob';
            }
        }

        let localVarPath = `/api/v1/kendo-organizational-configuration`;
        return this.httpClient.request<object>('delete', `${this.configuration.basePath}${localVarPath}`,
            {
                context: localVarHttpContext,
                params: localVarQueryParameters,
                responseType: <any>responseType_,
                withCredentials: this.configuration.withCredentials,
                headers: localVarHeaders,
                observe: observe,
                reportProgress: reportProgress
            }
        );
    }

    /**
     * @param id 
     * @param getEntityAccessRights 
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public gETKendoOrganizationalConfigurationGetAccessRightsForEntityInt32IdNullable1GetEntityAccessRights(id: number, getEntityAccessRights: boolean, observe?: 'body', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json' | 'text/json', context?: HttpContext}): Observable<object>;
    public gETKendoOrganizationalConfigurationGetAccessRightsForEntityInt32IdNullable1GetEntityAccessRights(id: number, getEntityAccessRights: boolean, observe?: 'response', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json' | 'text/json', context?: HttpContext}): Observable<HttpResponse<object>>;
    public gETKendoOrganizationalConfigurationGetAccessRightsForEntityInt32IdNullable1GetEntityAccessRights(id: number, getEntityAccessRights: boolean, observe?: 'events', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json' | 'text/json', context?: HttpContext}): Observable<HttpEvent<object>>;
    public gETKendoOrganizationalConfigurationGetAccessRightsForEntityInt32IdNullable1GetEntityAccessRights(id: number, getEntityAccessRights: boolean, observe: any = 'body', reportProgress: boolean = false, options?: {httpHeaderAccept?: 'application/json' | 'text/json', context?: HttpContext}): Observable<any> {
        if (id === null || id === undefined) {
            throw new Error('Required parameter id was null or undefined when calling gETKendoOrganizationalConfigurationGetAccessRightsForEntityInt32IdNullable1GetEntityAccessRights.');
        }
        if (getEntityAccessRights === null || getEntityAccessRights === undefined) {
            throw new Error('Required parameter getEntityAccessRights was null or undefined when calling gETKendoOrganizationalConfigurationGetAccessRightsForEntityInt32IdNullable1GetEntityAccessRights.');
        }

        let localVarQueryParameters = new HttpParams({encoder: this.encoder});
        if (getEntityAccessRights !== undefined && getEntityAccessRights !== null) {
          localVarQueryParameters = this.addToHttpParams(localVarQueryParameters,
            <any>getEntityAccessRights, 'getEntityAccessRights');
        }

        let localVarHeaders = this.defaultHeaders;

        let localVarHttpHeaderAcceptSelected: string | undefined = options && options.httpHeaderAccept;
        if (localVarHttpHeaderAcceptSelected === undefined) {
            // to determine the Accept header
            const httpHeaderAccepts: string[] = [
                'application/json',
                'text/json'
            ];
            localVarHttpHeaderAcceptSelected = this.configuration.selectHeaderAccept(httpHeaderAccepts);
        }
        if (localVarHttpHeaderAcceptSelected !== undefined) {
            localVarHeaders = localVarHeaders.set('Accept', localVarHttpHeaderAcceptSelected);
        }

        let localVarHttpContext: HttpContext | undefined = options && options.context;
        if (localVarHttpContext === undefined) {
            localVarHttpContext = new HttpContext();
        }


        let responseType_: 'text' | 'json' | 'blob' = 'json';
        if (localVarHttpHeaderAcceptSelected) {
            if (localVarHttpHeaderAcceptSelected.startsWith('text')) {
                responseType_ = 'text';
            } else if (this.configuration.isJsonMime(localVarHttpHeaderAcceptSelected)) {
                responseType_ = 'json';
            } else {
                responseType_ = 'blob';
            }
        }

        let localVarPath = `/api/KendoOrganizationalConfiguration/${this.configuration.encodeParam({name: "id", value: id, in: "path", style: "simple", explode: false, dataType: "number", dataFormat: "int32"})}`;
        return this.httpClient.request<object>('get', `${this.configuration.basePath}${localVarPath}`,
            {
                context: localVarHttpContext,
                params: localVarQueryParameters,
                responseType: <any>responseType_,
                withCredentials: this.configuration.withCredentials,
                headers: localVarHeaders,
                observe: observe,
                reportProgress: reportProgress
            }
        );
    }

    /**
     * @param getEntitiesAccessRights 
     * @param organizationId 
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public gETKendoOrganizationalConfigurationGetAccessRightsInt32OrganizationIdNullable1GetEntitiesAccessRights(getEntitiesAccessRights: boolean, organizationId: number, observe?: 'body', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json' | 'text/json', context?: HttpContext}): Observable<object>;
    public gETKendoOrganizationalConfigurationGetAccessRightsInt32OrganizationIdNullable1GetEntitiesAccessRights(getEntitiesAccessRights: boolean, organizationId: number, observe?: 'response', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json' | 'text/json', context?: HttpContext}): Observable<HttpResponse<object>>;
    public gETKendoOrganizationalConfigurationGetAccessRightsInt32OrganizationIdNullable1GetEntitiesAccessRights(getEntitiesAccessRights: boolean, organizationId: number, observe?: 'events', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json' | 'text/json', context?: HttpContext}): Observable<HttpEvent<object>>;
    public gETKendoOrganizationalConfigurationGetAccessRightsInt32OrganizationIdNullable1GetEntitiesAccessRights(getEntitiesAccessRights: boolean, organizationId: number, observe: any = 'body', reportProgress: boolean = false, options?: {httpHeaderAccept?: 'application/json' | 'text/json', context?: HttpContext}): Observable<any> {
        if (getEntitiesAccessRights === null || getEntitiesAccessRights === undefined) {
            throw new Error('Required parameter getEntitiesAccessRights was null or undefined when calling gETKendoOrganizationalConfigurationGetAccessRightsInt32OrganizationIdNullable1GetEntitiesAccessRights.');
        }
        if (organizationId === null || organizationId === undefined) {
            throw new Error('Required parameter organizationId was null or undefined when calling gETKendoOrganizationalConfigurationGetAccessRightsInt32OrganizationIdNullable1GetEntitiesAccessRights.');
        }

        let localVarQueryParameters = new HttpParams({encoder: this.encoder});
        if (getEntitiesAccessRights !== undefined && getEntitiesAccessRights !== null) {
          localVarQueryParameters = this.addToHttpParams(localVarQueryParameters,
            <any>getEntitiesAccessRights, 'getEntitiesAccessRights');
        }
        if (organizationId !== undefined && organizationId !== null) {
          localVarQueryParameters = this.addToHttpParams(localVarQueryParameters,
            <any>organizationId, 'organizationId');
        }

        let localVarHeaders = this.defaultHeaders;

        let localVarHttpHeaderAcceptSelected: string | undefined = options && options.httpHeaderAccept;
        if (localVarHttpHeaderAcceptSelected === undefined) {
            // to determine the Accept header
            const httpHeaderAccepts: string[] = [
                'application/json',
                'text/json'
            ];
            localVarHttpHeaderAcceptSelected = this.configuration.selectHeaderAccept(httpHeaderAccepts);
        }
        if (localVarHttpHeaderAcceptSelected !== undefined) {
            localVarHeaders = localVarHeaders.set('Accept', localVarHttpHeaderAcceptSelected);
        }

        let localVarHttpContext: HttpContext | undefined = options && options.context;
        if (localVarHttpContext === undefined) {
            localVarHttpContext = new HttpContext();
        }


        let responseType_: 'text' | 'json' | 'blob' = 'json';
        if (localVarHttpHeaderAcceptSelected) {
            if (localVarHttpHeaderAcceptSelected.startsWith('text')) {
                responseType_ = 'text';
            } else if (this.configuration.isJsonMime(localVarHttpHeaderAcceptSelected)) {
                responseType_ = 'json';
            } else {
                responseType_ = 'blob';
            }
        }

        let localVarPath = `/api/KendoOrganizationalConfiguration`;
        return this.httpClient.request<object>('get', `${this.configuration.basePath}${localVarPath}`,
            {
                context: localVarHttpContext,
                params: localVarQueryParameters,
                responseType: <any>responseType_,
                withCredentials: this.configuration.withCredentials,
                headers: localVarHeaders,
                observe: observe,
                reportProgress: reportProgress
            }
        );
    }

    /**
     * @param organizationId 
     * @param overviewType 
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public gETKendoOrganizationalConfigurationGetConfigurationOverviewTypeOverviewTypeInt32OrganizationId(organizationId: number, overviewType: 'ItSystemUsage' | 'ItContract' | 'DataProcessingRegistration', observe?: 'body', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json' | 'text/json', context?: HttpContext}): Observable<object>;
    public gETKendoOrganizationalConfigurationGetConfigurationOverviewTypeOverviewTypeInt32OrganizationId(organizationId: number, overviewType: 'ItSystemUsage' | 'ItContract' | 'DataProcessingRegistration', observe?: 'response', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json' | 'text/json', context?: HttpContext}): Observable<HttpResponse<object>>;
    public gETKendoOrganizationalConfigurationGetConfigurationOverviewTypeOverviewTypeInt32OrganizationId(organizationId: number, overviewType: 'ItSystemUsage' | 'ItContract' | 'DataProcessingRegistration', observe?: 'events', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json' | 'text/json', context?: HttpContext}): Observable<HttpEvent<object>>;
    public gETKendoOrganizationalConfigurationGetConfigurationOverviewTypeOverviewTypeInt32OrganizationId(organizationId: number, overviewType: 'ItSystemUsage' | 'ItContract' | 'DataProcessingRegistration', observe: any = 'body', reportProgress: boolean = false, options?: {httpHeaderAccept?: 'application/json' | 'text/json', context?: HttpContext}): Observable<any> {
        if (organizationId === null || organizationId === undefined) {
            throw new Error('Required parameter organizationId was null or undefined when calling gETKendoOrganizationalConfigurationGetConfigurationOverviewTypeOverviewTypeInt32OrganizationId.');
        }
        if (overviewType === null || overviewType === undefined) {
            throw new Error('Required parameter overviewType was null or undefined when calling gETKendoOrganizationalConfigurationGetConfigurationOverviewTypeOverviewTypeInt32OrganizationId.');
        }

        let localVarQueryParameters = new HttpParams({encoder: this.encoder});
        if (organizationId !== undefined && organizationId !== null) {
          localVarQueryParameters = this.addToHttpParams(localVarQueryParameters,
            <any>organizationId, 'organizationId');
        }
        if (overviewType !== undefined && overviewType !== null) {
          localVarQueryParameters = this.addToHttpParams(localVarQueryParameters,
            <any>overviewType, 'overviewType');
        }

        let localVarHeaders = this.defaultHeaders;

        let localVarHttpHeaderAcceptSelected: string | undefined = options && options.httpHeaderAccept;
        if (localVarHttpHeaderAcceptSelected === undefined) {
            // to determine the Accept header
            const httpHeaderAccepts: string[] = [
                'application/json',
                'text/json'
            ];
            localVarHttpHeaderAcceptSelected = this.configuration.selectHeaderAccept(httpHeaderAccepts);
        }
        if (localVarHttpHeaderAcceptSelected !== undefined) {
            localVarHeaders = localVarHeaders.set('Accept', localVarHttpHeaderAcceptSelected);
        }

        let localVarHttpContext: HttpContext | undefined = options && options.context;
        if (localVarHttpContext === undefined) {
            localVarHttpContext = new HttpContext();
        }


        let responseType_: 'text' | 'json' | 'blob' = 'json';
        if (localVarHttpHeaderAcceptSelected) {
            if (localVarHttpHeaderAcceptSelected.startsWith('text')) {
                responseType_ = 'text';
            } else if (this.configuration.isJsonMime(localVarHttpHeaderAcceptSelected)) {
                responseType_ = 'json';
            } else {
                responseType_ = 'blob';
            }
        }

        let localVarPath = `/api/v1/kendo-organizational-configuration`;
        return this.httpClient.request<object>('get', `${this.configuration.basePath}${localVarPath}`,
            {
                context: localVarHttpContext,
                params: localVarQueryParameters,
                responseType: <any>responseType_,
                withCredentials: this.configuration.withCredentials,
                headers: localVarHeaders,
                observe: observe,
                reportProgress: reportProgress
            }
        );
    }

    /**
     * @param organizationId 
     * @param overviewType 
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public gETKendoOrganizationalConfigurationGetConfigurationVersionOverviewTypeOverviewTypeInt32OrganizationId(organizationId: number, overviewType: 'ItSystemUsage' | 'ItContract' | 'DataProcessingRegistration', observe?: 'body', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json' | 'text/json', context?: HttpContext}): Observable<object>;
    public gETKendoOrganizationalConfigurationGetConfigurationVersionOverviewTypeOverviewTypeInt32OrganizationId(organizationId: number, overviewType: 'ItSystemUsage' | 'ItContract' | 'DataProcessingRegistration', observe?: 'response', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json' | 'text/json', context?: HttpContext}): Observable<HttpResponse<object>>;
    public gETKendoOrganizationalConfigurationGetConfigurationVersionOverviewTypeOverviewTypeInt32OrganizationId(organizationId: number, overviewType: 'ItSystemUsage' | 'ItContract' | 'DataProcessingRegistration', observe?: 'events', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json' | 'text/json', context?: HttpContext}): Observable<HttpEvent<object>>;
    public gETKendoOrganizationalConfigurationGetConfigurationVersionOverviewTypeOverviewTypeInt32OrganizationId(organizationId: number, overviewType: 'ItSystemUsage' | 'ItContract' | 'DataProcessingRegistration', observe: any = 'body', reportProgress: boolean = false, options?: {httpHeaderAccept?: 'application/json' | 'text/json', context?: HttpContext}): Observable<any> {
        if (organizationId === null || organizationId === undefined) {
            throw new Error('Required parameter organizationId was null or undefined when calling gETKendoOrganizationalConfigurationGetConfigurationVersionOverviewTypeOverviewTypeInt32OrganizationId.');
        }
        if (overviewType === null || overviewType === undefined) {
            throw new Error('Required parameter overviewType was null or undefined when calling gETKendoOrganizationalConfigurationGetConfigurationVersionOverviewTypeOverviewTypeInt32OrganizationId.');
        }

        let localVarQueryParameters = new HttpParams({encoder: this.encoder});
        if (organizationId !== undefined && organizationId !== null) {
          localVarQueryParameters = this.addToHttpParams(localVarQueryParameters,
            <any>organizationId, 'organizationId');
        }
        if (overviewType !== undefined && overviewType !== null) {
          localVarQueryParameters = this.addToHttpParams(localVarQueryParameters,
            <any>overviewType, 'overviewType');
        }

        let localVarHeaders = this.defaultHeaders;

        let localVarHttpHeaderAcceptSelected: string | undefined = options && options.httpHeaderAccept;
        if (localVarHttpHeaderAcceptSelected === undefined) {
            // to determine the Accept header
            const httpHeaderAccepts: string[] = [
                'application/json',
                'text/json'
            ];
            localVarHttpHeaderAcceptSelected = this.configuration.selectHeaderAccept(httpHeaderAccepts);
        }
        if (localVarHttpHeaderAcceptSelected !== undefined) {
            localVarHeaders = localVarHeaders.set('Accept', localVarHttpHeaderAcceptSelected);
        }

        let localVarHttpContext: HttpContext | undefined = options && options.context;
        if (localVarHttpContext === undefined) {
            localVarHttpContext = new HttpContext();
        }


        let responseType_: 'text' | 'json' | 'blob' = 'json';
        if (localVarHttpHeaderAcceptSelected) {
            if (localVarHttpHeaderAcceptSelected.startsWith('text')) {
                responseType_ = 'text';
            } else if (this.configuration.isJsonMime(localVarHttpHeaderAcceptSelected)) {
                responseType_ = 'json';
            } else {
                responseType_ = 'blob';
            }
        }

        let localVarPath = `/api/v1/kendo-organizational-configuration/version`;
        return this.httpClient.request<object>('get', `${this.configuration.basePath}${localVarPath}`,
            {
                context: localVarHttpContext,
                params: localVarQueryParameters,
                responseType: <any>responseType_,
                withCredentials: this.configuration.withCredentials,
                headers: localVarHeaders,
                observe: observe,
                reportProgress: reportProgress
            }
        );
    }

    /**
     * @param getEntityListAccessRights 
     * @param ids 
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public pOSTKendoOrganizationalConfigurationPostSearchAccessRightsForEntityListInt32IdsNullable1GetEntityListAccessRights(getEntityListAccessRights: boolean, ids: Array<number>, observe?: 'body', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json' | 'text/json', context?: HttpContext}): Observable<object>;
    public pOSTKendoOrganizationalConfigurationPostSearchAccessRightsForEntityListInt32IdsNullable1GetEntityListAccessRights(getEntityListAccessRights: boolean, ids: Array<number>, observe?: 'response', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json' | 'text/json', context?: HttpContext}): Observable<HttpResponse<object>>;
    public pOSTKendoOrganizationalConfigurationPostSearchAccessRightsForEntityListInt32IdsNullable1GetEntityListAccessRights(getEntityListAccessRights: boolean, ids: Array<number>, observe?: 'events', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json' | 'text/json', context?: HttpContext}): Observable<HttpEvent<object>>;
    public pOSTKendoOrganizationalConfigurationPostSearchAccessRightsForEntityListInt32IdsNullable1GetEntityListAccessRights(getEntityListAccessRights: boolean, ids: Array<number>, observe: any = 'body', reportProgress: boolean = false, options?: {httpHeaderAccept?: 'application/json' | 'text/json', context?: HttpContext}): Observable<any> {
        if (getEntityListAccessRights === null || getEntityListAccessRights === undefined) {
            throw new Error('Required parameter getEntityListAccessRights was null or undefined when calling pOSTKendoOrganizationalConfigurationPostSearchAccessRightsForEntityListInt32IdsNullable1GetEntityListAccessRights.');
        }
        if (ids === null || ids === undefined) {
            throw new Error('Required parameter ids was null or undefined when calling pOSTKendoOrganizationalConfigurationPostSearchAccessRightsForEntityListInt32IdsNullable1GetEntityListAccessRights.');
        }

        let localVarQueryParameters = new HttpParams({encoder: this.encoder});
        if (getEntityListAccessRights !== undefined && getEntityListAccessRights !== null) {
          localVarQueryParameters = this.addToHttpParams(localVarQueryParameters,
            <any>getEntityListAccessRights, 'getEntityListAccessRights');
        }

        let localVarHeaders = this.defaultHeaders;

        let localVarHttpHeaderAcceptSelected: string | undefined = options && options.httpHeaderAccept;
        if (localVarHttpHeaderAcceptSelected === undefined) {
            // to determine the Accept header
            const httpHeaderAccepts: string[] = [
                'application/json',
                'text/json'
            ];
            localVarHttpHeaderAcceptSelected = this.configuration.selectHeaderAccept(httpHeaderAccepts);
        }
        if (localVarHttpHeaderAcceptSelected !== undefined) {
            localVarHeaders = localVarHeaders.set('Accept', localVarHttpHeaderAcceptSelected);
        }

        let localVarHttpContext: HttpContext | undefined = options && options.context;
        if (localVarHttpContext === undefined) {
            localVarHttpContext = new HttpContext();
        }


        // to determine the Content-Type header
        const consumes: string[] = [
            'application/json',
            'text/json',
            'application/x-www-form-urlencoded'
        ];
        const httpContentTypeSelected: string | undefined = this.configuration.selectHeaderContentType(consumes);
        if (httpContentTypeSelected !== undefined) {
            localVarHeaders = localVarHeaders.set('Content-Type', httpContentTypeSelected);
        }

        let responseType_: 'text' | 'json' | 'blob' = 'json';
        if (localVarHttpHeaderAcceptSelected) {
            if (localVarHttpHeaderAcceptSelected.startsWith('text')) {
                responseType_ = 'text';
            } else if (this.configuration.isJsonMime(localVarHttpHeaderAcceptSelected)) {
                responseType_ = 'json';
            } else {
                responseType_ = 'blob';
            }
        }

        let localVarPath = `/api/KendoOrganizationalConfiguration`;
        return this.httpClient.request<object>('post', `${this.configuration.basePath}${localVarPath}`,
            {
                context: localVarHttpContext,
                body: ids,
                params: localVarQueryParameters,
                responseType: <any>responseType_,
                withCredentials: this.configuration.withCredentials,
                headers: localVarHeaders,
                observe: observe,
                reportProgress: reportProgress
            }
        );
    }

    /**
     * @param dto 
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public pOSTKendoOrganizationalConfigurationSaveConfigurationKendoOrganizationalConfigurationDTODto(dto: APIKendoOrganizationalConfigurationDTO, observe?: 'body', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json' | 'text/json', context?: HttpContext}): Observable<object>;
    public pOSTKendoOrganizationalConfigurationSaveConfigurationKendoOrganizationalConfigurationDTODto(dto: APIKendoOrganizationalConfigurationDTO, observe?: 'response', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json' | 'text/json', context?: HttpContext}): Observable<HttpResponse<object>>;
    public pOSTKendoOrganizationalConfigurationSaveConfigurationKendoOrganizationalConfigurationDTODto(dto: APIKendoOrganizationalConfigurationDTO, observe?: 'events', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json' | 'text/json', context?: HttpContext}): Observable<HttpEvent<object>>;
    public pOSTKendoOrganizationalConfigurationSaveConfigurationKendoOrganizationalConfigurationDTODto(dto: APIKendoOrganizationalConfigurationDTO, observe: any = 'body', reportProgress: boolean = false, options?: {httpHeaderAccept?: 'application/json' | 'text/json', context?: HttpContext}): Observable<any> {
        if (dto === null || dto === undefined) {
            throw new Error('Required parameter dto was null or undefined when calling pOSTKendoOrganizationalConfigurationSaveConfigurationKendoOrganizationalConfigurationDTODto.');
        }

        let localVarHeaders = this.defaultHeaders;

        let localVarHttpHeaderAcceptSelected: string | undefined = options && options.httpHeaderAccept;
        if (localVarHttpHeaderAcceptSelected === undefined) {
            // to determine the Accept header
            const httpHeaderAccepts: string[] = [
                'application/json',
                'text/json'
            ];
            localVarHttpHeaderAcceptSelected = this.configuration.selectHeaderAccept(httpHeaderAccepts);
        }
        if (localVarHttpHeaderAcceptSelected !== undefined) {
            localVarHeaders = localVarHeaders.set('Accept', localVarHttpHeaderAcceptSelected);
        }

        let localVarHttpContext: HttpContext | undefined = options && options.context;
        if (localVarHttpContext === undefined) {
            localVarHttpContext = new HttpContext();
        }


        // to determine the Content-Type header
        const consumes: string[] = [
            'application/json',
            'text/json',
            'application/x-www-form-urlencoded'
        ];
        const httpContentTypeSelected: string | undefined = this.configuration.selectHeaderContentType(consumes);
        if (httpContentTypeSelected !== undefined) {
            localVarHeaders = localVarHeaders.set('Content-Type', httpContentTypeSelected);
        }

        let responseType_: 'text' | 'json' | 'blob' = 'json';
        if (localVarHttpHeaderAcceptSelected) {
            if (localVarHttpHeaderAcceptSelected.startsWith('text')) {
                responseType_ = 'text';
            } else if (this.configuration.isJsonMime(localVarHttpHeaderAcceptSelected)) {
                responseType_ = 'json';
            } else {
                responseType_ = 'blob';
            }
        }

        let localVarPath = `/api/v1/kendo-organizational-configuration`;
        return this.httpClient.request<object>('post', `${this.configuration.basePath}${localVarPath}`,
            {
                context: localVarHttpContext,
                body: dto,
                responseType: <any>responseType_,
                withCredentials: this.configuration.withCredentials,
                headers: localVarHeaders,
                observe: observe,
                reportProgress: reportProgress
            }
        );
    }

}