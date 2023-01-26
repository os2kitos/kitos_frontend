import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { first, mergeMap, Observable } from 'rxjs';
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
      mergeMap((xsrfToken) => {
        // Fetch and add new XSRF token if missing from state before continuing request
        if (!xsrfToken) {
          return this.authorizeService.gETAuthorizeGetAntiForgeryToken().pipe(
            mergeMap((token) => {
              const xsrfToken = token.toString();
              this.store.dispatch(UserActions.updateXsrfToken(xsrfToken));

              req = req.clone({ headers: req.headers.set(XSRFTOKEN, xsrfToken) });
              return next.handle(req);
            })
          );
        }

        req = req.clone({ headers: req.headers.set(XSRFTOKEN, xsrfToken) });
        return next.handle(req);
      })
    );
  }
}
