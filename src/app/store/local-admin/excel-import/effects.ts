/* eslint-disable @typescript-eslint/no-explicit-any */
import { HttpClient, HttpContext, HttpHeaders, HttpParameterCodec, HttpParams } from '@angular/common/http';
import { Inject, Injectable, Optional } from '@angular/core';
import { Actions } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { CustomHttpParameterCodec } from 'src/app/api/v1/encoder';
import {
  APIV2ExcelInternalINTERNALService,
  Configuration,
  PostSingleExcelInternalV2PostContractsRequestParams,
} from 'src/app/api/v2';

@Injectable()
export class ExcelImportEffects {
  public defaultHeaders = new HttpHeaders();
  public encoder: HttpParameterCodec;

  constructor(
    private actions$: Actions,
    private store: Store,
    private httpClient: HttpClient,
    @Inject(APIV2ExcelInternalINTERNALService) private apiService: APIV2ExcelInternalINTERNALService,
    @Optional() private configuration: Configuration
  ) {
    this.encoder = this.configuration.encoder || new CustomHttpParameterCodec();
  }
  /*
  excelImport$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ExcelImportActions.excelImport),
      combineLatestWith(this.store.select(selectOrganizationUuid).pipe(filterNullish())),
      mergeMap(([{ file,  importType }, organizationUuid]) => {
        switch (importType) {
          case 'Contracts':
            return this.apiService
              .postSingleExcelInternalV2PostOrgUnits({ organizationUuid, importOrgUnits: true })
              .pipe(
                map(() => ExcelImportActions.excelImportSuccess()),
                catchError(() => of(ExcelImportActions.excelImportError()))
              );
          case 'OrganizationUnits':
            return this.apiService
              .postSingleExcelInternalV2PostOrgUnits({ organizationUuid, importOrgUnits: true })
              .pipe(
                map(() => ExcelImportActions.excelImportSuccess()),
                catchError(() => of(ExcelImportActions.excelImportError()))
              );
          case 'Users':
            return this.apiService
              .postSingleExcelInternalV2PostOrgUnits({ organizationUuid, importOrgUnits: true })
              .pipe(
                map(() => ExcelImportActions.excelImportSuccess()),
                catchError(() => of(ExcelImportActions.excelImportError()))
              );
          default:
            throw 'Invalid excel import type';
        }
      })
    );
  }); */
  /* getSynchronizationStatus$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ExcelImportActions.excelImport),
      combineLatestWith(this.store.select(selectOrganizationUuid).pipe(filterNullish())),
      mergeMap(([_, organizationUuid]) =>
        this.apiService
          .getSingleStsOrganizationSynchronizationInternalV2GetSynchronizationStatus({ organizationUuid })
          .pipe(
            map((synchronizationStatus) => FkOrgActions.getSynchronizationStatusSuccess(synchronizationStatus)),
            catchError(() => of(FkOrgActions.getSynchronizationStatusError()))
          )
      )
    );
  }); */

  postSingleExcelInternalV2PostContracts(
    requestParameters: PostSingleExcelInternalV2PostContractsRequestParams,
    formData: FormData
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

    let localVarHttpHeaderAcceptSelected: string | undefined = undefined;
    if (localVarHttpHeaderAcceptSelected === undefined) {
      // to determine the Accept header
      const httpHeaderAccepts: string[] = [];
      localVarHttpHeaderAcceptSelected = this.configuration.selectHeaderAccept(httpHeaderAccepts);
    }
    if (localVarHttpHeaderAcceptSelected !== undefined) {
      localVarHeaders = localVarHeaders.set('Accept', localVarHttpHeaderAcceptSelected);
      localVarHeaders = localVarHeaders.set('Content-Type', 'undefined');
    }

    let localVarHttpContext: HttpContext | undefined = undefined;
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

    const localVarPath = `/api/v2/internal/organizations/${this.configuration.encodeParam({
      name: 'organizationUuid',
      value: organizationUuid,
      in: 'path',
      style: 'simple',
      explode: false,
      dataType: 'string',
      dataFormat: 'uuid',
    })}/local-admin/excel/contracts`;
    return this.httpClient.request<any>('post', `${this.configuration.basePath}${localVarPath}`, {
      body: formData,
      context: localVarHttpContext,
      params: localVarQueryParameters,
      responseType: <any>responseType_,
      withCredentials: this.configuration.withCredentials,
      headers: localVarHeaders,
    });
  }
  addToHttpParams(httpParams: HttpParams, value: any, key?: string): HttpParams {
    if (typeof value === 'object' && value instanceof Date === false) {
      httpParams = this.addToHttpParamsRecursive(httpParams, value);
    } else {
      httpParams = this.addToHttpParamsRecursive(httpParams, value, key);
    }
    return httpParams;
  }

  addToHttpParamsRecursive(httpParams: HttpParams, value?: any, key?: string): HttpParams {
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
}
