/* eslint-disable @typescript-eslint/no-explicit-any */
import { HttpClient, HttpContext, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { APIV1ExcelINTERNALService } from 'src/app/api/v1';
import { LocalAdminImportEntityType } from '../enums/local-admin-import-entity-type';

export interface ExcelFile {
  data: Blob;
  fileName: string;
}

// 30/10/24 This class is a wrapper for the auto-generated excel API service, and manually switches to using the V1 controller whose post endpoints could not be recognized by swaggerGen.
@Injectable({
  providedIn: 'root',
})
export class APIExcelService {
  private basePath: string;
  private defaultHeaders: HttpHeaders;
  private encoder: any;
  private configuration: any;
  private fileNamePrefix = 'OS2KITOS';

  constructor(private httpClient: HttpClient, private apiService: APIV1ExcelINTERNALService) {
    this.basePath = this.apiService['configuration'].basePath ?? '';
    this.defaultHeaders = this.apiService['defaultHeaders'];
    this.encoder = this.apiService['encoder'];
    this.configuration = this.apiService['configuration'];
  }

  public getExcel(organizationUuid: string, type: LocalAdminImportEntityType): Observable<ExcelFile> {
    const entityName = this.getEntityName(type);
    const excelBlob$ = this.getSingleExcelInternalV2GetByEntityName(organizationUuid, entityName);
    const entityFileName = this.getExcelFileName(type);
    return excelBlob$.pipe(
      map((blob) => ({
        data: blob,
        fileName: entityFileName,
      }))
    );
  }

  private getExcelFileName(entityType: LocalAdminImportEntityType) {
    const entityFileName = this.getEntityFileName(entityType);
    return `${this.fileNamePrefix} ${entityFileName}`;
  }

  private getEntityFileName(entityType: LocalAdminImportEntityType) {
    switch (entityType) {
      case LocalAdminImportEntityType.organization:
        return $localize`Organisationsenheder`;
      case LocalAdminImportEntityType.users:
        return $localize`Brugere`;
      case LocalAdminImportEntityType.contracts:
        return $localize`IT Kontrakter`;
      default:
        throw new Error('Invalid type');
    }
  }

  public postExcelWithFormData(requestParameters: any, type: LocalAdminImportEntityType): Observable<any> {
    const entityName = this.getEntityName(type);
    return this.postSingleExcelInternalV2PostByEntityName(requestParameters, entityName);
  }

  private getSingleExcelInternalV2GetByEntityName(organizationUuid: string, entityName: string): Observable<any> {
    let localVarHeaders = this.defaultHeaders;

    const httpHeaderAccepts: string[] = [];
    const localVarHttpHeaderAcceptSelected = this.configuration.selectHeaderAccept(httpHeaderAccepts);
    if (localVarHttpHeaderAcceptSelected !== undefined) {
      localVarHeaders = localVarHeaders.set('Accept', localVarHttpHeaderAcceptSelected);
    }

    const responseType_ = 'blob';

    const localVarPath = `/api/local-admin/excel/${entityName}-by-uuid?organizationUuid=${this.configuration.encodeParam(
      {
        name: 'organizationUuid',
        value: organizationUuid,
        in: 'path',
        style: 'simple',
        explode: false,
        dataType: 'string',
        dataFormat: 'uuid',
      }
    )}`;
    return this.httpClient.request<Blob>('get', `${this.configuration.basePath}${localVarPath}`, {
      context: new HttpContext(),
      responseType: <any>responseType_,
      withCredentials: this.configuration.withCredentials,
      headers: localVarHeaders,
    });
  }

  private postSingleExcelInternalV2PostByEntityName(requestParameters: any, entityName: string): Observable<any> {
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
    const body = requestParameters.body;
    if (body === null || body === undefined) {
      throw new Error(
        'Required parameter body was null or undefined when calling postSingleExcelInternalV2PostOrgUnits.'
      );
    }

    let localVarQueryParameters = new HttpParams({ encoder: this.encoder });
    if (importOrgUnits !== undefined && importOrgUnits !== null) {
      localVarQueryParameters = this.addToHttpParams(localVarQueryParameters, <any>importOrgUnits, 'importOrgUnits');
    }

    let localVarHeaders = this.defaultHeaders;

    const httpHeaderAccepts: string[] = [];
    const localVarHttpHeaderAcceptSelected = this.configuration.selectHeaderAccept(httpHeaderAccepts);
    if (localVarHttpHeaderAcceptSelected !== undefined) {
      localVarHeaders = localVarHeaders.set('Accept', localVarHttpHeaderAcceptSelected);
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

    const localVarPath = `/api/local-admin/excel/${entityName}-by-uuid?organizationUuid=${this.configuration.encodeParam(
      {
        name: 'organizationUuid',
        value: organizationUuid,
        in: 'path',
        style: 'simple',
        explode: false,
        dataType: 'string',
        dataFormat: 'uuid',
      }
    )}`;
    return this.httpClient.request<any>('post', `${this.basePath}${localVarPath}`, {
      context: new HttpContext(),
      body: body,
      params: localVarQueryParameters,
      responseType: <any>responseType_,
      withCredentials: this.configuration.withCredentials,
      headers: localVarHeaders,
    });
  }

  private addToHttpParams(httpParams: HttpParams, value: any, key: string): HttpParams {
    if (value instanceof Array) {
      value.forEach((elem) => {
        httpParams = this.addToHttpParamsRecursive(httpParams, elem, key);
      });
    } else {
      httpParams = this.addToHttpParamsRecursive(httpParams, value, key);
    }
    return httpParams;
  }

  private addToHttpParamsRecursive(httpParams: HttpParams, value: any, key: string): HttpParams {
    if (value instanceof Date) {
      httpParams = httpParams.append(key, (value as Date).toISOString());
    } else if (value instanceof Object) {
      Object.keys(value).forEach((k) => {
        httpParams = this.addToHttpParamsRecursive(httpParams, value[k], `${key}.${k}`);
      });
    } else {
      httpParams = httpParams.append(key, value);
    }
    return httpParams;
  }

  private getEntityName(type: LocalAdminImportEntityType): string {
    switch (type) {
      case LocalAdminImportEntityType.organization:
        return 'units';
      case LocalAdminImportEntityType.users:
        return 'users';
      case LocalAdminImportEntityType.contracts:
        return 'contracts';
      default:
        throw new Error('Invalid type');
    }
  }
}
