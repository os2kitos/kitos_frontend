import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie';
import { catchError, map, mergeMap, Observable, of, retry } from 'rxjs';
import { APIV1AuthorizeINTERNALService } from '../../api/v1';
import { XSRFCOOKIE, XSRFTOKEN } from '../constants';

@Injectable()
export class HttpXSRFInterceptor implements HttpInterceptor {
  constructor(private cookieService: CookieService, private authorizeService: APIV1AuthorizeINTERNALService) {}

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Only add XSRF token on mutating requests
    if (!['POST', 'PATCH', 'DELETE', 'PUT'].includes(req.method)) {
      return next.handle(req);
    }

    // Fetch new XSRF token if missing from cookies before handling request
    return of(this.cookieService.get(XSRFCOOKIE)).pipe(
      mergeMap((token) => {
        if (token) return of(token);

        return this.authorizeService.gETAuthorizeGetAntiForgeryToken().pipe(
          retry(1),
          map((antiForgeryToken) => antiForgeryToken.toString()),
          catchError((error) => {
            console.error(error);
            // Just return empty token if XSRF token request fails. The handled request will then fail.
            return of('');
          })
        );
      }),
      // Add XSRF token to header and handle request
      mergeMap((token) => next.handle(req.clone({ headers: req.headers.set(XSRFTOKEN, token) })))
    );
  }
}
