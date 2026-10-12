import { RegistrationRecommendedBadges, recommendedField, hasText, hasValue } from 'src/app/shared/helpers/registration-recommended-badges.helper';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { ItSystemUsageInternalV2Service } from 'src/app/api/v2';
import {
  RecommendedBadgeState,
  recommendedCollectionFilled,
  combineRecommendedBadgeState,
  mapUIConfigStatusToRecommended,
} from 'src/app/shared/helpers/observable-helpers';
import { selectContract } from 'src/app/store/it-contract/selectors';
import {
  selectItContractEnableAndRecommendContractName,
  selectItContractEnableAndRecommendedAgreementElements,
  selectItContractEnableAndRecommendedDataProcessingRegistrations,
  selectItContractEnableAndRecommendedSystemUsages,
  selectItContractEnableAndRecommendedRelations,
  selectItContractsEnableAndRecommendedExternalPayment,
  selectItContractsEnableAndRecommendedInternalPayment,

  selectItContractEnableAndRecommendedContractId,
  selectItContractEnableAndRecommendExternalContactPerson,
  selectItContractEnableAndRecommendExternalContactPersonEmail,
  selectItContractEnableAndRecommendExternalContactPersonPhone,
  selectItContractsEnableAndRecommendedAgreementDeadlines,
  selectItContractsEnableAndRecommendedAgreementPeriod,
  selectItContractsEnableAndRecommendedContractType,
  selectItContractsEnableAndRecommendedCriticality,
  selectItContractsEnableAndRecommendedExternalSigner,
  selectItContractsEnableAndRecommendedInternalSigner,
  selectItContractsEnableAndRecommendedNotes,
  selectItContractsEnableAndRecommendedPaymentModel,
  selectItContractsEnableAndRecommendedProcurementPlan,
  selectItContractsEnableAndRecommendedProcurementStrategy,
  selectItContractsEnableAndRecommendedPurchaseForm,
  selectItContractsEnableAndRecommendedResponsibleUnit,
  selectItContractsEnableAndRecommendedSupplier,
  selectItContractsEnableAndRecommendedTemplate,
  selectItContractsEnableAndRecommendedTermination,
} from 'src/app/store/organization/ui-module-customization/selectors';


export interface ItContractRecommendedTabBadges extends RegistrationRecommendedBadges {
  frontpage$: Observable<RecommendedBadgeState>;
  deadlines$: Observable<RecommendedBadgeState>;
  economy$: Observable<RecommendedBadgeState>;
  itSystems$: Observable<RecommendedBadgeState>;
  dataProcessing$: Observable<RecommendedBadgeState>;
}

/**
 * Combines module-specific tab rules with the shared roles, advis and references
 * streams. Badge state is available even before the user visits a tab; collections
 * absent from the loaded registration are fetched only when recommended.
 */
export function getItContractRecommendedTabBadges(
  store: Store,
  relationsApi: ItSystemUsageInternalV2Service,
  registrationBadges: RegistrationRecommendedBadges,
): ItContractRecommendedTabBadges {
  const contract$ = store.select(selectContract);

  const field = recommendedField(store, contract$);

  const frontpage$ = combineRecommendedBadgeState([
    field(selectItContractEnableAndRecommendContractName, (c) => hasText(c?.name)),
    field(selectItContractEnableAndRecommendedContractId, (c) => hasText(c?.general.contractId)),
    field(selectItContractsEnableAndRecommendedContractType, (c) => hasValue(c?.general.contractType)),
    field(selectItContractsEnableAndRecommendedTemplate, (c) => hasValue(c?.general.contractTemplate)),
    field(selectItContractsEnableAndRecommendedCriticality, (c) => hasValue(c?.general.criticality)),
    field(selectItContractsEnableAndRecommendedPurchaseForm, (c) => hasValue(c?.procurement.purchaseType)),
    field(selectItContractsEnableAndRecommendedAgreementPeriod, (c) => hasValue(c?.general.validity.validFrom)),
    field(selectItContractsEnableAndRecommendedAgreementPeriod, (c) => hasValue(c?.general.validity.validTo)),
    field(selectItContractsEnableAndRecommendedNotes, (c) => hasText(c?.general.notes)),
    field(selectItContractsEnableAndRecommendedResponsibleUnit, (c) => hasValue(c?.responsible.organizationUnit)),
    field(selectItContractsEnableAndRecommendedInternalSigner, (c) => hasText(c?.responsible.signedBy)),
    field(selectItContractsEnableAndRecommendedInternalSigner, (c) => hasValue(c?.responsible.signedAt)),
    field(selectItContractEnableAndRecommendExternalContactPerson, (c) => hasText(c?.supplier.contactPerson)),
    field(selectItContractEnableAndRecommendExternalContactPersonPhone, (c) => hasText(c?.supplier.contactPhoneNumber)),
    field(selectItContractEnableAndRecommendExternalContactPersonEmail, (c) => hasText(c?.supplier.contactEmail)),
    field(selectItContractsEnableAndRecommendedSupplier, (c) => hasValue(c?.supplier.organization)),
    field(selectItContractsEnableAndRecommendedExternalSigner, (c) => hasText(c?.supplier.signedBy)),
    field(selectItContractsEnableAndRecommendedExternalSigner, (c) => hasValue(c?.supplier.signedAt)),
    field(selectItContractsEnableAndRecommendedProcurementStrategy, (c) => hasValue(c?.procurement.procurementStrategy)),
    field(selectItContractsEnableAndRecommendedProcurementPlan, (c) => hasValue(c?.procurement.procurementPlan)),
  ]);

  const deadlines$ = combineRecommendedBadgeState([
    field(selectItContractsEnableAndRecommendedAgreementDeadlines, (c) => hasValue(c?.agreementPeriod.durationYears)),
    field(selectItContractsEnableAndRecommendedAgreementDeadlines, (c) => hasValue(c?.agreementPeriod.durationMonths)),
    field(selectItContractsEnableAndRecommendedAgreementDeadlines, (c) => hasValue(c?.agreementPeriod.extensionOptions)),
    field(selectItContractsEnableAndRecommendedAgreementDeadlines, (c) => hasValue(c?.agreementPeriod.extensionOptionsUsed)),
    field(selectItContractsEnableAndRecommendedAgreementDeadlines, (c) => hasValue(c?.agreementPeriod.irrevocableUntil)),
    field(selectItContractsEnableAndRecommendedTermination, (c) => hasValue(c?.termination.terminatedAt)),
    field(selectItContractsEnableAndRecommendedTermination, (c) => hasValue(c?.termination.terms.noticePeriodMonths)),
    field(selectItContractsEnableAndRecommendedTermination, (c) => hasValue(c?.termination.terms.noticePeriodExtendsCurrent)),
    field(selectItContractsEnableAndRecommendedTermination, (c) => hasValue(c?.termination.terms.noticeByEndOf)),
  ]);

  const economy$ = combineRecommendedBadgeState([
    field(selectItContractsEnableAndRecommendedExternalPayment, (c) => !!c?.payments.external?.length),
    field(selectItContractsEnableAndRecommendedInternalPayment, (c) => !!c?.payments.internal?.length),
    field(selectItContractsEnableAndRecommendedPaymentModel, (c) => hasValue(c?.paymentModel.operationsRemunerationStartedAt)),
    field(selectItContractsEnableAndRecommendedPaymentModel, (c) => hasValue(c?.paymentModel.paymentFrequency)),
    field(selectItContractsEnableAndRecommendedPaymentModel, (c) => hasValue(c?.paymentModel.paymentModel)),
    field(selectItContractsEnableAndRecommendedPaymentModel, (c) => hasValue(c?.paymentModel.priceRegulation)),
  ]);

  const relationsRecommended$ = store.select(selectItContractEnableAndRecommendedRelations)
    .pipe(mapUIConfigStatusToRecommended());
  const itSystems$ = combineRecommendedBadgeState([
    field(selectItContractEnableAndRecommendedAgreementElements, (c) => !!c?.general.agreementElements?.length),
    field(selectItContractEnableAndRecommendedSystemUsages, (c) => !!c?.systemUsages?.length),
    {
      recommended$: relationsRecommended$,
      filled$: recommendedCollectionFilled(contract$, relationsRecommended$, (c) =>
        relationsApi.getManyItSystemUsageInternalV2GetRelations({ contractUuid: c.uuid })),
    },
  ]);

  const dataProcessing$ = combineRecommendedBadgeState([
    field(
      selectItContractEnableAndRecommendedDataProcessingRegistrations,
      (c) => !!c?.dataProcessingRegistrations?.length,
    ),
  ]);

  return { ...registrationBadges, frontpage$, deadlines$, economy$, itSystems$, dataProcessing$ };
}
