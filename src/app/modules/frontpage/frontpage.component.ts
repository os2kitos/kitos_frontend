import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { selectUser } from 'src/app/store/user-store/selectors';
import { FrontpageComponentStore } from './frontpage.component-store';

@Component({
  templateUrl: 'frontpage.component.html',
  styleUrls: ['frontpage.component.scss'],
})
export class FrontpageComponent implements OnInit {
  public readonly loading$ = this.frontpageComponentStore.loading$;
  public readonly text$ = this.frontpageComponentStore.text$;

  public readonly user$ = this.store.select(selectUser);

  constructor(private frontpageComponentStore: FrontpageComponentStore, private store: Store) {}

  ngOnInit(): void {
    this.frontpageComponentStore.getText();
  }
}
