import { RegistrationRecommendedBadges, recommendedField, hasText, hasValue } from 'src/app/shared/helpers/registration-recommended-badges.helper';
import { Store } from '@ngrx/store';
import { Observable, combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';
import { APIYesNoIrrelevantChoice } from 'src/app/api/v2';
import {
  RecommendedBadgeState,
  combineRecommendedBadgeState,
  mapUIConfigStatusToRecommended,
} from 'src/app/shared/helpers/observable-helpers';
import { selectDataProcessing } from 'src/app/store/data-processing/selectors';
import {
  selectDprEnableAndRecommendedAgreementConcluded,
  selectDprEnableAndRecommendedDataResponsible,
  selectDprEnableAndRecommendedLastChangedAt,
  selectDprEnableAndRecommendedLastChangedBy,
  selectDprEnableAndRecommendedMainContract,
  selectDprEnableAndRecommendedName,
  selectDprEnableAndRecommendedProcessors,
  selectDprEnableAndRecommendedSubProcessors,
  selectDprEnableAndRecommendedOversights,
  selectDprEnableAndRecommendedOversightInterval,
  selectDprEnableAndRecommendedOversightOptions,
  selectDprEnableAndRecommendedResponsibleOrgUnit,
  selectDprEnableAndRecommendedScheduledInspectionDate,
  selectDprEnableAndRecommendedStatus,
  selectDprEnableAndRecommendedSystemUsages,
  selectDprEnableAndRecommendedTransferBasis,
} from 'src/app/store/organization/ui-module-customization/selectors';


export interface DataProcessingRecommendedTabBadges extends RegistrationRecommendedBadges {
  frontpage$: Observable<RecommendedBadgeState>;
  oversight$: Observable<RecommendedBadgeState>;
  itContracts$: Observable<RecommendedBadgeState>;
  itSystems$: Observable<RecommendedBadgeState>;
}

/**
 * Combines module-specific tab rules with the shared roles, advis and references
 * streams. Badge state is available even before the user visits a tab; collections
 * absent from the loaded registration are fetched only when recommended.
 */
export function getDataProcessingRecommendedTabBadges(
  store: Store,
  registrationBadges: RegistrationRecommendedBadges,
): DataProcessingRecommendedTabBadges {
  const dpr$ = store.select(selectDataProcessing);

  const field = recommendedField(store, dpr$);

  const agreementConcludedRecommended$ = store
    .select(selectDprEnableAndRecommendedAgreementConcluded)
    .pipe(mapUIConfigStatusToRecommended());
  const isAgreementConcludedYes$ = dpr$.pipe(
    map((dpr) => dpr?.general.isAgreementConcluded === APIYesNoIrrelevantChoice.Yes),
  );
  const agreementConclusionDateRecommended$ = combineLatest([
    agreementConcludedRecommended$,
    isAgreementConcludedYes$,
  ]).pipe(map(([recommended, isYes]) => recommended && isYes));

  const frontpage$ = combineRecommendedBadgeState([
    field(selectDprEnableAndRecommendedProcessors, (dpr) => !!dpr?.general.dataProcessors?.length),
    field(selectDprEnableAndRecommendedSubProcessors, (dpr) => !!dpr?.general.subDataProcessors?.length),
    field(selectDprEnableAndRecommendedName, (dpr) => hasText(dpr?.name)),
    field(selectDprEnableAndRecommendedDataResponsible, (dpr) => hasValue(dpr?.general.dataResponsible)),
    field(selectDprEnableAndRecommendedDataResponsible, (dpr) => hasText(dpr?.general.dataResponsibleRemark)),
    field(selectDprEnableAndRecommendedStatus, (dpr) => hasValue(dpr?.general.validity.valid)),
    field(selectDprEnableAndRecommendedLastChangedBy, (dpr) => hasText(dpr?.lastModifiedBy?.name)),
    field(selectDprEnableAndRecommendedLastChangedAt, (dpr) => hasValue(dpr?.lastModified)),
    field(selectDprEnableAndRecommendedResponsibleOrgUnit, (dpr) => hasValue(dpr?.general.responsibleOrganizationUnit)),
    field(selectDprEnableAndRecommendedTransferBasis, (dpr) => hasValue(dpr?.general.basisForTransfer)),
    {
      recommended$: agreementConcludedRecommended$,
      filled$: dpr$.pipe(map((dpr) => hasValue(dpr?.general.isAgreementConcluded))),
    },
    {
      recommended$: agreementConclusionDateRecommended$,
      filled$: dpr$.pipe(map((dpr) => hasValue(dpr?.general.agreementConcludedAt))),
    },
    {
      recommended$: agreementConcludedRecommended$,
      filled$: dpr$.pipe(map((dpr) => hasText(dpr?.general.isAgreementConcludedRemark))),
    },
  ]);

  const oversight$ = combineRecommendedBadgeState([
    field(selectDprEnableAndRecommendedOversights, (dpr) => !!dpr?.oversight.oversightDates?.length),
    field(selectDprEnableAndRecommendedOversightOptions, (dpr) => !!dpr?.oversight.oversightOptions?.length),
    field(selectDprEnableAndRecommendedOversightInterval, (dpr) => hasValue(dpr?.oversight.oversightInterval)),
    field(selectDprEnableAndRecommendedOversightInterval, (dpr) => hasText(dpr?.oversight.oversightIntervalRemark)),
    field(
      selectDprEnableAndRecommendedScheduledInspectionDate,
      (dpr) => hasValue(dpr?.oversight.oversightScheduledInspectionDate),
    ),
    field(selectDprEnableAndRecommendedOversightOptions, (dpr) => hasText(dpr?.oversight.oversightOptionsRemark)),
  ]);

  const itContracts$ = combineRecommendedBadgeState([
    field(selectDprEnableAndRecommendedMainContract, (dpr) => hasValue(dpr?.general.mainContract)),
  ]);

  const itSystems$ = combineRecommendedBadgeState([
    field(selectDprEnableAndRecommendedSystemUsages, (dpr) => !!dpr?.systemUsages?.length),
  ]);

  return { ...registrationBadges, frontpage$, oversight$, itContracts$, itSystems$ };
}
