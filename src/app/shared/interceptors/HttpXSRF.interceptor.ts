import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { CookieService } from 'ngx-cookie';
import { Observable, catchError, first, map, mergeMap, of, retry, tap } from 'rxjs';
import { APIV1AuthorizeINTERNALService } from 'src/app/api/v1';
import { UserActions } from 'src/app/store/user-store/actions';
import { selectXsrfToken } from 'src/app/store/user-store/selectors';
import { XSRFCOOKIE, XSRFTOKEN } from '../constants';

@Injectable()
export class HttpXSRFInterceptor implements HttpInterceptor {
  constructor(
    private cookieService: CookieService,
    private store: Store,
    private authorizeService: APIV1AuthorizeINTERNALService
  ) {}

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Only add XSRF token on mutating requests
    if (!['POST', 'PATCH', 'DELETE', 'PUT'].includes(req.method)) {
      return next.handle(req);
    }

    // Fetch new XSRF token if missing cookie or session token before handling request
    return this.store.select(selectXsrfToken).pipe(
      first(),
      mergeMap((token) => {
        const cookie = this.cookieService.get(XSRFCOOKIE);
        if (token && cookie) return of(token);

        return this.authorizeService.getSingleAuthorizeGetAntiForgeryToken().pipe(
          retry(1),
          map((antiForgeryToken) => antiForgeryToken.toString()),
          tap((token) => this.store.dispatch(UserActions.updateXSRFToken(token))),
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
