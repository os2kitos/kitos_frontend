import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { BaseModuleComponent } from 'src/app/shared/base/base-module-component';

@Component({
  templateUrl: 'profile.component.html',
  styleUrls: ['profile.component.scss'],
})
export class ProfileComponent extends BaseModuleComponent {
  constructor(store: Store) {
    super(store);
  }
}
