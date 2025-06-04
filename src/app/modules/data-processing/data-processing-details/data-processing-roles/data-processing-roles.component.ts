import { Component } from '@angular/core';

import { Store } from '@ngrx/store';
import { BaseComponent } from 'src/app/shared/base/base.component';
import { filterNullish } from 'src/app/shared/pipes/filter-nullish';
import {
  selectDataProcessingHasModifyPermissions,
  selectDataProcessingUuid,
} from 'src/app/store/data-processing/selectors';
import { CardComponent } from '../../../../shared/components/card/card.component';
import { CardHeaderComponent } from '../../../../shared/components/card-header/card-header.component';
import { RoleTableComponent } from '../../../../shared/components/role-table/role-table.component';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-data-processing-roles',
  templateUrl: './data-processing-roles.component.html',
  styleUrl: './data-processing-roles.component.scss',
  imports: [CardComponent, CardHeaderComponent, RoleTableComponent, AsyncPipe],
})
export class DataProcessingRolesComponent extends BaseComponent {
  public readonly dataProcessingUuid$ = this.store.select(selectDataProcessingUuid).pipe(filterNullish());
  public hasModifyPermission$ = this.store.select(selectDataProcessingHasModifyPermissions).pipe(filterNullish());

  constructor(private store: Store) {
    super();
  }
}
