import { Component } from "@angular/core";
import { BaseComponent } from "./base.component";
import { Store } from "@ngrx/store";
import { OrganizationActions } from "src/app/store/organization/actions";

@Component({
  template: '',
})
export class BaseModuleComponent extends BaseComponent {
  constructor(protected store: Store) {
    super();
    this.store.dispatch(OrganizationActions.getUIRootConfig());
  }
}
