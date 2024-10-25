import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { OrganizationActions } from 'src/app/store/organization/actions';

@Component({
  templateUrl: 'profile.component.html',
  styleUrls: ['profile.component.scss'],
})
export class ProfileComponent {
  constructor(private store: Store) {
    this.store.dispatch(OrganizationActions.getUIRootConfig());
  }
}
