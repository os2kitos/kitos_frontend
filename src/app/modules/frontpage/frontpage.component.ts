import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { first } from 'rxjs';
import { BaseComponent } from 'src/app/shared/base/base.component';
import { AppPath } from 'src/app/shared/enums/app-path';
import { ConfirmActionCategory, ConfirmActionService } from 'src/app/shared/services/confirm-action.service';
import { GlobalAdminPublicMessageActions } from 'src/app/store/global-admin/public-messages/actions';
import { UserActions } from 'src/app/store/user-store/actions';
import { selectIsAuthenticating, selectUser } from 'src/app/store/user-store/selectors';
import { FrontpageComponentStore } from './frontpage.component-store';

@Component({
  templateUrl: 'frontpage.component.html',
  styleUrls: ['frontpage.component.scss'],
})
export class FrontpageComponent extends BaseComponent implements OnInit {
  public readonly loading$ = this.frontpageComponentStore.loading$;
  public readonly text$ = this.frontpageComponentStore.text$;

  public readonly user$ = this.store.select(selectUser);
  public readonly isAuthenticating$ = this.store.select(selectIsAuthenticating);

  constructor(
    private frontpageComponentStore: FrontpageComponentStore,
    private store: Store,
    private actions$: Actions,
    private confirmActionService: ConfirmActionService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    super();
  }

  ngOnInit(): void {
    this.subscriptions.add(
      this.actions$.pipe(ofType(UserActions.resetOnOrganizationUpdate), first()).subscribe(() => {
        //StartupGuardService and AppGuardService have to use different methods of including the returnUrl query parameter
        //Because of that we have to check if returnUrl is an array or not
        let returnUrl = this.route.snapshot.queryParams['returnUrl'] ?? [AppPath.root];
        returnUrl = Array.isArray(returnUrl) ? returnUrl[0] : returnUrl;
        if (returnUrl && returnUrl !== '' && returnUrl !== AppPath.root) {
          this.router.navigate([returnUrl]);
        }
      })
    );
    this.frontpageComponentStore.getText();

    this.subscriptions.add(
      this.actions$.pipe(ofType(GlobalAdminPublicMessageActions.editPublicMessagesSuccess)).subscribe(() => {
        this.frontpageComponentStore.getText();
      })
    );
  }

  goToSSO(): void {
    this.confirmActionService.confirmAction({
      category: ConfirmActionCategory.Neutral,
      onConfirm: () => {
        window.location.href = '/LoginHandler.ashx';
      },
      confirmationType: 'OkCancel',
      title: $localize`Single Sign-On (SSO)`,
      message: $localize`Efter du er logget ind med SSO, bliver du omdirigeret til den gamle brugerflade. Så kan du vende tilbage til den nye brugerflade på https://kitos.dk/ui`,
    });
  }
}
