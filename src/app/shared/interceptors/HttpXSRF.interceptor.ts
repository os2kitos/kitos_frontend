import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { CookieService } from 'ngx-cookie';
import { Observable, catchError, first, map, mergeMap, of, tap, throwError } from 'rxjs';
import { APIV1AuthorizeINTERNALService } from 'src/app/api/v1';
import { UserActions } from 'src/app/store/user-store/actions';
import { selectXsrfToken } from 'src/app/store/user-store/selectors';
import { XSRFCOOKIE, XSRFTOKEN } from '../constants/constants';

@Injectable()
export class HttpXSRFInterceptor implements HttpInterceptor {
  constructor(
    private cookieService: CookieService,
    private store: Store,
    private authorizeService: APIV1AuthorizeINTERNALService,
  ) {}

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Only add XSRF token on mutating requests
    if (!['POST', 'PATCH', 'DELETE', 'PUT'].includes(req.method)) {
      return next.handle(req);
    }

    // Get or refresh the token before handling the request
    return this.store.select(selectXsrfToken).pipe(
      first(),
      mergeMap((token) => {
        const cookie = this.cookieService.get(XSRFCOOKIE);
        if (token && cookie) return of(token);

        return this.authorizeService.getSingleAuthorizeGetAntiForgeryToken().pipe(
          map((antiForgeryToken) => antiForgeryToken.toString()),
          tap((newToken) => this.store.dispatch(UserActions.updateXSRFToken(newToken))),
          catchError((error) => {
            console.error('Token fetch failed', error);
            return of('');
          }),
        );
      }),
      mergeMap((token) =>
        next.handle(req.clone({ headers: req.headers.set(XSRFTOKEN, token) })).pipe(
          catchError((error) => {
            //On status code 400 (possible invalid XSFR token), we need to refresh the token and retry the request as the token might have been invalidated by another tab
            if (error.status == 400) {
              return this.authorizeService.getSingleAuthorizeGetAntiForgeryToken().pipe(
                map((newToken) => newToken.toString()),
                tap((newToken) => this.store.dispatch(UserActions.updateXSRFToken(newToken))),
                mergeMap((newToken) => next.handle(req.clone({ headers: req.headers.set(XSRFTOKEN, newToken) }))),
                catchError((err) => {
                  console.error('Retry after token refresh failed', err);
                  return throwError(() => error);
                }),
              );
            }
            return throwError(() => error);
          }),
        ),
      ),
    );
  }
}
