import { Component, OnInit } from '@angular/core';
import { FkOrgComponentStore } from './fk-org.component-store';

@Component({
  selector: 'app-local-admin-import-organization',
  templateUrl: './local-admin-import-organization.component.html',
  styleUrl: './local-admin-import-organization.component.scss',
  providers: [FkOrgComponentStore],
})
export class LocalAdminImportOrganizationComponent implements OnInit {
  public readonly synchronizationStatus$ = this.componentStore.synchronizationStatus$;
  public readonly isLoadingConnectionStatus$ = this.componentStore.isLoadingConnectionStatus$;
  public readonly accessGranted$ = this.componentStore.accessGranted$;
  public readonly accessError$ = this.componentStore.accessError$;
  public readonly isConnected$ = this.componentStore.isConnected$;

  constructor(private componentStore: FkOrgComponentStore) {}

  ngOnInit(): void {
    this.componentStore.getSynchronizationStatus();
  }

  public openImportDialog() {}
}
