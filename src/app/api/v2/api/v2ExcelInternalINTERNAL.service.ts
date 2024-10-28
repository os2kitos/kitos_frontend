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

import {
  HttpClient,
  HttpContext,
  HttpEvent,
  HttpHeaders,
  HttpParameterCodec,
  HttpParams,
  HttpResponse,
} from '@angular/common/http';
import { Inject, Injectable, Optional } from '@angular/core';
import { Observable } from 'rxjs';
import { CustomHttpParameterCodec } from '../encoder';

// @ts-ignore
import { Configuration } from '../configuration';
import { BASE_PATH } from '../variables';

export interface GetSingleExcelInternalV2GetContractsRequestParams {
  organizationUuid: string;
  exportContracts: boolean;
}

export interface GetSingleExcelInternalV2GetOrgUnitsRequestParams {
  organizationUuid: string;
  exportOrgUnits: boolean;
}

export interface GetSingleExcelInternalV2GetUsersRequestParams {
  organizationUuid: string;
  exportUsers: boolean;
}

export interface PostSingleExcelInternalV2PostContractsRequestParams {
  organizationUuid: string;
  importContracts: boolean;
}

export interface PostSingleExcelInternalV2PostOrgUnitsRequestParams {
  organizationUuid: string;
  importOrgUnits: boolean;
}

export interface PostSingleExcelInternalV2PostUsersRequestParams {
  organizationUuid: string;
  importUsers: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class APIV2ExcelInternalINTERNALService {
  protected basePath = 'https://kitos-dev.strongminds.dk';
  public defaultHeaders = new HttpHeaders();
  public configuration = new Configuration();
  public encoder: HttpParameterCodec;

  constructor(
    protected httpClient: HttpClient,
    @Optional() @Inject(BASE_PATH) basePath: string | string[],
    @Optional() configuration: Configuration
  ) {
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
    if (typeof value === 'object' && value instanceof Date === false) {
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

    if (typeof value === 'object') {
      if (Array.isArray(value)) {
        (value as any[]).forEach((elem) => (httpParams = this.addToHttpParamsRecursive(httpParams, elem, key)));
      } else if (value instanceof Date) {
        if (key != null) {
          httpParams = httpParams.append(key, (value as Date).toISOString().substr(0, 10));
        } else {
          throw Error('key may not be null if value is Date');
        }
      } else {
        Object.keys(value).forEach(
          (k) => (httpParams = this.addToHttpParamsRecursive(httpParams, value[k], key != null ? `${key}.${k}` : k))
        );
      }
    } else if (key != null) {
      httpParams = httpParams.append(key, value);
    } else {
      throw Error('key may not be null if value is not object or array');
    }
    return httpParams;
  }

  /**
   * @param requestParameters
   * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
   * @param reportProgress flag to report request and response progress.
   */
  public getSingleExcelInternalV2GetContracts(
    requestParameters: GetSingleExcelInternalV2GetContractsRequestParams,
    observe?: 'body',
    reportProgress?: boolean,
    options?: { httpHeaderAccept?: undefined; context?: HttpContext }
  ): Observable<any>;
  public getSingleExcelInternalV2GetContracts(
    requestParameters: GetSingleExcelInternalV2GetContractsRequestParams,
    observe?: 'response',
    reportProgress?: boolean,
    options?: { httpHeaderAccept?: undefined; context?: HttpContext }
  ): Observable<HttpResponse<any>>;
  public getSingleExcelInternalV2GetContracts(
    requestParameters: GetSingleExcelInternalV2GetContractsRequestParams,
    observe?: 'events',
    reportProgress?: boolean,
    options?: { httpHeaderAccept?: undefined; context?: HttpContext }
  ): Observable<HttpEvent<any>>;
  public getSingleExcelInternalV2GetContracts(
    requestParameters: GetSingleExcelInternalV2GetContractsRequestParams,
    observe: any = 'body',
    reportProgress: boolean = false,
    options?: { httpHeaderAccept?: undefined; context?: HttpContext }
  ): Observable<any> {
    const organizationUuid = requestParameters.organizationUuid;
    if (organizationUuid === null || organizationUuid === undefined) {
      throw new Error(
        'Required parameter organizationUuid was null or undefined when calling getSingleExcelInternalV2GetContracts.'
      );
    }
    const exportContracts = requestParameters.exportContracts;
    if (exportContracts === null || exportContracts === undefined) {
      throw new Error(
        'Required parameter exportContracts was null or undefined when calling getSingleExcelInternalV2GetContracts.'
      );
    }

    let localVarQueryParameters = new HttpParams({ encoder: this.encoder });
    if (exportContracts !== undefined && exportContracts !== null) {
      localVarQueryParameters = this.addToHttpParams(localVarQueryParameters, <any>exportContracts, 'exportContracts');
    }

    let localVarHeaders = this.defaultHeaders;

    let localVarHttpHeaderAcceptSelected: string | undefined = options && options.httpHeaderAccept;
    if (localVarHttpHeaderAcceptSelected === undefined) {
      // to determine the Accept header
      const httpHeaderAccepts: string[] = [];
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

    let localVarPath = `/api/v2/internal/organizations/${this.configuration.encodeParam({
      name: 'organizationUuid',
      value: organizationUuid,
      in: 'path',
      style: 'simple',
      explode: false,
      dataType: 'string',
      dataFormat: 'uuid',
    })}/local-admin/excel/contracts`;
    return this.httpClient.request<any>('get', `${this.configuration.basePath}${localVarPath}`, {
      context: localVarHttpContext,
      params: localVarQueryParameters,
      responseType: <any>responseType_,
      withCredentials: this.configuration.withCredentials,
      headers: localVarHeaders,
      observe: observe,
      reportProgress: reportProgress,
    });
  }

  /**
   * @param requestParameters
   * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
   * @param reportProgress flag to report request and response progress.
   */
  public getSingleExcelInternalV2GetOrgUnits(
    requestParameters: GetSingleExcelInternalV2GetOrgUnitsRequestParams,
    observe?: 'body',
    reportProgress?: boolean,
    options?: { httpHeaderAccept?: undefined; context?: HttpContext }
  ): Observable<any>;
  public getSingleExcelInternalV2GetOrgUnits(
    requestParameters: GetSingleExcelInternalV2GetOrgUnitsRequestParams,
    observe?: 'response',
    reportProgress?: boolean,
    options?: { httpHeaderAccept?: undefined; context?: HttpContext }
  ): Observable<HttpResponse<any>>;
  public getSingleExcelInternalV2GetOrgUnits(
    requestParameters: GetSingleExcelInternalV2GetOrgUnitsRequestParams,
    observe?: 'events',
    reportProgress?: boolean,
    options?: { httpHeaderAccept?: undefined; context?: HttpContext }
  ): Observable<HttpEvent<any>>;
  public getSingleExcelInternalV2GetOrgUnits(
    requestParameters: GetSingleExcelInternalV2GetOrgUnitsRequestParams,
    observe: any = 'body',
    reportProgress: boolean = false,
    options?: { httpHeaderAccept?: undefined; context?: HttpContext }
  ): Observable<any> {
    const organizationUuid = requestParameters.organizationUuid;
    if (organizationUuid === null || organizationUuid === undefined) {
      throw new Error(
        'Required parameter organizationUuid was null or undefined when calling getSingleExcelInternalV2GetOrgUnits.'
      );
    }
    const exportOrgUnits = requestParameters.exportOrgUnits;
    if (exportOrgUnits === null || exportOrgUnits === undefined) {
      throw new Error(
        'Required parameter exportOrgUnits was null or undefined when calling getSingleExcelInternalV2GetOrgUnits.'
      );
    }

    let localVarQueryParameters = new HttpParams({ encoder: this.encoder });
    if (exportOrgUnits !== undefined && exportOrgUnits !== null) {
      localVarQueryParameters = this.addToHttpParams(localVarQueryParameters, <any>exportOrgUnits, 'exportOrgUnits');
    }

    let localVarHeaders = this.defaultHeaders;

    let localVarHttpHeaderAcceptSelected: string | undefined = options && options.httpHeaderAccept;
    if (localVarHttpHeaderAcceptSelected === undefined) {
      // to determine the Accept header
      const httpHeaderAccepts: string[] = [];
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

    let localVarPath = `/api/v2/internal/organizations/${this.configuration.encodeParam({
      name: 'organizationUuid',
      value: organizationUuid,
      in: 'path',
      style: 'simple',
      explode: false,
      dataType: 'string',
      dataFormat: 'uuid',
    })}/local-admin/excel/units`;
    return this.httpClient.request<any>('get', `${this.configuration.basePath}${localVarPath}`, {
      context: localVarHttpContext,
      params: localVarQueryParameters,
      responseType: <any>responseType_,
      withCredentials: this.configuration.withCredentials,
      headers: localVarHeaders,
      observe: observe,
      reportProgress: reportProgress,
    });
  }

  /**
   * @param requestParameters
   * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
   * @param reportProgress flag to report request and response progress.
   */
  public getSingleExcelInternalV2GetUsers(
    requestParameters: GetSingleExcelInternalV2GetUsersRequestParams,
    observe?: 'body',
    reportProgress?: boolean,
    options?: { httpHeaderAccept?: undefined; context?: HttpContext }
  ): Observable<any>;
  public getSingleExcelInternalV2GetUsers(
    requestParameters: GetSingleExcelInternalV2GetUsersRequestParams,
    observe?: 'response',
    reportProgress?: boolean,
    options?: { httpHeaderAccept?: undefined; context?: HttpContext }
  ): Observable<HttpResponse<any>>;
  public getSingleExcelInternalV2GetUsers(
    requestParameters: GetSingleExcelInternalV2GetUsersRequestParams,
    observe?: 'events',
    reportProgress?: boolean,
    options?: { httpHeaderAccept?: undefined; context?: HttpContext }
  ): Observable<HttpEvent<any>>;
  public getSingleExcelInternalV2GetUsers(
    requestParameters: GetSingleExcelInternalV2GetUsersRequestParams,
    observe: any = 'body',
    reportProgress: boolean = false,
    options?: { httpHeaderAccept?: undefined; context?: HttpContext }
  ): Observable<any> {
    const organizationUuid = requestParameters.organizationUuid;
    if (organizationUuid === null || organizationUuid === undefined) {
      throw new Error(
        'Required parameter organizationUuid was null or undefined when calling getSingleExcelInternalV2GetUsers.'
      );
    }
    const exportUsers = requestParameters.exportUsers;
    if (exportUsers === null || exportUsers === undefined) {
      throw new Error(
        'Required parameter exportUsers was null or undefined when calling getSingleExcelInternalV2GetUsers.'
      );
    }

    let localVarQueryParameters = new HttpParams({ encoder: this.encoder });
    if (exportUsers !== undefined && exportUsers !== null) {
      localVarQueryParameters = this.addToHttpParams(localVarQueryParameters, <any>exportUsers, 'exportUsers');
    }

    let localVarHeaders = this.defaultHeaders;

    let localVarHttpHeaderAcceptSelected: string | undefined = options && options.httpHeaderAccept;
    if (localVarHttpHeaderAcceptSelected === undefined) {
      // to determine the Accept header
      const httpHeaderAccepts: string[] = [];
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

    let localVarPath = `/api/v2/internal/organizations/${this.configuration.encodeParam({
      name: 'organizationUuid',
      value: organizationUuid,
      in: 'path',
      style: 'simple',
      explode: false,
      dataType: 'string',
      dataFormat: 'uuid',
    })}/local-admin/excel/users`;
    return this.httpClient.request<any>('get', `${this.configuration.basePath}${localVarPath}`, {
      context: localVarHttpContext,
      params: localVarQueryParameters,
      responseType: <any>responseType_,
      withCredentials: this.configuration.withCredentials,
      headers: localVarHeaders,
      observe: observe,
      reportProgress: reportProgress,
    });
  }

  /**
   * @param requestParameters
   * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
   * @param reportProgress flag to report request and response progress.
   */
  public postSingleExcelInternalV2PostContracts(
    requestParameters: PostSingleExcelInternalV2PostContractsRequestParams,
    observe?: 'body',
    reportProgress?: boolean,
    options?: { httpHeaderAccept?: undefined; context?: HttpContext }
  ): Observable<any>;
  public postSingleExcelInternalV2PostContracts(
    requestParameters: PostSingleExcelInternalV2PostContractsRequestParams,
    observe?: 'response',
    reportProgress?: boolean,
    options?: { httpHeaderAccept?: undefined; context?: HttpContext }
  ): Observable<HttpResponse<any>>;
  public postSingleExcelInternalV2PostContracts(
    requestParameters: PostSingleExcelInternalV2PostContractsRequestParams,
    observe?: 'events',
    reportProgress?: boolean,
    options?: { httpHeaderAccept?: undefined; context?: HttpContext }
  ): Observable<HttpEvent<any>>;
  public postSingleExcelInternalV2PostContracts(
    requestParameters: PostSingleExcelInternalV2PostContractsRequestParams,
    observe: any = 'body',
    reportProgress: boolean = false,
    options?: { httpHeaderAccept?: undefined; context?: HttpContext }
  ): Observable<any> {
    const organizationUuid = requestParameters.organizationUuid;
    if (organizationUuid === null || organizationUuid === undefined) {
      throw new Error(
        'Required parameter organizationUuid was null or undefined when calling postSingleExcelInternalV2PostContracts.'
      );
    }
    const importContracts = requestParameters.importContracts;
    if (importContracts === null || importContracts === undefined) {
      throw new Error(
        'Required parameter importContracts was null or undefined when calling postSingleExcelInternalV2PostContracts.'
      );
    }

    let localVarQueryParameters = new HttpParams({ encoder: this.encoder });
    if (importContracts !== undefined && importContracts !== null) {
      localVarQueryParameters = this.addToHttpParams(localVarQueryParameters, <any>importContracts, 'importContracts');
    }

    let localVarHeaders = this.defaultHeaders;

    let localVarHttpHeaderAcceptSelected: string | undefined = options && options.httpHeaderAccept;
    if (localVarHttpHeaderAcceptSelected === undefined) {
      // to determine the Accept header
      const httpHeaderAccepts: string[] = [];
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

    let localVarPath = `/api/v2/internal/organizations/${this.configuration.encodeParam({
      name: 'organizationUuid',
      value: organizationUuid,
      in: 'path',
      style: 'simple',
      explode: false,
      dataType: 'string',
      dataFormat: 'uuid',
    })}/local-admin/excel/contracts`;
    return this.httpClient.request<any>('post', `${this.configuration.basePath}${localVarPath}`, {
      context: localVarHttpContext,
      params: localVarQueryParameters,
      responseType: <any>responseType_,
      withCredentials: this.configuration.withCredentials,
      headers: localVarHeaders,
      observe: observe,
      reportProgress: reportProgress,
    });
  }

  /**
   * @param requestParameters
   * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
   * @param reportProgress flag to report request and response progress.
   */
  public postSingleExcelInternalV2PostOrgUnits(
    requestParameters: PostSingleExcelInternalV2PostOrgUnitsRequestParams,
    body: FormData,
    observe?: 'body',
    reportProgress?: boolean,
    options?: { httpHeaderAccept?: undefined; context?: HttpContext }
  ): Observable<any>;
  public postSingleExcelInternalV2PostOrgUnits(
    requestParameters: PostSingleExcelInternalV2PostOrgUnitsRequestParams,
    body: FormData,
    observe?: 'response',
    reportProgress?: boolean,
    options?: { httpHeaderAccept?: undefined; context?: HttpContext }
  ): Observable<HttpResponse<any>>;
  public postSingleExcelInternalV2PostOrgUnits(
    requestParameters: PostSingleExcelInternalV2PostOrgUnitsRequestParams,
    body: FormData,
    observe?: 'events',
    reportProgress?: boolean,
    options?: { httpHeaderAccept?: undefined; context?: HttpContext }
  ): Observable<HttpEvent<any>>;
  public postSingleExcelInternalV2PostOrgUnits(
    requestParameters: PostSingleExcelInternalV2PostOrgUnitsRequestParams,
    body: FormData,
    observe: any = 'body',
    reportProgress: boolean = false,
    options?: { httpHeaderAccept?: undefined; context?: HttpContext }
  ): Observable<any> {
    const organizationUuid = requestParameters.organizationUuid;
    if (organizationUuid === null || organizationUuid === undefined) {
      throw new Error(
        'Required parameter organizationUuid was null or undefined when calling postSingleExcelInternalV2PostOrgUnits.'
      );
    }
    const importOrgUnits = requestParameters.importOrgUnits;
    if (importOrgUnits === null || importOrgUnits === undefined) {
      throw new Error(
        'Required parameter importOrgUnits was null or undefined when calling postSingleExcelInternalV2PostOrgUnits.'
      );
    }

    let localVarQueryParameters = new HttpParams({ encoder: this.encoder });
    if (importOrgUnits !== undefined && importOrgUnits !== null) {
      localVarQueryParameters = this.addToHttpParams(localVarQueryParameters, <any>importOrgUnits, 'importOrgUnits');
    }

    let localVarHeaders = this.defaultHeaders;

    let localVarHttpHeaderAcceptSelected: string | undefined = options && options.httpHeaderAccept;
    if (localVarHttpHeaderAcceptSelected === undefined) {
      // to determine the Accept header
      const httpHeaderAccepts: string[] = [];
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

    let localVarPath = `/api/v2/internal/organizations/${this.configuration.encodeParam({
      name: 'organizationUuid',
      value: organizationUuid,
      in: 'path',
      style: 'simple',
      explode: false,
      dataType: 'string',
      dataFormat: 'uuid',
    })}/local-admin/excel/units`;
    return this.httpClient.request<any>('post', `${this.configuration.basePath}${localVarPath}`, {
      context: localVarHttpContext,
      body,
      params: localVarQueryParameters,
      responseType: <any>responseType_,
      withCredentials: this.configuration.withCredentials,
      headers: localVarHeaders,
      observe: observe,
      reportProgress: reportProgress,
    });
  }

  /**
   * @param requestParameters
   * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
   * @param reportProgress flag to report request and response progress.
   */
  public postSingleExcelInternalV2PostUsers(
    requestParameters: PostSingleExcelInternalV2PostUsersRequestParams,
    observe?: 'body',
    reportProgress?: boolean,
    options?: { httpHeaderAccept?: undefined; context?: HttpContext }
  ): Observable<any>;
  public postSingleExcelInternalV2PostUsers(
    requestParameters: PostSingleExcelInternalV2PostUsersRequestParams,
    observe?: 'response',
    reportProgress?: boolean,
    options?: { httpHeaderAccept?: undefined; context?: HttpContext }
  ): Observable<HttpResponse<any>>;
  public postSingleExcelInternalV2PostUsers(
    requestParameters: PostSingleExcelInternalV2PostUsersRequestParams,
    observe?: 'events',
    reportProgress?: boolean,
    options?: { httpHeaderAccept?: undefined; context?: HttpContext }
  ): Observable<HttpEvent<any>>;
  public postSingleExcelInternalV2PostUsers(
    requestParameters: PostSingleExcelInternalV2PostUsersRequestParams,
    observe: any = 'body',
    reportProgress: boolean = false,
    options?: { httpHeaderAccept?: undefined; context?: HttpContext }
  ): Observable<any> {
    const organizationUuid = requestParameters.organizationUuid;
    if (organizationUuid === null || organizationUuid === undefined) {
      throw new Error(
        'Required parameter organizationUuid was null or undefined when calling postSingleExcelInternalV2PostUsers.'
      );
    }
    const importUsers = requestParameters.importUsers;
    if (importUsers === null || importUsers === undefined) {
      throw new Error(
        'Required parameter importUsers was null or undefined when calling postSingleExcelInternalV2PostUsers.'
      );
    }

    let localVarQueryParameters = new HttpParams({ encoder: this.encoder });
    if (importUsers !== undefined && importUsers !== null) {
      localVarQueryParameters = this.addToHttpParams(localVarQueryParameters, <any>importUsers, 'importUsers');
    }

    let localVarHeaders = this.defaultHeaders;

    let localVarHttpHeaderAcceptSelected: string | undefined = options && options.httpHeaderAccept;
    if (localVarHttpHeaderAcceptSelected === undefined) {
      // to determine the Accept header
      const httpHeaderAccepts: string[] = [];
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

    let localVarPath = `/api/v2/internal/organizations/${this.configuration.encodeParam({
      name: 'organizationUuid',
      value: organizationUuid,
      in: 'path',
      style: 'simple',
      explode: false,
      dataType: 'string',
      dataFormat: 'uuid',
    })}/local-admin/excel/users`;
    return this.httpClient.request<any>('post', `${this.configuration.basePath}${localVarPath}`, {
      context: localVarHttpContext,
      params: localVarQueryParameters,
      responseType: <any>responseType_,
      withCredentials: this.configuration.withCredentials,
      headers: localVarHeaders,
      observe: observe,
      reportProgress: reportProgress,
    });
  }
}
