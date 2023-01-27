import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { catchError, first, map, mergeMap, Observable, of, retry, tap } from 'rxjs';
import { UserActions } from 'src/app/store/user-store/actions';
import { selectXsrfToken } from 'src/app/store/user-store/selectors';
import { APIV1AuthorizeService } from '../../api/v1';
import { XSRFTOKEN } from '../constants';

@Injectable()
export class HttpXsrfInterceptor implements HttpInterceptor {
  constructor(private store: Store, private authorizeService: APIV1AuthorizeService) {}

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Only add XSRF token on mutating requests
    if (!['POST', 'PATCH', 'DELETE', 'PUT'].includes(req.method)) {
      return next.handle(req);
    }

    return this.store.select(selectXsrfToken).pipe(
      first(),
      mergeMap((token) => {
        // Fetch and add new XSRF token if missing from state before handling request
        if (!token) {
          return this.authorizeService.gETAuthorizeGetAntiForgeryToken().pipe(
            retry(1),
            map((antiForgeryToken) => antiForgeryToken.toString()),
            tap((token) => this.store.dispatch(UserActions.updateXsrfToken(token))),
            catchError((error) => {
              console.error(error);
              // Just return empty token if XSRF token request fails. The handled request will then fail.
              return of('');
            })
          );
        }
        return of(token);
      }),
      mergeMap((token) => {
        req = req.clone({ headers: req.headers.set(XSRFTOKEN, token) });
        return next.handle(req);
      })
    );
  }
}
