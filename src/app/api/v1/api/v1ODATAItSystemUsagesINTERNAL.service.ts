/**
 * OS2Kitos API - V1
 * <b><i>OBS: Dokumentation for V2 findes ved at skifte version på dokumentet til 2 øverst på siden</i></b><br/><br/><b>BEMÆRK: Ekstern Adgang TIL størstedelen af API V1 LUKKES. <a href=\'https://os2web.atlassian.net/wiki/spaces/KITOS/pages/657293331/API+Design+V1#Varsling-om-lukning\'>LÆS MERE HER</a>.</b><br/><br/><b>BEMÆRK: Lukningen påvirker ikke authorize endpointet</b><br/><br/>
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
import { HttpClient, HttpHeaders, HttpParams, HttpResponse, HttpEvent, HttpParameterCodec, HttpContext }       from '@angular/common/http';
import { CustomHttpParameterCodec }                          from '../encoder';
import { Observable }                                        from 'rxjs';

// @ts-ignore
import { APIItSystemUsageIEnumerableODataResponse } from '../model/aPIItSystemUsageIEnumerableODataResponse';

// @ts-ignore
import { BASE_PATH, COLLECTION_FORMATS }                     from '../variables';
import { Configuration }                                     from '../configuration';


export interface GetSingleItSystemUsagesGetItSystemsByOrgkeyRequestParams {
    orgKey: number;
    /** Expands related entities inline. */
    $expand?: string;
    /** Filters the results, based on a Boolean condition. */
    $filter?: string;
    /** Selects which properties to include in the response. */
    $select?: string;
    /** Sorts the results. */
    $orderby?: string;
    /** Returns only the first n results. */
    $top?: number;
    /** Skips the first n results. */
    $skip?: number;
    /** Includes a count of the matching results in the response. */
    $count?: boolean;
}

export interface GetSingleItSystemUsagesGetV1RequestParams {
    /** Expands related entities inline. */
    $expand?: string;
    /** Filters the results, based on a Boolean condition. */
    $filter?: string;
    /** Selects which properties to include in the response. */
    $select?: string;
    /** Sorts the results. */
    $orderby?: string;
    /** Returns only the first n results. */
    $top?: number;
    /** Skips the first n results. */
    $skip?: number;
    /** Includes a count of the matching results in the response. */
    $count?: boolean;
}

export interface GetSingleItSystemUsagesGetV1ByIdRequestParams {
    /** key: Id */
    id: number;
    /** Expands related entities inline. */
    $expand?: string;
    /** Selects which properties to include in the response. */
    $select?: string;
}


@Injectable({
  providedIn: 'root'
})
export class APIV1ODATAItSystemUsagesINTERNALService {

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
     * Henter alle organisationens IT-Systemanvendelser.
     * @param requestParameters
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public getSingleItSystemUsagesGetItSystemsByOrgkey(requestParameters: GetSingleItSystemUsagesGetItSystemsByOrgkeyRequestParams, observe?: 'body', reportProgress?: boolean, options?: {httpHeaderAccept?: '*/*', context?: HttpContext}): Observable<APIItSystemUsageIEnumerableODataResponse>;
    public getSingleItSystemUsagesGetItSystemsByOrgkey(requestParameters: GetSingleItSystemUsagesGetItSystemsByOrgkeyRequestParams, observe?: 'response', reportProgress?: boolean, options?: {httpHeaderAccept?: '*/*', context?: HttpContext}): Observable<HttpResponse<APIItSystemUsageIEnumerableODataResponse>>;
    public getSingleItSystemUsagesGetItSystemsByOrgkey(requestParameters: GetSingleItSystemUsagesGetItSystemsByOrgkeyRequestParams, observe?: 'events', reportProgress?: boolean, options?: {httpHeaderAccept?: '*/*', context?: HttpContext}): Observable<HttpEvent<APIItSystemUsageIEnumerableODataResponse>>;
    public getSingleItSystemUsagesGetItSystemsByOrgkey(requestParameters: GetSingleItSystemUsagesGetItSystemsByOrgkeyRequestParams, observe: any = 'body', reportProgress: boolean = false, options?: {httpHeaderAccept?: '*/*', context?: HttpContext}): Observable<any> {
        const orgKey = requestParameters.orgKey;
        if (orgKey === null || orgKey === undefined) {
            throw new Error('Required parameter orgKey was null or undefined when calling getSingleItSystemUsagesGetItSystemsByOrgkey.');
        }
        const $expand = requestParameters.$expand;
        const $filter = requestParameters.$filter;
        const $select = requestParameters.$select;
        const $orderby = requestParameters.$orderby;
        const $top = requestParameters.$top;
        const $skip = requestParameters.$skip;
        const $count = requestParameters.$count;

        let localVarQueryParameters = new HttpParams({encoder: this.encoder});
        if ($expand !== undefined && $expand !== null) {
          localVarQueryParameters = this.addToHttpParams(localVarQueryParameters,
            <any>$expand, '$expand');
        }
        if ($filter !== undefined && $filter !== null) {
          localVarQueryParameters = this.addToHttpParams(localVarQueryParameters,
            <any>$filter, '$filter');
        }
        if ($select !== undefined && $select !== null) {
          localVarQueryParameters = this.addToHttpParams(localVarQueryParameters,
            <any>$select, '$select');
        }
        if ($orderby !== undefined && $orderby !== null) {
          localVarQueryParameters = this.addToHttpParams(localVarQueryParameters,
            <any>$orderby, '$orderby');
        }
        if ($top !== undefined && $top !== null) {
          localVarQueryParameters = this.addToHttpParams(localVarQueryParameters,
            <any>$top, '$top');
        }
        if ($skip !== undefined && $skip !== null) {
          localVarQueryParameters = this.addToHttpParams(localVarQueryParameters,
            <any>$skip, '$skip');
        }
        if ($count !== undefined && $count !== null) {
          localVarQueryParameters = this.addToHttpParams(localVarQueryParameters,
            <any>$count, '$count');
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

        let localVarPath = `/odata/Organizations(${this.configuration.encodeParam({name: "orgKey", value: orgKey, in: "path", style: "simple", explode: false, dataType: "number", dataFormat: "int32"})})/ItSystemUsages`;
        return this.httpClient.request<APIItSystemUsageIEnumerableODataResponse>('get', `${this.configuration.basePath}${localVarPath}`,
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
     * Returns the EntitySet ItSystemUsages
     * @param requestParameters
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public getSingleItSystemUsagesGetV1(requestParameters: GetSingleItSystemUsagesGetV1RequestParams, observe?: 'body', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json', context?: HttpContext}): Observable<object>;
    public getSingleItSystemUsagesGetV1(requestParameters: GetSingleItSystemUsagesGetV1RequestParams, observe?: 'response', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json', context?: HttpContext}): Observable<HttpResponse<object>>;
    public getSingleItSystemUsagesGetV1(requestParameters: GetSingleItSystemUsagesGetV1RequestParams, observe?: 'events', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json', context?: HttpContext}): Observable<HttpEvent<object>>;
    public getSingleItSystemUsagesGetV1(requestParameters: GetSingleItSystemUsagesGetV1RequestParams, observe: any = 'body', reportProgress: boolean = false, options?: {httpHeaderAccept?: 'application/json', context?: HttpContext}): Observable<any> {
        const $expand = requestParameters.$expand;
        const $filter = requestParameters.$filter;
        const $select = requestParameters.$select;
        const $orderby = requestParameters.$orderby;
        const $top = requestParameters.$top;
        const $skip = requestParameters.$skip;
        const $count = requestParameters.$count;

        let localVarQueryParameters = new HttpParams({encoder: this.encoder});
        if ($expand !== undefined && $expand !== null) {
          localVarQueryParameters = this.addToHttpParams(localVarQueryParameters,
            <any>$expand, '$expand');
        }
        if ($filter !== undefined && $filter !== null) {
          localVarQueryParameters = this.addToHttpParams(localVarQueryParameters,
            <any>$filter, '$filter');
        }
        if ($select !== undefined && $select !== null) {
          localVarQueryParameters = this.addToHttpParams(localVarQueryParameters,
            <any>$select, '$select');
        }
        if ($orderby !== undefined && $orderby !== null) {
          localVarQueryParameters = this.addToHttpParams(localVarQueryParameters,
            <any>$orderby, '$orderby');
        }
        if ($top !== undefined && $top !== null) {
          localVarQueryParameters = this.addToHttpParams(localVarQueryParameters,
            <any>$top, '$top');
        }
        if ($skip !== undefined && $skip !== null) {
          localVarQueryParameters = this.addToHttpParams(localVarQueryParameters,
            <any>$skip, '$skip');
        }
        if ($count !== undefined && $count !== null) {
          localVarQueryParameters = this.addToHttpParams(localVarQueryParameters,
            <any>$count, '$count');
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

        let localVarPath = `/odata/ItSystemUsages`;
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
     * Returns the entity with the key from ItSystemUsages
     * @param requestParameters
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public getSingleItSystemUsagesGetV1ById(requestParameters: GetSingleItSystemUsagesGetV1ByIdRequestParams, observe?: 'body', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json', context?: HttpContext}): Observable<object>;
    public getSingleItSystemUsagesGetV1ById(requestParameters: GetSingleItSystemUsagesGetV1ByIdRequestParams, observe?: 'response', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json', context?: HttpContext}): Observable<HttpResponse<object>>;
    public getSingleItSystemUsagesGetV1ById(requestParameters: GetSingleItSystemUsagesGetV1ByIdRequestParams, observe?: 'events', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json', context?: HttpContext}): Observable<HttpEvent<object>>;
    public getSingleItSystemUsagesGetV1ById(requestParameters: GetSingleItSystemUsagesGetV1ByIdRequestParams, observe: any = 'body', reportProgress: boolean = false, options?: {httpHeaderAccept?: 'application/json', context?: HttpContext}): Observable<any> {
        const id = requestParameters.id;
        if (id === null || id === undefined) {
            throw new Error('Required parameter id was null or undefined when calling getSingleItSystemUsagesGetV1ById.');
        }
        const $expand = requestParameters.$expand;
        const $select = requestParameters.$select;

        let localVarQueryParameters = new HttpParams({encoder: this.encoder});
        if ($expand !== undefined && $expand !== null) {
          localVarQueryParameters = this.addToHttpParams(localVarQueryParameters,
            <any>$expand, '$expand');
        }
        if ($select !== undefined && $select !== null) {
          localVarQueryParameters = this.addToHttpParams(localVarQueryParameters,
            <any>$select, '$select');
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

        let localVarPath = `/odata/ItSystemUsages(${this.configuration.encodeParam({name: "id", value: id, in: "path", style: "simple", explode: false, dataType: "number", dataFormat: "int32"})})`;
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

}
