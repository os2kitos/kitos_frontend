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
/* tslint:disable:no-unused-variable member-ordering */

import { Inject, Injectable, Optional }                      from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams,
         HttpResponse, HttpEvent, HttpParameterCodec, HttpContext 
        }       from '@angular/common/http';
import { CustomHttpParameterCodec }                          from '../encoder';
import { Observable }                                        from 'rxjs';

// @ts-ignore
import { APIIdentityNamePairWithDeactivatedStatusDTO } from '../model/aPIIdentityNamePairWithDeactivatedStatusDTO';
// @ts-ignore
import { APIItSystemUsageMigrationPermissionsResponseDTO } from '../model/aPIItSystemUsageMigrationPermissionsResponseDTO';
// @ts-ignore
import { APIItSystemUsageMigrationV2ResponseDTO } from '../model/aPIItSystemUsageMigrationV2ResponseDTO';

// @ts-ignore
import { BASE_PATH, COLLECTION_FORMATS }                     from '../variables';
import { Configuration }                                     from '../configuration';



@Injectable({
  providedIn: 'root'
})
export class APIV2ItSystemUsageMigrationINTERNALService {

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
     * Gets the migration description if a system usage is migrated to another master it-system resource
     * @param usageUuid uuid of system usage being migrated
     * @param toSystemUuid uuid of the master it-system to migrate to
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public gETItSystemUsageMigrationV2GetGuidToSystemUuidGuidUsageUuid(usageUuid: string, toSystemUuid: string, observe?: 'body', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json', context?: HttpContext}): Observable<APIItSystemUsageMigrationV2ResponseDTO>;
    public gETItSystemUsageMigrationV2GetGuidToSystemUuidGuidUsageUuid(usageUuid: string, toSystemUuid: string, observe?: 'response', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json', context?: HttpContext}): Observable<HttpResponse<APIItSystemUsageMigrationV2ResponseDTO>>;
    public gETItSystemUsageMigrationV2GetGuidToSystemUuidGuidUsageUuid(usageUuid: string, toSystemUuid: string, observe?: 'events', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json', context?: HttpContext}): Observable<HttpEvent<APIItSystemUsageMigrationV2ResponseDTO>>;
    public gETItSystemUsageMigrationV2GetGuidToSystemUuidGuidUsageUuid(usageUuid: string, toSystemUuid: string, observe: any = 'body', reportProgress: boolean = false, options?: {httpHeaderAccept?: 'application/json', context?: HttpContext}): Observable<any> {
        if (usageUuid === null || usageUuid === undefined) {
            throw new Error('Required parameter usageUuid was null or undefined when calling gETItSystemUsageMigrationV2GetGuidToSystemUuidGuidUsageUuid.');
        }
        if (toSystemUuid === null || toSystemUuid === undefined) {
            throw new Error('Required parameter toSystemUuid was null or undefined when calling gETItSystemUsageMigrationV2GetGuidToSystemUuidGuidUsageUuid.');
        }

        let localVarQueryParameters = new HttpParams({encoder: this.encoder});
        if (toSystemUuid !== undefined && toSystemUuid !== null) {
          localVarQueryParameters = this.addToHttpParams(localVarQueryParameters,
            <any>toSystemUuid, 'toSystemUuid');
        }

        let localVarHeaders = this.defaultHeaders;

        let localVarHttpHeaderAcceptSelected: string | undefined = options && options.httpHeaderAccept;
        if (localVarHttpHeaderAcceptSelected === undefined) {
            // to determine the Accept header
            const httpHeaderAccepts: string[] = [
                'application/json'
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

        let localVarPath = `/api/v2/internal/it-system-usages/${this.configuration.encodeParam({name: "usageUuid", value: usageUuid, in: "path", style: "simple", explode: false, dataType: "string", dataFormat: "uuid"})}/migration`;
        return this.httpClient.request<APIItSystemUsageMigrationV2ResponseDTO>('get', `${this.configuration.basePath}${localVarPath}`,
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
     * Gets the migration permissions of the authenticated user
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public gETItSystemUsageMigrationV2GetPermissions(observe?: 'body', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json', context?: HttpContext}): Observable<APIItSystemUsageMigrationPermissionsResponseDTO>;
    public gETItSystemUsageMigrationV2GetPermissions(observe?: 'response', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json', context?: HttpContext}): Observable<HttpResponse<APIItSystemUsageMigrationPermissionsResponseDTO>>;
    public gETItSystemUsageMigrationV2GetPermissions(observe?: 'events', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json', context?: HttpContext}): Observable<HttpEvent<APIItSystemUsageMigrationPermissionsResponseDTO>>;
    public gETItSystemUsageMigrationV2GetPermissions(observe: any = 'body', reportProgress: boolean = false, options?: {httpHeaderAccept?: 'application/json', context?: HttpContext}): Observable<any> {

        let localVarHeaders = this.defaultHeaders;

        let localVarHttpHeaderAcceptSelected: string | undefined = options && options.httpHeaderAccept;
        if (localVarHttpHeaderAcceptSelected === undefined) {
            // to determine the Accept header
            const httpHeaderAccepts: string[] = [
                'application/json'
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

        let localVarPath = `/api/v2/internal/it-system-usages/migration/permissions`;
        return this.httpClient.request<APIItSystemUsageMigrationPermissionsResponseDTO>('get', `${this.configuration.basePath}${localVarPath}`,
            {
                context: localVarHttpContext,
                responseType: <any>responseType_,
                withCredentials: this.configuration.withCredentials,
                headers: localVarHeaders,
                observe: observe,
                reportProgress: reportProgress
            }
        );
    }

    /**
     * Search for systems which are not in use and which are valid migration targets
     * @param organizationUuid 
     * @param numberOfItSystems 
     * @param nameContent 
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public gETItSystemUsageMigrationV2GetUnusedItSystemsBySearchAndOrganizationGuidOrganizationUuidInt32NumberOfItSystemsStringNameContent(organizationUuid: string, numberOfItSystems: number, nameContent?: string, observe?: 'body', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json', context?: HttpContext}): Observable<Array<APIIdentityNamePairWithDeactivatedStatusDTO>>;
    public gETItSystemUsageMigrationV2GetUnusedItSystemsBySearchAndOrganizationGuidOrganizationUuidInt32NumberOfItSystemsStringNameContent(organizationUuid: string, numberOfItSystems: number, nameContent?: string, observe?: 'response', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json', context?: HttpContext}): Observable<HttpResponse<Array<APIIdentityNamePairWithDeactivatedStatusDTO>>>;
    public gETItSystemUsageMigrationV2GetUnusedItSystemsBySearchAndOrganizationGuidOrganizationUuidInt32NumberOfItSystemsStringNameContent(organizationUuid: string, numberOfItSystems: number, nameContent?: string, observe?: 'events', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json', context?: HttpContext}): Observable<HttpEvent<Array<APIIdentityNamePairWithDeactivatedStatusDTO>>>;
    public gETItSystemUsageMigrationV2GetUnusedItSystemsBySearchAndOrganizationGuidOrganizationUuidInt32NumberOfItSystemsStringNameContent(organizationUuid: string, numberOfItSystems: number, nameContent?: string, observe: any = 'body', reportProgress: boolean = false, options?: {httpHeaderAccept?: 'application/json', context?: HttpContext}): Observable<any> {
        if (organizationUuid === null || organizationUuid === undefined) {
            throw new Error('Required parameter organizationUuid was null or undefined when calling gETItSystemUsageMigrationV2GetUnusedItSystemsBySearchAndOrganizationGuidOrganizationUuidInt32NumberOfItSystemsStringNameContent.');
        }
        if (numberOfItSystems === null || numberOfItSystems === undefined) {
            throw new Error('Required parameter numberOfItSystems was null or undefined when calling gETItSystemUsageMigrationV2GetUnusedItSystemsBySearchAndOrganizationGuidOrganizationUuidInt32NumberOfItSystemsStringNameContent.');
        }

        let localVarQueryParameters = new HttpParams({encoder: this.encoder});
        if (organizationUuid !== undefined && organizationUuid !== null) {
          localVarQueryParameters = this.addToHttpParams(localVarQueryParameters,
            <any>organizationUuid, 'organizationUuid');
        }
        if (numberOfItSystems !== undefined && numberOfItSystems !== null) {
          localVarQueryParameters = this.addToHttpParams(localVarQueryParameters,
            <any>numberOfItSystems, 'numberOfItSystems');
        }
        if (nameContent !== undefined && nameContent !== null) {
          localVarQueryParameters = this.addToHttpParams(localVarQueryParameters,
            <any>nameContent, 'nameContent');
        }

        let localVarHeaders = this.defaultHeaders;

        let localVarHttpHeaderAcceptSelected: string | undefined = options && options.httpHeaderAccept;
        if (localVarHttpHeaderAcceptSelected === undefined) {
            // to determine the Accept header
            const httpHeaderAccepts: string[] = [
                'application/json'
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

        let localVarPath = `/api/v2/internal/it-system-usages/migration/unused-it-systems`;
        return this.httpClient.request<Array<APIIdentityNamePairWithDeactivatedStatusDTO>>('get', `${this.configuration.basePath}${localVarPath}`,
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
     * Perform a migration of the it-system-usage to from the current it-system master data to a new it-system master data
     * @param usageUuid 
     * @param toSystemUuid 
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public pOSTItSystemUsageMigrationV2ExecuteMigrationGuidToSystemUuidGuidUsageUuid(usageUuid: string, toSystemUuid: string, observe?: 'body', reportProgress?: boolean, options?: {httpHeaderAccept?: undefined, context?: HttpContext}): Observable<any>;
    public pOSTItSystemUsageMigrationV2ExecuteMigrationGuidToSystemUuidGuidUsageUuid(usageUuid: string, toSystemUuid: string, observe?: 'response', reportProgress?: boolean, options?: {httpHeaderAccept?: undefined, context?: HttpContext}): Observable<HttpResponse<any>>;
    public pOSTItSystemUsageMigrationV2ExecuteMigrationGuidToSystemUuidGuidUsageUuid(usageUuid: string, toSystemUuid: string, observe?: 'events', reportProgress?: boolean, options?: {httpHeaderAccept?: undefined, context?: HttpContext}): Observable<HttpEvent<any>>;
    public pOSTItSystemUsageMigrationV2ExecuteMigrationGuidToSystemUuidGuidUsageUuid(usageUuid: string, toSystemUuid: string, observe: any = 'body', reportProgress: boolean = false, options?: {httpHeaderAccept?: undefined, context?: HttpContext}): Observable<any> {
        if (usageUuid === null || usageUuid === undefined) {
            throw new Error('Required parameter usageUuid was null or undefined when calling pOSTItSystemUsageMigrationV2ExecuteMigrationGuidToSystemUuidGuidUsageUuid.');
        }
        if (toSystemUuid === null || toSystemUuid === undefined) {
            throw new Error('Required parameter toSystemUuid was null or undefined when calling pOSTItSystemUsageMigrationV2ExecuteMigrationGuidToSystemUuidGuidUsageUuid.');
        }

        let localVarQueryParameters = new HttpParams({encoder: this.encoder});
        if (toSystemUuid !== undefined && toSystemUuid !== null) {
          localVarQueryParameters = this.addToHttpParams(localVarQueryParameters,
            <any>toSystemUuid, 'toSystemUuid');
        }

        let localVarHeaders = this.defaultHeaders;

        let localVarHttpHeaderAcceptSelected: string | undefined = options && options.httpHeaderAccept;
        if (localVarHttpHeaderAcceptSelected === undefined) {
            // to determine the Accept header
            const httpHeaderAccepts: string[] = [
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

        let localVarPath = `/api/v2/internal/it-system-usages/${this.configuration.encodeParam({name: "usageUuid", value: usageUuid, in: "path", style: "simple", explode: false, dataType: "string", dataFormat: "uuid"})}/migration`;
        return this.httpClient.request<any>('post', `${this.configuration.basePath}${localVarPath}`,
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

}