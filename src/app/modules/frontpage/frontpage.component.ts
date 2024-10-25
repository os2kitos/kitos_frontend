import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { selectIsAuthenticating, selectUser } from 'src/app/store/user-store/selectors';
import { FrontpageComponentStore } from './frontpage.component-store';
import { BaseModuleComponent } from 'src/app/shared/base/base-module-component';

@Component({
  templateUrl: 'frontpage.component.html',
  styleUrls: ['frontpage.component.scss'],
})
export class FrontpageComponent extends BaseModuleComponent implements OnInit {
  public readonly loading$ = this.frontpageComponentStore.loading$;
  public readonly text$ = this.frontpageComponentStore.text$;

  public readonly user$ = this.store.select(selectUser);
  public readonly isAuthenticating$ = this.store.select(selectIsAuthenticating);

  constructor(private frontpageComponentStore: FrontpageComponentStore, store: Store) {super(store);}

  ngOnInit(): void {
    this.frontpageComponentStore.getText();
  }
}
