import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { first, map } from 'rxjs';
import { BaseComponent } from 'src/app/shared/base/base.component';
import { AppPath } from 'src/app/shared/enums/app-path';
import { openUrlInNewTab } from 'src/app/shared/helpers/navigation/navigation.helpers';
import { PublicMessage } from 'src/app/shared/models/public-messages/public-message.model';
import { filterNullish } from 'src/app/shared/pipes/filter-nullish';
import { GlobalAdminPublicMessageActions } from 'src/app/store/global-admin/public-messages/actions';
import { UserActions } from 'src/app/store/user-store/actions';
import { selectIsAuthenticating, selectUser, selectUserIsGlobalAdmin } from 'src/app/store/user-store/selectors';
import { ButtonComponent } from '../../shared/components/buttons/button/button.component';
import { HelpIconComponent } from '../../shared/components/icons/help.component';
import { ParagraphComponent } from '../../shared/components/paragraph/paragraph.component';
import { StandardVerticalContentGridComponent } from '../../shared/components/standard-vertical-content-grid/standard-vertical-content-grid.component';
import { FrontpageComponentStore } from './frontpage.component-store';
import { LoginComponent } from './login/login.component';
import { EditPublicMessageDialogComponent } from './public-message/edit-public-message-dialog/edit-public-message-dialog.component';
import { PublicMessageComponent } from './public-message/public-message.component';

@Component({
  templateUrl: 'frontpage.component.html',
  styleUrls: ['frontpage.component.scss'],
  imports: [
    CommonModule,
    HelpIconComponent,
    ParagraphComponent,
    LoginComponent,
    PublicMessageComponent,
    StandardVerticalContentGridComponent,
    ButtonComponent,
  ],
})
export class FrontpageComponent extends BaseComponent implements OnInit {
  public readonly loading$ = this.frontpageComponentStore.loading$;

  public readonly standardPublicMessages$ = this.frontpageComponentStore.publicMessages$.pipe(
    filterNullish(),
    map((messages) => messages.filter((message) => !message.isMain))
  );
  public readonly mainPublicMessage$ = this.frontpageComponentStore.publicMessages$.pipe(
    filterNullish(),
    map((messages) => messages.find((message) => message.isMain))
  );
  public readonly isGlobalAdmin$ = this.store.select(selectUserIsGlobalAdmin);

  public readonly user$ = this.store.select(selectUser);
  public readonly isAuthenticating$ = this.store.select(selectIsAuthenticating);
  public isAuthenticated$ = this.store.select(selectUser).pipe(map((user) => !!user));

  constructor(
    private frontpageComponentStore: FrontpageComponentStore,
    private store: Store,
    private actions$: Actions,
    private router: Router,
    private route: ActivatedRoute,
    private dialog: MatDialog
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
    this.frontpageComponentStore.getPublicMessages();

    this.subscriptions.add(
      this.actions$.pipe(ofType(GlobalAdminPublicMessageActions.editPublicMessagesSuccess)).subscribe(() => {
        this.frontpageComponentStore.getPublicMessages();
      })
    );
  }

  public goToMarketingPage(url: string): void {
    openUrlInNewTab(url);
  }

  public openEditDialog(publicMessage: PublicMessage): void {
    const dialogRef = this.dialog.open(EditPublicMessageDialogComponent);
    const instance = dialogRef.componentInstance;
    instance.publicMessage = publicMessage;
  }
}
