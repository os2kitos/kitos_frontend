import { Component, OnInit } from '@angular/core';
import { OrganizationsDialogComponentStore } from './organizations-dialog.component-store';

@Component({
  template: '',
  providers: [OrganizationsDialogComponentStore],
})
export class GlobalAdminOrganizationsDialogBaseComponent implements OnInit {
  protected countryCodes$ = this.componentStore.countryCodes$;
  protected loading$ = this.componentStore.loading$;

  constructor(protected componentStore: OrganizationsDialogComponentStore) {}

  ngOnInit() {
    this.componentStore.getCountryCodes();
  }
}
