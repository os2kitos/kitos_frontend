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
/* tslint:disable:no-unused-variable member-ordering */

import { Inject, Injectable, Optional }                      from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams,
         HttpResponse, HttpEvent, HttpParameterCodec, HttpContext 
        }       from '@angular/common/http';
import { CustomHttpParameterCodec }                          from '../encoder';
import { Observable }                                        from 'rxjs';

// @ts-ignore
import { APICreateDataProcessingRegistrationRequestDTO } from '../model/aPICreateDataProcessingRegistrationRequestDTO';
// @ts-ignore
import { APIDataProcessingRegistrationResponseDTO } from '../model/aPIDataProcessingRegistrationResponseDTO';
// @ts-ignore
import { APIUpdateDataProcessingRegistrationRequestDTO } from '../model/aPIUpdateDataProcessingRegistrationRequestDTO';

// @ts-ignore
import { BASE_PATH, COLLECTION_FORMATS }                     from '../variables';
import { Configuration }                                     from '../configuration';
import {
    APIV2DataProcessingRegistrationServiceInterface
} from './v2DataProcessingRegistration.serviceInterface';



@Injectable({
  providedIn: 'root'
})
export class APIV2DataProcessingRegistrationService implements APIV2DataProcessingRegistrationServiceInterface {

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
     * Removes an existing data processing registration.
     * @param uuid UUID of the data processing registration
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public dELETEDataProcessingRegistrationV2DeleteDataProcessingRegistrationGuidUuid(uuid: string, observe?: 'body', reportProgress?: boolean, options?: {httpHeaderAccept?: '*/*', context?: HttpContext}): Observable<object>;
    public dELETEDataProcessingRegistrationV2DeleteDataProcessingRegistrationGuidUuid(uuid: string, observe?: 'response', reportProgress?: boolean, options?: {httpHeaderAccept?: '*/*', context?: HttpContext}): Observable<HttpResponse<object>>;
    public dELETEDataProcessingRegistrationV2DeleteDataProcessingRegistrationGuidUuid(uuid: string, observe?: 'events', reportProgress?: boolean, options?: {httpHeaderAccept?: '*/*', context?: HttpContext}): Observable<HttpEvent<object>>;
    public dELETEDataProcessingRegistrationV2DeleteDataProcessingRegistrationGuidUuid(uuid: string, observe: any = 'body', reportProgress: boolean = false, options?: {httpHeaderAccept?: '*/*', context?: HttpContext}): Observable<any> {
        if (uuid === null || uuid === undefined) {
            throw new Error('Required parameter uuid was null or undefined when calling dELETEDataProcessingRegistrationV2DeleteDataProcessingRegistrationGuidUuid.');
        }

        let localVarHeaders = this.defaultHeaders;

        let localVarHttpHeaderAcceptSelected: string | undefined = options && options.httpHeaderAccept;
        if (localVarHttpHeaderAcceptSelected === undefined) {
            // to determine the Accept header
            const httpHeaderAccepts: string[] = [
                '*/*'
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

        let localVarPath = `/api/v2/data-processing-registrations/${this.configuration.encodeParam({name: "uuid", value: uuid, in: "path", style: "simple", explode: false, dataType: "string", dataFormat: "uuid"})}`;
        return this.httpClient.request<object>('delete', `${this.configuration.basePath}${localVarPath}`,
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
     * Returns a specific Data-Processing-Registration
     * @param uuid UUID of Data-Processing-Registration entity
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public gETDataProcessingRegistrationV2GetDataProcessingRegistrationGuidUuid(uuid: string, observe?: 'body', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json', context?: HttpContext}): Observable<APIDataProcessingRegistrationResponseDTO>;
    public gETDataProcessingRegistrationV2GetDataProcessingRegistrationGuidUuid(uuid: string, observe?: 'response', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json', context?: HttpContext}): Observable<HttpResponse<APIDataProcessingRegistrationResponseDTO>>;
    public gETDataProcessingRegistrationV2GetDataProcessingRegistrationGuidUuid(uuid: string, observe?: 'events', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json', context?: HttpContext}): Observable<HttpEvent<APIDataProcessingRegistrationResponseDTO>>;
    public gETDataProcessingRegistrationV2GetDataProcessingRegistrationGuidUuid(uuid: string, observe: any = 'body', reportProgress: boolean = false, options?: {httpHeaderAccept?: 'application/json', context?: HttpContext}): Observable<any> {
        if (uuid === null || uuid === undefined) {
            throw new Error('Required parameter uuid was null or undefined when calling gETDataProcessingRegistrationV2GetDataProcessingRegistrationGuidUuid.');
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

        let localVarPath = `/api/v2/data-processing-registrations/${this.configuration.encodeParam({name: "uuid", value: uuid, in: "path", style: "simple", explode: false, dataType: "string", dataFormat: "uuid"})}`;
        return this.httpClient.request<APIDataProcessingRegistrationResponseDTO>('get', `${this.configuration.basePath}${localVarPath}`,
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
     * Returns all Data-Processing-Registrations available to the user
     * @param organizationUuid Organization UUID filter
     * @param systemUuid System UUID filter
     * @param systemUsageUuid SystemUsage UUID filter
     * @param dataProcessorUuid UUID of a data processor in the registration
     * @param subDataProcessorUuid UUID of a sub data processor in the registration
     * @param agreementConcluded Filter based on whether or not an agreement has been concluded
     * @param changedSinceGtEq Include only changes which were LastModified (UTC) is equal to or greater than the provided value
     * @param page 0-based page number. Use this parameter to page through the requested collection.  Offset in the source collection will be (pageSize * page)  Range: [0,2^31] Default: 0
     * @param pageSize Size of the page referred by \&#39;page\&#39;.  Range: [1,100] Default: 100.
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public gETDataProcessingRegistrationV2GetDataProcessingRegistrationsBoundedPaginationQueryPaginationQueryNullable1AgreementConcludedNullable1ChangedSinceGtEqNullable1DataProcessorUuidNullable1OrganizationUuidNullable1SubDataProcessorUuidNullable1SystemUsageUuidNullable1SystemUuid(organizationUuid?: string, systemUuid?: string, systemUsageUuid?: string, dataProcessorUuid?: string, subDataProcessorUuid?: string, agreementConcluded?: boolean, changedSinceGtEq?: string, page?: number, pageSize?: number, observe?: 'body', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json', context?: HttpContext}): Observable<Array<APIDataProcessingRegistrationResponseDTO>>;
    public gETDataProcessingRegistrationV2GetDataProcessingRegistrationsBoundedPaginationQueryPaginationQueryNullable1AgreementConcludedNullable1ChangedSinceGtEqNullable1DataProcessorUuidNullable1OrganizationUuidNullable1SubDataProcessorUuidNullable1SystemUsageUuidNullable1SystemUuid(organizationUuid?: string, systemUuid?: string, systemUsageUuid?: string, dataProcessorUuid?: string, subDataProcessorUuid?: string, agreementConcluded?: boolean, changedSinceGtEq?: string, page?: number, pageSize?: number, observe?: 'response', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json', context?: HttpContext}): Observable<HttpResponse<Array<APIDataProcessingRegistrationResponseDTO>>>;
    public gETDataProcessingRegistrationV2GetDataProcessingRegistrationsBoundedPaginationQueryPaginationQueryNullable1AgreementConcludedNullable1ChangedSinceGtEqNullable1DataProcessorUuidNullable1OrganizationUuidNullable1SubDataProcessorUuidNullable1SystemUsageUuidNullable1SystemUuid(organizationUuid?: string, systemUuid?: string, systemUsageUuid?: string, dataProcessorUuid?: string, subDataProcessorUuid?: string, agreementConcluded?: boolean, changedSinceGtEq?: string, page?: number, pageSize?: number, observe?: 'events', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json', context?: HttpContext}): Observable<HttpEvent<Array<APIDataProcessingRegistrationResponseDTO>>>;
    public gETDataProcessingRegistrationV2GetDataProcessingRegistrationsBoundedPaginationQueryPaginationQueryNullable1AgreementConcludedNullable1ChangedSinceGtEqNullable1DataProcessorUuidNullable1OrganizationUuidNullable1SubDataProcessorUuidNullable1SystemUsageUuidNullable1SystemUuid(organizationUuid?: string, systemUuid?: string, systemUsageUuid?: string, dataProcessorUuid?: string, subDataProcessorUuid?: string, agreementConcluded?: boolean, changedSinceGtEq?: string, page?: number, pageSize?: number, observe: any = 'body', reportProgress: boolean = false, options?: {httpHeaderAccept?: 'application/json', context?: HttpContext}): Observable<any> {

        let localVarQueryParameters = new HttpParams({encoder: this.encoder});
        if (organizationUuid !== undefined && organizationUuid !== null) {
          localVarQueryParameters = this.addToHttpParams(localVarQueryParameters,
            <any>organizationUuid, 'organizationUuid');
        }
        if (systemUuid !== undefined && systemUuid !== null) {
          localVarQueryParameters = this.addToHttpParams(localVarQueryParameters,
            <any>systemUuid, 'systemUuid');
        }
        if (systemUsageUuid !== undefined && systemUsageUuid !== null) {
          localVarQueryParameters = this.addToHttpParams(localVarQueryParameters,
            <any>systemUsageUuid, 'systemUsageUuid');
        }
        if (dataProcessorUuid !== undefined && dataProcessorUuid !== null) {
          localVarQueryParameters = this.addToHttpParams(localVarQueryParameters,
            <any>dataProcessorUuid, 'dataProcessorUuid');
        }
        if (subDataProcessorUuid !== undefined && subDataProcessorUuid !== null) {
          localVarQueryParameters = this.addToHttpParams(localVarQueryParameters,
            <any>subDataProcessorUuid, 'subDataProcessorUuid');
        }
        if (agreementConcluded !== undefined && agreementConcluded !== null) {
          localVarQueryParameters = this.addToHttpParams(localVarQueryParameters,
            <any>agreementConcluded, 'agreementConcluded');
        }
        if (changedSinceGtEq !== undefined && changedSinceGtEq !== null) {
          localVarQueryParameters = this.addToHttpParams(localVarQueryParameters,
            <any>changedSinceGtEq, 'changedSinceGtEq');
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

        let localVarPath = `/api/v2/data-processing-registrations`;
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
     * Allows partial updates of an existing data processing registration using json merge patch semantics (RFC7396)
     * @param uuid UUID of the data processing registration
     * @param request 
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public pATCHDataProcessingRegistrationV2PatchDataProcessingRegistrationUpdateDataProcessingRegistrationRequestDTORequestGuidUuid(uuid: string, request: APIUpdateDataProcessingRegistrationRequestDTO, observe?: 'body', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json', context?: HttpContext}): Observable<APIDataProcessingRegistrationResponseDTO>;
    public pATCHDataProcessingRegistrationV2PatchDataProcessingRegistrationUpdateDataProcessingRegistrationRequestDTORequestGuidUuid(uuid: string, request: APIUpdateDataProcessingRegistrationRequestDTO, observe?: 'response', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json', context?: HttpContext}): Observable<HttpResponse<APIDataProcessingRegistrationResponseDTO>>;
    public pATCHDataProcessingRegistrationV2PatchDataProcessingRegistrationUpdateDataProcessingRegistrationRequestDTORequestGuidUuid(uuid: string, request: APIUpdateDataProcessingRegistrationRequestDTO, observe?: 'events', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json', context?: HttpContext}): Observable<HttpEvent<APIDataProcessingRegistrationResponseDTO>>;
    public pATCHDataProcessingRegistrationV2PatchDataProcessingRegistrationUpdateDataProcessingRegistrationRequestDTORequestGuidUuid(uuid: string, request: APIUpdateDataProcessingRegistrationRequestDTO, observe: any = 'body', reportProgress: boolean = false, options?: {httpHeaderAccept?: 'application/json', context?: HttpContext}): Observable<any> {
        if (uuid === null || uuid === undefined) {
            throw new Error('Required parameter uuid was null or undefined when calling pATCHDataProcessingRegistrationV2PatchDataProcessingRegistrationUpdateDataProcessingRegistrationRequestDTORequestGuidUuid.');
        }
        if (request === null || request === undefined) {
            throw new Error('Required parameter request was null or undefined when calling pATCHDataProcessingRegistrationV2PatchDataProcessingRegistrationUpdateDataProcessingRegistrationRequestDTORequestGuidUuid.');
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

        let localVarPath = `/api/v2/data-processing-registrations/${this.configuration.encodeParam({name: "uuid", value: uuid, in: "path", style: "simple", explode: false, dataType: "string", dataFormat: "uuid"})}`;
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
     * Create a new data processing registration
     * @param request 
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public pOSTDataProcessingRegistrationV2PostDataProcessingRegistrationCreateDataProcessingRegistrationRequestDTORequest(request: APICreateDataProcessingRegistrationRequestDTO, observe?: 'body', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json', context?: HttpContext}): Observable<object>;
    public pOSTDataProcessingRegistrationV2PostDataProcessingRegistrationCreateDataProcessingRegistrationRequestDTORequest(request: APICreateDataProcessingRegistrationRequestDTO, observe?: 'response', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json', context?: HttpContext}): Observable<HttpResponse<object>>;
    public pOSTDataProcessingRegistrationV2PostDataProcessingRegistrationCreateDataProcessingRegistrationRequestDTORequest(request: APICreateDataProcessingRegistrationRequestDTO, observe?: 'events', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json', context?: HttpContext}): Observable<HttpEvent<object>>;
    public pOSTDataProcessingRegistrationV2PostDataProcessingRegistrationCreateDataProcessingRegistrationRequestDTORequest(request: APICreateDataProcessingRegistrationRequestDTO, observe: any = 'body', reportProgress: boolean = false, options?: {httpHeaderAccept?: 'application/json', context?: HttpContext}): Observable<any> {
        if (request === null || request === undefined) {
            throw new Error('Required parameter request was null or undefined when calling pOSTDataProcessingRegistrationV2PostDataProcessingRegistrationCreateDataProcessingRegistrationRequestDTORequest.');
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

        let localVarPath = `/api/v2/data-processing-registrations`;
        return this.httpClient.request<object>('post', `${this.configuration.basePath}${localVarPath}`,
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
     * Perform a full update of an existing data processing registration.  Note: PUT expects a full version of the updated registration. For partial updates, please use PATCH.
     * @param uuid UUID of the data processing registration
     * @param request 
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public pUTDataProcessingRegistrationV2PutDataProcessingRegistrationUpdateDataProcessingRegistrationRequestDTORequestGuidUuid(uuid: string, request: APIUpdateDataProcessingRegistrationRequestDTO, observe?: 'body', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json', context?: HttpContext}): Observable<APIDataProcessingRegistrationResponseDTO>;
    public pUTDataProcessingRegistrationV2PutDataProcessingRegistrationUpdateDataProcessingRegistrationRequestDTORequestGuidUuid(uuid: string, request: APIUpdateDataProcessingRegistrationRequestDTO, observe?: 'response', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json', context?: HttpContext}): Observable<HttpResponse<APIDataProcessingRegistrationResponseDTO>>;
    public pUTDataProcessingRegistrationV2PutDataProcessingRegistrationUpdateDataProcessingRegistrationRequestDTORequestGuidUuid(uuid: string, request: APIUpdateDataProcessingRegistrationRequestDTO, observe?: 'events', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json', context?: HttpContext}): Observable<HttpEvent<APIDataProcessingRegistrationResponseDTO>>;
    public pUTDataProcessingRegistrationV2PutDataProcessingRegistrationUpdateDataProcessingRegistrationRequestDTORequestGuidUuid(uuid: string, request: APIUpdateDataProcessingRegistrationRequestDTO, observe: any = 'body', reportProgress: boolean = false, options?: {httpHeaderAccept?: 'application/json', context?: HttpContext}): Observable<any> {
        if (uuid === null || uuid === undefined) {
            throw new Error('Required parameter uuid was null or undefined when calling pUTDataProcessingRegistrationV2PutDataProcessingRegistrationUpdateDataProcessingRegistrationRequestDTORequestGuidUuid.');
        }
        if (request === null || request === undefined) {
            throw new Error('Required parameter request was null or undefined when calling pUTDataProcessingRegistrationV2PutDataProcessingRegistrationUpdateDataProcessingRegistrationRequestDTORequestGuidUuid.');
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

        let localVarPath = `/api/v2/data-processing-registrations/${this.configuration.encodeParam({name: "uuid", value: uuid, in: "path", style: "simple", explode: false, dataType: "string", dataFormat: "uuid"})}`;
        return this.httpClient.request<APIDataProcessingRegistrationResponseDTO>('put', `${this.configuration.basePath}${localVarPath}`,
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
