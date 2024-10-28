import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { selectIsAuthenticating, selectUser } from 'src/app/store/user-store/selectors';
import { FrontpageComponentStore } from './frontpage.component-store';
import { BaseComponent } from 'src/app/shared/base/base.component';
import { OrganizationActions } from 'src/app/store/organization/actions';

@Component({
  templateUrl: 'frontpage.component.html',
  styleUrls: ['frontpage.component.scss'],
})
export class FrontpageComponent extends BaseComponent implements OnInit {
  public readonly loading$ = this.frontpageComponentStore.loading$;
  public readonly text$ = this.frontpageComponentStore.text$;

  public readonly user$ = this.store.select(selectUser);
  public readonly isAuthenticating$ = this.store.select(selectIsAuthenticating);

  constructor(private frontpageComponentStore: FrontpageComponentStore, private store: Store) {super();}

  ngOnInit(): void {
    this.frontpageComponentStore.getText();
    this.subscriptions.add(this.user$.subscribe(user => {
      if (user){
        this.store.dispatch(OrganizationActions.getUIRootConfig());
      }
    }));
  }
}
