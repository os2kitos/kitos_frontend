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
import { APIDataProcessingRegistrationResponseDTO } from '../model/aPIDataProcessingRegistrationResponseDTO';
// @ts-ignore
import { APIExtendedRoleAssignmentResponseDTO } from '../model/aPIExtendedRoleAssignmentResponseDTO';
// @ts-ignore
import { APIIdentityNamePairResponseDTO } from '../model/aPIIdentityNamePairResponseDTO';
// @ts-ignore
import { APIRoleAssignmentRequestDTO } from '../model/aPIRoleAssignmentRequestDTO';
// @ts-ignore
import { APIShallowOrganizationResponseDTO } from '../model/aPIShallowOrganizationResponseDTO';

// @ts-ignore
import { BASE_PATH, COLLECTION_FORMATS }                     from '../variables';
import { Configuration }                                     from '../configuration';


export interface GetManyDataProcessingRegistrationInternalV2GetAddRoleAssignmentsRequestParams {
    dprUuid: string;
}

export interface GetManyDataProcessingRegistrationInternalV2GetAvailableDataProcessorsRequestParams {
    dprUuid: string;
    nameQuery?: string;
    pageSize?: number;
}

export interface GetManyDataProcessingRegistrationInternalV2GetAvailableSubDataProcessorsRequestParams {
    dprUuid: string;
    nameQuery?: string;
    pageSize?: number;
}

export interface GetManyDataProcessingRegistrationInternalV2GetAvailableSystemUsagesRequestParams {
    dprUuid: string;
    nameQuery?: string;
    pageSize?: number;
}

export interface GetManyDataProcessingRegistrationInternalV2GetItSystemsRequestParams {
    organizationUuid: string;
    /** Include only dprs with a name that contains the content in the parameter */
    nameContains?: string;
    /** Ordering property */
    orderByProperty?: 'CreationOrder' | 'Name' | 'LastChanged';
    /** 0-based page number. Use this parameter to page through the requested collection.  Offset in the source collection will be (pageSize * page)  Range: [0,2^31] Default: 0 */
    page?: number;
    /** Size of the page referred by \&#39;page\&#39;.  Range: [1,250] Default: 250. */
    pageSize?: number;
}

export interface PatchSingleDataProcessingRegistrationInternalV2PatchAddRoleAssignmentRequestParams {
    dprUuid: string;
    request: APIRoleAssignmentRequestDTO;
}

export interface PatchSingleDataProcessingRegistrationInternalV2PatchRemoveRoleAssignmentRequestParams {
    dprUuid: string;
    request: APIRoleAssignmentRequestDTO;
}


@Injectable({
  providedIn: 'root'
})
export class APIV2DataProcessingRegistrationInternalINTERNALService {

    protected basePath = 'https://localhost:44300';
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
     * Get roles assigned to the data processing registration
     * @param requestParameters
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public getManyDataProcessingRegistrationInternalV2GetAddRoleAssignments(requestParameters: GetManyDataProcessingRegistrationInternalV2GetAddRoleAssignmentsRequestParams, observe?: 'body', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json', context?: HttpContext}): Observable<Array<APIExtendedRoleAssignmentResponseDTO>>;
    public getManyDataProcessingRegistrationInternalV2GetAddRoleAssignments(requestParameters: GetManyDataProcessingRegistrationInternalV2GetAddRoleAssignmentsRequestParams, observe?: 'response', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json', context?: HttpContext}): Observable<HttpResponse<Array<APIExtendedRoleAssignmentResponseDTO>>>;
    public getManyDataProcessingRegistrationInternalV2GetAddRoleAssignments(requestParameters: GetManyDataProcessingRegistrationInternalV2GetAddRoleAssignmentsRequestParams, observe?: 'events', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json', context?: HttpContext}): Observable<HttpEvent<Array<APIExtendedRoleAssignmentResponseDTO>>>;
    public getManyDataProcessingRegistrationInternalV2GetAddRoleAssignments(requestParameters: GetManyDataProcessingRegistrationInternalV2GetAddRoleAssignmentsRequestParams, observe: any = 'body', reportProgress: boolean = false, options?: {httpHeaderAccept?: 'application/json', context?: HttpContext}): Observable<any> {
        const dprUuid = requestParameters.dprUuid;
        if (dprUuid === null || dprUuid === undefined) {
            throw new Error('Required parameter dprUuid was null or undefined when calling getManyDataProcessingRegistrationInternalV2GetAddRoleAssignments.');
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

        let localVarPath = `/api/v2/internal/data-processing-registrations/${this.configuration.encodeParam({name: "dprUuid", value: dprUuid, in: "path", style: "simple", explode: false, dataType: "string", dataFormat: "uuid"})}/roles`;
        return this.httpClient.request<Array<APIExtendedRoleAssignmentResponseDTO>>('get', `${this.configuration.basePath}${localVarPath}`,
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
     * @param requestParameters
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public getManyDataProcessingRegistrationInternalV2GetAvailableDataProcessors(requestParameters: GetManyDataProcessingRegistrationInternalV2GetAvailableDataProcessorsRequestParams, observe?: 'body', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json', context?: HttpContext}): Observable<Array<APIShallowOrganizationResponseDTO>>;
    public getManyDataProcessingRegistrationInternalV2GetAvailableDataProcessors(requestParameters: GetManyDataProcessingRegistrationInternalV2GetAvailableDataProcessorsRequestParams, observe?: 'response', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json', context?: HttpContext}): Observable<HttpResponse<Array<APIShallowOrganizationResponseDTO>>>;
    public getManyDataProcessingRegistrationInternalV2GetAvailableDataProcessors(requestParameters: GetManyDataProcessingRegistrationInternalV2GetAvailableDataProcessorsRequestParams, observe?: 'events', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json', context?: HttpContext}): Observable<HttpEvent<Array<APIShallowOrganizationResponseDTO>>>;
    public getManyDataProcessingRegistrationInternalV2GetAvailableDataProcessors(requestParameters: GetManyDataProcessingRegistrationInternalV2GetAvailableDataProcessorsRequestParams, observe: any = 'body', reportProgress: boolean = false, options?: {httpHeaderAccept?: 'application/json', context?: HttpContext}): Observable<any> {
        const dprUuid = requestParameters.dprUuid;
        if (dprUuid === null || dprUuid === undefined) {
            throw new Error('Required parameter dprUuid was null or undefined when calling getManyDataProcessingRegistrationInternalV2GetAvailableDataProcessors.');
        }
        const nameQuery = requestParameters.nameQuery;
        const pageSize = requestParameters.pageSize;

        let localVarQueryParameters = new HttpParams({encoder: this.encoder});
        if (nameQuery !== undefined && nameQuery !== null) {
          localVarQueryParameters = this.addToHttpParams(localVarQueryParameters,
            <any>nameQuery, 'nameQuery');
        }
        if (pageSize !== undefined && pageSize !== null) {
          localVarQueryParameters = this.addToHttpParams(localVarQueryParameters,
            <any>pageSize, 'pageSize');
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

        let localVarPath = `/api/v2/internal/data-processing-registrations/${this.configuration.encodeParam({name: "dprUuid", value: dprUuid, in: "path", style: "simple", explode: false, dataType: "string", dataFormat: "uuid"})}/data-processors/available`;
        return this.httpClient.request<Array<APIShallowOrganizationResponseDTO>>('get', `${this.configuration.basePath}${localVarPath}`,
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
     * @param requestParameters
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public getManyDataProcessingRegistrationInternalV2GetAvailableSubDataProcessors(requestParameters: GetManyDataProcessingRegistrationInternalV2GetAvailableSubDataProcessorsRequestParams, observe?: 'body', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json', context?: HttpContext}): Observable<Array<APIShallowOrganizationResponseDTO>>;
    public getManyDataProcessingRegistrationInternalV2GetAvailableSubDataProcessors(requestParameters: GetManyDataProcessingRegistrationInternalV2GetAvailableSubDataProcessorsRequestParams, observe?: 'response', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json', context?: HttpContext}): Observable<HttpResponse<Array<APIShallowOrganizationResponseDTO>>>;
    public getManyDataProcessingRegistrationInternalV2GetAvailableSubDataProcessors(requestParameters: GetManyDataProcessingRegistrationInternalV2GetAvailableSubDataProcessorsRequestParams, observe?: 'events', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json', context?: HttpContext}): Observable<HttpEvent<Array<APIShallowOrganizationResponseDTO>>>;
    public getManyDataProcessingRegistrationInternalV2GetAvailableSubDataProcessors(requestParameters: GetManyDataProcessingRegistrationInternalV2GetAvailableSubDataProcessorsRequestParams, observe: any = 'body', reportProgress: boolean = false, options?: {httpHeaderAccept?: 'application/json', context?: HttpContext}): Observable<any> {
        const dprUuid = requestParameters.dprUuid;
        if (dprUuid === null || dprUuid === undefined) {
            throw new Error('Required parameter dprUuid was null or undefined when calling getManyDataProcessingRegistrationInternalV2GetAvailableSubDataProcessors.');
        }
        const nameQuery = requestParameters.nameQuery;
        const pageSize = requestParameters.pageSize;

        let localVarQueryParameters = new HttpParams({encoder: this.encoder});
        if (nameQuery !== undefined && nameQuery !== null) {
          localVarQueryParameters = this.addToHttpParams(localVarQueryParameters,
            <any>nameQuery, 'nameQuery');
        }
        if (pageSize !== undefined && pageSize !== null) {
          localVarQueryParameters = this.addToHttpParams(localVarQueryParameters,
            <any>pageSize, 'pageSize');
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

        let localVarPath = `/api/v2/internal/data-processing-registrations/${this.configuration.encodeParam({name: "dprUuid", value: dprUuid, in: "path", style: "simple", explode: false, dataType: "string", dataFormat: "uuid"})}/sub-data-processors/available`;
        return this.httpClient.request<Array<APIShallowOrganizationResponseDTO>>('get', `${this.configuration.basePath}${localVarPath}`,
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
     * @param requestParameters
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public getManyDataProcessingRegistrationInternalV2GetAvailableSystemUsages(requestParameters: GetManyDataProcessingRegistrationInternalV2GetAvailableSystemUsagesRequestParams, observe?: 'body', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json', context?: HttpContext}): Observable<Array<APIIdentityNamePairResponseDTO>>;
    public getManyDataProcessingRegistrationInternalV2GetAvailableSystemUsages(requestParameters: GetManyDataProcessingRegistrationInternalV2GetAvailableSystemUsagesRequestParams, observe?: 'response', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json', context?: HttpContext}): Observable<HttpResponse<Array<APIIdentityNamePairResponseDTO>>>;
    public getManyDataProcessingRegistrationInternalV2GetAvailableSystemUsages(requestParameters: GetManyDataProcessingRegistrationInternalV2GetAvailableSystemUsagesRequestParams, observe?: 'events', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json', context?: HttpContext}): Observable<HttpEvent<Array<APIIdentityNamePairResponseDTO>>>;
    public getManyDataProcessingRegistrationInternalV2GetAvailableSystemUsages(requestParameters: GetManyDataProcessingRegistrationInternalV2GetAvailableSystemUsagesRequestParams, observe: any = 'body', reportProgress: boolean = false, options?: {httpHeaderAccept?: 'application/json', context?: HttpContext}): Observable<any> {
        const dprUuid = requestParameters.dprUuid;
        if (dprUuid === null || dprUuid === undefined) {
            throw new Error('Required parameter dprUuid was null or undefined when calling getManyDataProcessingRegistrationInternalV2GetAvailableSystemUsages.');
        }
        const nameQuery = requestParameters.nameQuery;
        const pageSize = requestParameters.pageSize;

        let localVarQueryParameters = new HttpParams({encoder: this.encoder});
        if (nameQuery !== undefined && nameQuery !== null) {
          localVarQueryParameters = this.addToHttpParams(localVarQueryParameters,
            <any>nameQuery, 'nameQuery');
        }
        if (pageSize !== undefined && pageSize !== null) {
          localVarQueryParameters = this.addToHttpParams(localVarQueryParameters,
            <any>pageSize, 'pageSize');
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

        let localVarPath = `/api/v2/internal/data-processing-registrations/${this.configuration.encodeParam({name: "dprUuid", value: dprUuid, in: "path", style: "simple", explode: false, dataType: "string", dataFormat: "uuid"})}/system-usages/available`;
        return this.httpClient.request<Array<APIIdentityNamePairResponseDTO>>('get', `${this.configuration.basePath}${localVarPath}`,
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
     * Shallow search endpoint returning all Data Processing Registrations available to the current user
     * @param requestParameters
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public getManyDataProcessingRegistrationInternalV2GetItSystems(requestParameters: GetManyDataProcessingRegistrationInternalV2GetItSystemsRequestParams, observe?: 'body', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json', context?: HttpContext}): Observable<Array<APIDataProcessingRegistrationResponseDTO>>;
    public getManyDataProcessingRegistrationInternalV2GetItSystems(requestParameters: GetManyDataProcessingRegistrationInternalV2GetItSystemsRequestParams, observe?: 'response', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json', context?: HttpContext}): Observable<HttpResponse<Array<APIDataProcessingRegistrationResponseDTO>>>;
    public getManyDataProcessingRegistrationInternalV2GetItSystems(requestParameters: GetManyDataProcessingRegistrationInternalV2GetItSystemsRequestParams, observe?: 'events', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json', context?: HttpContext}): Observable<HttpEvent<Array<APIDataProcessingRegistrationResponseDTO>>>;
    public getManyDataProcessingRegistrationInternalV2GetItSystems(requestParameters: GetManyDataProcessingRegistrationInternalV2GetItSystemsRequestParams, observe: any = 'body', reportProgress: boolean = false, options?: {httpHeaderAccept?: 'application/json', context?: HttpContext}): Observable<any> {
        const organizationUuid = requestParameters.organizationUuid;
        if (organizationUuid === null || organizationUuid === undefined) {
            throw new Error('Required parameter organizationUuid was null or undefined when calling getManyDataProcessingRegistrationInternalV2GetItSystems.');
        }
        const nameContains = requestParameters.nameContains;
        const orderByProperty = requestParameters.orderByProperty;
        const page = requestParameters.page;
        const pageSize = requestParameters.pageSize;

        let localVarQueryParameters = new HttpParams({encoder: this.encoder});
        if (organizationUuid !== undefined && organizationUuid !== null) {
          localVarQueryParameters = this.addToHttpParams(localVarQueryParameters,
            <any>organizationUuid, 'organizationUuid');
        }
        if (nameContains !== undefined && nameContains !== null) {
          localVarQueryParameters = this.addToHttpParams(localVarQueryParameters,
            <any>nameContains, 'nameContains');
        }
        if (orderByProperty !== undefined && orderByProperty !== null) {
          localVarQueryParameters = this.addToHttpParams(localVarQueryParameters,
            <any>orderByProperty, 'orderByProperty');
        }
        if (page !== undefined && page !== null) {
          localVarQueryParameters = this.addToHttpParams(localVarQueryParameters,
            <any>page, 'page');
        }
        if (pageSize !== undefined && pageSize !== null) {
          localVarQueryParameters = this.addToHttpParams(localVarQueryParameters,
            <any>pageSize, 'pageSize');
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

        let localVarPath = `/api/v2/internal/data-processing-registrations/search`;
        return this.httpClient.request<Array<APIDataProcessingRegistrationResponseDTO>>('get', `${this.configuration.basePath}${localVarPath}`,
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
     * @param requestParameters
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public patchSingleDataProcessingRegistrationInternalV2PatchAddRoleAssignment(requestParameters: PatchSingleDataProcessingRegistrationInternalV2PatchAddRoleAssignmentRequestParams, observe?: 'body', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json', context?: HttpContext}): Observable<APIDataProcessingRegistrationResponseDTO>;
    public patchSingleDataProcessingRegistrationInternalV2PatchAddRoleAssignment(requestParameters: PatchSingleDataProcessingRegistrationInternalV2PatchAddRoleAssignmentRequestParams, observe?: 'response', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json', context?: HttpContext}): Observable<HttpResponse<APIDataProcessingRegistrationResponseDTO>>;
    public patchSingleDataProcessingRegistrationInternalV2PatchAddRoleAssignment(requestParameters: PatchSingleDataProcessingRegistrationInternalV2PatchAddRoleAssignmentRequestParams, observe?: 'events', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json', context?: HttpContext}): Observable<HttpEvent<APIDataProcessingRegistrationResponseDTO>>;
    public patchSingleDataProcessingRegistrationInternalV2PatchAddRoleAssignment(requestParameters: PatchSingleDataProcessingRegistrationInternalV2PatchAddRoleAssignmentRequestParams, observe: any = 'body', reportProgress: boolean = false, options?: {httpHeaderAccept?: 'application/json', context?: HttpContext}): Observable<any> {
        const dprUuid = requestParameters.dprUuid;
        if (dprUuid === null || dprUuid === undefined) {
            throw new Error('Required parameter dprUuid was null or undefined when calling patchSingleDataProcessingRegistrationInternalV2PatchAddRoleAssignment.');
        }
        const request = requestParameters.request;
        if (request === null || request === undefined) {
            throw new Error('Required parameter request was null or undefined when calling patchSingleDataProcessingRegistrationInternalV2PatchAddRoleAssignment.');
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


        // to determine the Content-Type header
        const consumes: string[] = [
            'application/merge-patch+json',
            'application/json'
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

        let localVarPath = `/api/v2/internal/data-processing-registrations/${this.configuration.encodeParam({name: "dprUuid", value: dprUuid, in: "path", style: "simple", explode: false, dataType: "string", dataFormat: "uuid"})}/roles/add`;
        return this.httpClient.request<APIDataProcessingRegistrationResponseDTO>('patch', `${this.configuration.basePath}${localVarPath}`,
            {
                context: localVarHttpContext,
                body: request,
                responseType: <any>responseType_,
                withCredentials: this.configuration.withCredentials,
                headers: localVarHeaders,
                observe: observe,
                reportProgress: reportProgress
            }
        );
    }

    /**
     * Remove an existing role assignment to the data processing registration
     * @param requestParameters
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public patchSingleDataProcessingRegistrationInternalV2PatchRemoveRoleAssignment(requestParameters: PatchSingleDataProcessingRegistrationInternalV2PatchRemoveRoleAssignmentRequestParams, observe?: 'body', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json', context?: HttpContext}): Observable<APIDataProcessingRegistrationResponseDTO>;
    public patchSingleDataProcessingRegistrationInternalV2PatchRemoveRoleAssignment(requestParameters: PatchSingleDataProcessingRegistrationInternalV2PatchRemoveRoleAssignmentRequestParams, observe?: 'response', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json', context?: HttpContext}): Observable<HttpResponse<APIDataProcessingRegistrationResponseDTO>>;
    public patchSingleDataProcessingRegistrationInternalV2PatchRemoveRoleAssignment(requestParameters: PatchSingleDataProcessingRegistrationInternalV2PatchRemoveRoleAssignmentRequestParams, observe?: 'events', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json', context?: HttpContext}): Observable<HttpEvent<APIDataProcessingRegistrationResponseDTO>>;
    public patchSingleDataProcessingRegistrationInternalV2PatchRemoveRoleAssignment(requestParameters: PatchSingleDataProcessingRegistrationInternalV2PatchRemoveRoleAssignmentRequestParams, observe: any = 'body', reportProgress: boolean = false, options?: {httpHeaderAccept?: 'application/json', context?: HttpContext}): Observable<any> {
        const dprUuid = requestParameters.dprUuid;
        if (dprUuid === null || dprUuid === undefined) {
            throw new Error('Required parameter dprUuid was null or undefined when calling patchSingleDataProcessingRegistrationInternalV2PatchRemoveRoleAssignment.');
        }
        const request = requestParameters.request;
        if (request === null || request === undefined) {
            throw new Error('Required parameter request was null or undefined when calling patchSingleDataProcessingRegistrationInternalV2PatchRemoveRoleAssignment.');
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


        // to determine the Content-Type header
        const consumes: string[] = [
            'application/merge-patch+json',
            'application/json'
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

        let localVarPath = `/api/v2/internal/data-processing-registrations/${this.configuration.encodeParam({name: "dprUuid", value: dprUuid, in: "path", style: "simple", explode: false, dataType: "string", dataFormat: "uuid"})}/roles/remove`;
        return this.httpClient.request<APIDataProcessingRegistrationResponseDTO>('patch', `${this.configuration.basePath}${localVarPath}`,
            {
                context: localVarHttpContext,
                body: request,
                responseType: <any>responseType_,
                withCredentials: this.configuration.withCredentials,
                headers: localVarHeaders,
                observe: observe,
                reportProgress: reportProgress
            }
        );
    }

}
