import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { RegistrationRecommendedBadgesService } from 'src/app/shared/services/registration-recommended-badges.service';
import { BaseComponent } from 'src/app/shared/base/base.component';
import { filterNullish } from 'src/app/shared/pipes/filter-nullish';
import { selectItContractHasModifyPermissions, selectItContractUuid } from 'src/app/store/it-contract/selectors';
import { CardComponent } from '../../../../shared/components/card/card.component';
import { CardHeaderComponent } from '../../../../shared/components/card-header/card-header.component';
import { AsyncPipe } from '@angular/common';
import { NotificationsTableComponent } from '../../../../shared/components/notifications-table/notifications-table.component';

@Component({
  selector: 'app-it-contract-notifications',
  templateUrl: './it-contract-notifications.component.html',
  styleUrl: './it-contract-notifications.component.scss',
  imports: [CardComponent, CardHeaderComponent, NotificationsTableComponent, AsyncPipe],
})
export class ItContractNotificationsComponent extends BaseComponent {
  public readonly recommendedBadge$ = this.recommendedBadgesService.contract.notifications$;

  public readonly contractUuid$ = this.store.select(selectItContractUuid).pipe(filterNullish());
  public readonly hasModifyPermission$ = this.store.select(selectItContractHasModifyPermissions).pipe(filterNullish());

  constructor(
    private store: Store,
    private readonly recommendedBadgesService: RegistrationRecommendedBadgesService,
  ) {
    super();
  }
}
