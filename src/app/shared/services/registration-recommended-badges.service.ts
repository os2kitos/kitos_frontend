import { Injectable } from '@angular/core';
import { Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { Observable, catchError, combineLatest, filter, map, of, startWith, switchMap } from 'rxjs';
import { NotificationV2Service, ItContractV2Service, ItSystemUsageInternalV2Service } from 'src/app/api/v2';
import { getItSystemUsageRecommendedTabBadges } from 'src/app/modules/it-systems/it-system-usages/it-system-usage-details/it-system-usage-recommended-tabs.helper';
import { getItContractRecommendedTabBadges } from 'src/app/modules/it-contracts/it-contract-details/it-contract-recommended-tabs.helper';
import { getDataProcessingRecommendedTabBadges } from 'src/app/modules/data-processing/data-processing-details/data-processing-recommended-tabs.helper';
import { selectContract } from 'src/app/store/it-contract/selectors';
import { selectItSystemUsage } from 'src/app/store/it-system-usage/selectors';
import { selectDataProcessing } from 'src/app/store/data-processing/selectors';
import * as config from 'src/app/store/organization/ui-module-customization/selectors';
import { selectOrganizationUuid } from 'src/app/store/user-store/selectors';
import { UserNotificationActions } from 'src/app/store/user-notifications/actions';
import {
  combineRecommendedBadgeState,
  mapUIConfigStatusToRecommended,
  recommendedCollectionFilled,
} from '../helpers/observable-helpers';
import { RegistrationRecommendedBadges, RecommendedSelector } from '../helpers/registration-recommended-badges.helper';
import { NotificationEntityType } from '../models/notification-entity-types';
import { filterNullish } from '../pipes/filter-nullish';

interface Registration {
  uuid: string;
  roles: unknown[] | null;
  externalReferences: unknown[] | null;
}

/**
 * Provides shared recommendation streams for all registration tabs and page headers.
 * Module helpers define field rules; API-backed collections load only when recommended.
 * Notification collections refresh after notification changes.
 */
@Injectable({ providedIn: 'root' })
export class RegistrationRecommendedBadgesService {
  public readonly usage = getItSystemUsageRecommendedTabBadges(
    this.store,
    this.contractsApi,
    this.create(
      this.store.select(selectItSystemUsage),
      'ItSystemUsage',
      config.selectITSystemUsageEnableAndRecommendedRoleAssignments,
      config.selectITSystemUsageEnableAndRecommendedNotificationCollection,
      config.selectITSystemUsageEnableAndRecommendedReferenceCollection,
    ),
  );
  public readonly contract = getItContractRecommendedTabBadges(
    this.store,
    this.relationsApi,
    this.create(
      this.store.select(selectContract),
      'ItContract',
      config.selectItContractEnableAndRecommendedRoleAssignments,
      config.selectItContractEnableAndRecommendedNotificationCollection,
      config.selectItContractEnableAndRecommendedReferenceCollection,
    ),
  );
  public readonly dataProcessing = getDataProcessingRecommendedTabBadges(
    this.store,
    this.create(
      this.store.select(selectDataProcessing),
      'DataProcessingRegistration',
      config.selectDprEnableAndRecommendedRoleAssignments,
      config.selectDprEnableAndRecommendedNotificationCollection,
      config.selectDprEnableAndRecommendedReferenceCollection,
    ),
  );

  constructor(
    private readonly store: Store,
    private readonly api: NotificationV2Service,
    private readonly actions$: Actions,
    private readonly contractsApi: ItContractV2Service,
    private readonly relationsApi: ItSystemUsageInternalV2Service,
  ) {}

  private create(
    entity$: Observable<Registration | undefined>,
    ownerResourceType: NotificationEntityType,
    rolesSelector: RecommendedSelector,
    notificationsSelector: RecommendedSelector,
    referencesSelector: RecommendedSelector,
  ): RegistrationRecommendedBadges {
    const badge = (selector: typeof rolesSelector, filled$: Observable<boolean>) =>
      combineRecommendedBadgeState([
        {
          recommended$: this.store.select(selector).pipe(mapUIConfigStatusToRecommended()),
          filled$,
        },
      ]);
    const notificationsRecommended$ = this.store.select(notificationsSelector).pipe(mapUIConfigStatusToRecommended());
    const notificationsFilled$ = recommendedCollectionFilled(entity$, notificationsRecommended$, (entity) =>
      combineLatest([
        this.store.select(selectOrganizationUuid).pipe(filterNullish()),
        this.actions$.pipe(
          ofType(UserNotificationActions.notificationCreated, UserNotificationActions.notificationChanged),
          filter((action) => action.ownerResourceType === ownerResourceType),
          startWith(null),
        ),
      ]).pipe(
        switchMap(([organizationUuid]) =>
          this.api.getManyNotificationV2GetNotifications({
            ownerResourceType,
            ownerResourceUuid: entity.uuid,
            organizationUuid,
          }).pipe(catchError(() => of([]))),
        ),
      ),
    );
    return {
      roles$: badge(rolesSelector, entity$.pipe(map((entity) => !!entity?.roles?.length))),
      references$: badge(referencesSelector, entity$.pipe(map((entity) => !!entity?.externalReferences?.length))),
      notifications$: badge(notificationsSelector, notificationsFilled$),
    };
  }
}
