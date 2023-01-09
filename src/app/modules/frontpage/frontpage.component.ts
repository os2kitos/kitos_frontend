import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { UserActions } from 'src/app/store/user-store/actions';
import { selectUser } from 'src/app/store/user-store/selectors';
import { FrontpageComponentStore } from './frontpage.component-store';

@Component({
  templateUrl: 'frontpage.component.html',
  styleUrls: ['frontpage.component.scss'],
  providers: [FrontpageComponentStore],
})
export class FrontpageComponent implements OnInit {
  public user$ = this.store.select(selectUser);
  public componentState$ = this.frontpageComponentStore.state$;

  constructor(private store: Store, private frontpageComponentStore: FrontpageComponentStore) {}

  ngOnInit(): void {
    this.frontpageComponentStore.getText();
  }

  public testLogin() {
    this.store.dispatch(UserActions.getUser());
  }
}
