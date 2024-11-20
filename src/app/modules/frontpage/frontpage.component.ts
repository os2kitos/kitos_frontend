import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { selectIsAuthenticating, selectUser } from 'src/app/store/user-store/selectors';
import { FrontpageComponentStore } from './frontpage.component-store';
import { BaseComponent } from 'src/app/shared/base/base.component';
import { Actions, ofType } from '@ngrx/effects';
import { GlobalAdminPublicMessageActions } from 'src/app/store/global-admin/public-messages/actions';

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
    private actions$: Actions
  ) {
    super();
  }

  ngOnInit(): void {
    this.frontpageComponentStore.getText();

    this.subscriptions.add(
      this.actions$.pipe(ofType(GlobalAdminPublicMessageActions.editPublicMessagesSuccess)).subscribe(() => {
        this.frontpageComponentStore.getText();
      })
    );
  }
}
