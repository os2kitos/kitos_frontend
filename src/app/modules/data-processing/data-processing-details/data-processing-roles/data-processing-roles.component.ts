import { Component } from '@angular/core';

import { Store } from '@ngrx/store';
import { BaseComponent } from 'src/app/shared/base/base.component';
import { filterNullish } from 'src/app/shared/pipes/filter-nullish';
import { selectDataProcessingHasModifyPermissions, selectDataProcessingUuid } from 'src/app/store/data-processing/selectors';

@Component({
  selector: 'app-data-processing-roles',
  templateUrl: './data-processing-roles.component.html',
  styleUrl: './data-processing-roles.component.scss'
})
export class DataProcessingRolesComponent extends BaseComponent {
  public readonly dataProcessingUuid$ = this.store.select(selectDataProcessingUuid).pipe(filterNullish());
  public hasModifyPermission$ = this.store.select(selectDataProcessingHasModifyPermissions).pipe(filterNullish());

  constructor(private store: Store) {
    super();
  }
}
