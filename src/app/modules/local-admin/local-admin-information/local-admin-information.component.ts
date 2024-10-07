import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { selectOrganizationName } from 'src/app/store/user-store/selectors';

@Component({
  selector: 'app-local-admin-information',
  templateUrl: './local-admin-information.component.html',
  styleUrl: './local-admin-information.component.scss'
})
export class LocalAdminInformationComponent {
  public readonly organizationName$ = this.store.select(selectOrganizationName);


  constructor(private readonly store: Store){}

}
