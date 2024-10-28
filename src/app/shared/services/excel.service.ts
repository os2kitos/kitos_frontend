/* eslint-disable @typescript-eslint/no-explicit-any */
/*
@Injectable({
  providedIn: 'root',
})
export class APIExcelService {
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
    if (this.configuration.basePath === '') {
      this.configuration.basePath = this.basePath;
    }
    this.encoder = this.configuration.encoder || new CustomHttpParameterCodec();
  }

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
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

  public postSingleExcelInternalV2PostOrgUnits(
    requestParameters: PostSingleExcelInternalV2PostOrgUnitsRequestParams,
    observe?: 'body',
    reportProgress?: boolean,
    options?: { httpHeaderAccept?: undefined; context?: HttpContext }
  ): Observable<any>;
  public postSingleExcelInternalV2PostOrgUnits(
    requestParameters: PostSingleExcelInternalV2PostOrgUnitsRequestParams,
    observe?: 'response',
    reportProgress?: boolean,
    options?: { httpHeaderAccept?: undefined; context?: HttpContext }
  ): Observable<HttpResponse<any>>;
  public postSingleExcelInternalV2PostOrgUnits(
    requestParameters: PostSingleExcelInternalV2PostOrgUnitsRequestParams,
    observe?: 'events',
    reportProgress?: boolean,
    options?: { httpHeaderAccept?: undefined; context?: HttpContext }
  ): Observable<HttpEvent<any>>;
  public postSingleExcelInternalV2PostOrgUnits(
    requestParameters: PostSingleExcelInternalV2PostOrgUnitsRequestParams,
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
    console.log(environment);

    const localVarPath = `/api/v2/internal/organizations/${this.configuration.encodeParam({
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
      params: localVarQueryParameters,
      responseType: <any>responseType_,
      withCredentials: this.configuration.withCredentials,
      headers: localVarHeaders,
      observe: observe,
      reportProgress: reportProgress,
    });
  }
}
 */
