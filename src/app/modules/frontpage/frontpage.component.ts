import { Component, OnInit } from '@angular/core';
import { FrontpageComponentStore } from './frontpage.component-store';

@Component({
  templateUrl: 'frontpage.component.html',
  styleUrls: ['frontpage.component.scss'],
  providers: [FrontpageComponentStore],
})
export class FrontpageComponent implements OnInit {
  public loading$ = this.frontpageComponentStore.loading$;
  public text$ = this.frontpageComponentStore.text$;

  constructor(private frontpageComponentStore: FrontpageComponentStore) {}

  ngOnInit(): void {
    this.frontpageComponentStore.getText();
  }
}
