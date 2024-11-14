import { Component, OnInit } from '@angular/core';
import { GlobalAdminOtherBrokenLinksComponentStore } from './global-admin-other-broken-links.component-store';

@Component({
  selector: 'app-global-admin-other-broken-links',
  templateUrl: './global-admin-other-broken-links.component.html',
  styleUrl: './global-admin-other-broken-links.component.scss',
  providers: [GlobalAdminOtherBrokenLinksComponentStore],
})
export class GlobalAdminOtherBrokenLinksComponent implements OnInit {
  public readonly isLoading$ = this.componentStore.isLoading$;
  public readonly status$ = this.componentStore.status$;

  constructor(public componentStore: GlobalAdminOtherBrokenLinksComponentStore) {}

  ngOnInit(): void {
    this.componentStore.getStatus();
  }

  public downloadReport() {
    this.componentStore.getReport();
  }
}
