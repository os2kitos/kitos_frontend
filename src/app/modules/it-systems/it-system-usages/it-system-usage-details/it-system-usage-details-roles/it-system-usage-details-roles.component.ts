import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { BaseComponent } from 'src/app/shared/base/base.component';
import { filterNullish } from 'src/app/shared/pipes/filter-nullish';
import {
  selectITSystemUsageHasModifyPermission,
  selectItSystemUsageUuid,
} from 'src/app/store/it-system-usage/selectors';
import { CardComponent } from '../../../../../shared/components/card/card.component';
import { CardHeaderComponent } from '../../../../../shared/components/card-header/card-header.component';
import { RoleTableComponent } from '../../../../../shared/components/role-table/role-table.component';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-it-system-usage-details-roles',
  templateUrl: './it-system-usage-details-roles.component.html',
  styleUrls: ['./it-system-usage-details-roles.component.scss'],
  imports: [CardComponent, CardHeaderComponent, RoleTableComponent, AsyncPipe],
})
export class ItSystemUsageDetailsRolesComponent extends BaseComponent {
  public readonly systemUuid$ = this.store.select(selectItSystemUsageUuid).pipe(filterNullish());
  public hasModifyPermission$ = this.store.select(selectITSystemUsageHasModifyPermission).pipe(filterNullish());

  constructor(private store: Store) {
    super();
  }
}
