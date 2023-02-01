import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { selectIsAuthenticating, selectUser } from 'src/app/store/user-store/selectors';
import { FrontpageComponentStore } from './frontpage.component-store';

@Component({
  templateUrl: 'frontpage.component.html',
  styleUrls: ['frontpage.component.scss'],
})
export class FrontpageComponent implements OnInit {
  public loading$ = this.frontpageComponentStore.loading$;
  public text$ = this.frontpageComponentStore.text$;

  public user$ = this.store.select(selectUser);
  public isAuthenticating$ = this.store.select(selectIsAuthenticating);

  constructor(private frontpageComponentStore: FrontpageComponentStore, private store: Store) {}

  ngOnInit(): void {
    this.frontpageComponentStore.getText();
  }
}
