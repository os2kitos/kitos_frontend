import { provideHttpClient } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { firstValueFrom, of } from 'rxjs';
import { APIDataSensitivityLevelChoice, APIGDPRRegistrationsResponseDTO, APIItSystemUsageResponseDTO, ItContractV2Service } from '../../api/v2';
import { getItSystemUsageRecommendedTabBadges } from '../../modules/it-systems/it-system-usages/it-system-usage-details/it-system-usage-recommended-tabs.helper';
import { selectItSystemUsageGdpr, selectItSystemUsageGeneral, selectItSystemUsageHasAssociatedContracts } from '../../store/it-system-usage/selectors';
import { itSystemUsageFeature, itSystemUsageInitialState } from '../../store/it-system-usage/reducer';
import { ITSystemUsageActions } from '../../store/it-system-usage/actions';
import { adaptITSystemUsage } from '../../shared/models/it-system-usage/it-system-usage.model';
import { ItSystemUsageDetailsContractsComponentStore } from '../../modules/it-systems/it-system-usages/it-system-usage-details/it-system-usage-details-contracts/it-system-usage-details-contracts.component-store';
import { UIModuleConfigInitialState, uiModuleConfigFeature } from '../../store/organization/ui-module-customization/reducer';
import {
  selectITSystemUsageEnableAndRecommendedGdprDataTypes,
  selectITSystemUsageEnableAndRecommendedGdprDocumentation,
  selectITSystemUsageEnableAndRecommendedGdprPurpose,
  selectITSystemUsageEnableAndRecommendedGdprPersonalDataDeletion,
  selectITSystemUsageEnableAndRecommendedGeneralPurpose,
  selectITSystemUsageEnableAndRecommendedRegisteredCategories,
  selectITSystemUsageEnableAndRecommendedAssociatedContracts,
  selectITSystemUsageEnableAndRecommendedSelectContractToDetermineIfItSystemIsActive,
} from '../../store/organization/ui-module-customization/selectors';

describe('System usage tab recommendations', () => {
  let store: MockStore;
  const emptyGdpr: APIGDPRRegistrationsResponseDTO = {
    dataSensitivityLevels: [],
    sensitivePersonData: [],
    specificPersonalData: [],
    registeredDataCategories: [],
    technicalPrecautionsApplied: [],
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideMockStore({
          initialState: {
            [uiModuleConfigFeature.name]: UIModuleConfigInitialState,
            [itSystemUsageFeature.name]: itSystemUsageInitialState,
          },
        }),
      ],
    });
    store = TestBed.inject(MockStore);
    store.overrideSelector(selectItSystemUsageGdpr, emptyGdpr);
  });

  afterEach(() => {
    store.resetSelectors();
    TestBed.resetTestingModule();
  });

  const badges = () => {
    const hidden$ = of({ visible: false, filled: false });
    return getItSystemUsageRecommendedTabBadges(store, {
      roles$: hidden$,
      references$: hidden$,
      notifications$: hidden$,
    });
  };
  const badge = () => badges().gdpr$;

  const deletionDetails: Partial<APIGDPRRegistrationsResponseDTO> = {
    personalDataDeletionMethod: 'AutomaticallyBySystem',
    personalDataDeletionDeadlineType: { uuid: 'deadline', name: 'Deadline' },
    personalDataDeletionProcedureDocumentation: { url: 'https://example.com/procedure' },
    personalDataDeletionResponsibleUser: { uuid: 'user', name: 'User' },
    personalDataDeletionVerifiedDate: '2026-10-23',
    personalDataDeletionVerificationDocumentation: { url: 'https://example.com/verification' },
  };

  for (const capability of ['IndividualRecords', 'BulkDeletion'] as const) {
    it(`updates the GDPR badge as ${capability} deletion details are filled and cleared`, async () => {
      store.overrideSelector(selectITSystemUsageEnableAndRecommendedGdprPersonalDataDeletion, { enabled: true, recommended: true });
      const gdprSelector = store.overrideSelector(selectItSystemUsageGdpr, {
        ...emptyGdpr, personalDataDeletionCapability: capability,
      });
      const badge$ = badge();
      expect(await firstValueFrom(badge$)).to.deep.equal({ visible: true, filled: false });
      const complete = { ...emptyGdpr, ...deletionDetails, personalDataDeletionCapability: capability };
      gdprSelector.setResult(complete);
      store.refreshState();
      expect(await firstValueFrom(badge$)).to.deep.equal({ visible: true, filled: true });

      for (const field of Object.keys(deletionDetails)) {
        gdprSelector.setResult({ ...complete, [field]: undefined });
        store.refreshState();
        expect((await firstValueFrom(badge$)).filled, field).to.equal(false);
      }
      gdprSelector.setResult({ ...emptyGdpr, personalDataDeletionCapability: 'No' });
      store.refreshState();
      expect(await firstValueFrom(badge$)).to.deep.equal({ visible: true, filled: true });
      gdprSelector.setResult(emptyGdpr);
      store.refreshState();
      expect(await firstValueFrom(badge$)).to.deep.equal({ visible: true, filled: false });
    });
  }

  for (const section of [
    {
      name: 'personal data deletion',
      selector: selectITSystemUsageEnableAndRecommendedGdprPersonalDataDeletion,
      value: { personalDataDeletionCapability: 'No' as const },
    },
    {
      name: 'data types',
      selector: selectITSystemUsageEnableAndRecommendedGdprDataTypes,
      value: { dataSensitivityLevels: [APIDataSensitivityLevelChoice.None] },
    },
    {
      name: 'registered categories',
      selector: selectITSystemUsageEnableAndRecommendedRegisteredCategories,
      value: { registeredDataCategories: [{ uuid: 'category', name: 'Employees' }] },
    },
    {
      name: 'directory documentation links',
      selector: selectITSystemUsageEnableAndRecommendedGdprDocumentation,
      value: { directoryDocumentation: { url: 'https://example.com/register', name: 'Register' } },
    },
  ]) {
    it(`shows a warning for empty recommended ${section.name} and turns green when selected`, async () => {
      store.overrideSelector(section.selector, { enabled: true, recommended: true });
      const badge$ = badge();
      expect(await firstValueFrom(badge$)).to.deep.equal({ visible: true, filled: false });
      store.overrideSelector(selectItSystemUsageGdpr, { ...emptyGdpr, ...section.value });
      store.refreshState();
      expect(await firstValueFrom(badge$)).to.deep.equal({ visible: true, filled: true });
    });

    it(`ignores disabled recommended ${section.name}`, async () => {
      store.overrideSelector(section.selector, { enabled: false, recommended: true });
      expect((await firstValueFrom(badge())).visible).to.equal(false);
    });

    it(`does not show a badge for non-recommended ${section.name}`, async () => {
      store.overrideSelector(section.selector, { enabled: true, recommended: false });
      expect((await firstValueFrom(badge())).visible).to.equal(false);
    });
  }

  it('requires both checkbox sections when both are recommended', async () => {
    store.overrideSelector(selectITSystemUsageEnableAndRecommendedGdprDataTypes, { enabled: true, recommended: true });
    store.overrideSelector(selectITSystemUsageEnableAndRecommendedRegisteredCategories, { enabled: true, recommended: true });
    store.overrideSelector(selectItSystemUsageGdpr, {
      ...emptyGdpr,
      dataSensitivityLevels: [APIDataSensitivityLevelChoice.None],
    });
    expect(await firstValueFrom(badge())).to.deep.equal({ visible: true, filled: false });
  });

  it('requires a URL for recommended directory documentation', async () => {
    store.overrideSelector(selectITSystemUsageEnableAndRecommendedGdprDocumentation, { enabled: true, recommended: true });
    store.overrideSelector(selectItSystemUsageGdpr, {
      ...emptyGdpr,
      directoryDocumentation: { name: 'Register' },
    });

    expect(await firstValueFrom(badge())).to.deep.equal({ visible: true, filled: false });
  });

  it('does not let recommended GDPR purpose affect the front-page badge', async () => {
    store.overrideSelector(selectItSystemUsageGeneral, undefined);
    store.overrideSelector(selectITSystemUsageEnableAndRecommendedGdprPurpose, { enabled: true, recommended: true });
    store.overrideSelector(selectITSystemUsageEnableAndRecommendedGeneralPurpose, {
      enabled: false,
      recommended: false,
    });
    const tabBadges = badges();

    expect(await firstValueFrom(tabBadges.gdpr$)).to.deep.equal({ visible: true, filled: false });
    expect((await firstValueFrom(tabBadges.frontpage$)).visible).to.equal(false);
  });

  for (const filled of [false, true]) {
    it(`immediately shares the ${filled ? 'filled' : 'empty'} Contracts badge without requesting contracts`, async () => {
      store.overrideSelector(selectItSystemUsageHasAssociatedContracts, filled);
      store.overrideSelector(selectITSystemUsageEnableAndRecommendedAssociatedContracts, { enabled: true, recommended: true });
      const request = cy.stub(TestBed.inject(ItContractV2Service), 'getManyItContractV2GetItContracts');
      const tabBadges = badges();
      expect(await firstValueFrom(tabBadges.contracts$)).to.deep.equal({ visible: true, filled });
      expect(await firstValueFrom(tabBadges.associatedContracts$)).to.deep.equal({ visible: true, filled });
      expect(request).not.to.have.been.called;
    });
  }

  it('uses associated contracts from the overview even without a main contract', () => {
    const overview = adaptITSystemUsage({
      SourceEntityUuid: 'usage',
      RoleAssignments: [],
      AssociatedContracts: [{ ItContractUuid: 'contract', ItContractName: 'Contract' }],
    });
    expect(overview).not.to.equal(undefined);
    if (!overview) throw new Error('Overview fixture could not be adapted');
    const state = itSystemUsageFeature.reducer(
      itSystemUsageInitialState,
      ITSystemUsageActions.getITSystemUsagesSuccess([overview], 1),
    );
    cy.fixture<APIItSystemUsageResponseDTO>('it-system-usage/it-system-usage-no-main-contract.json').then((usage) => {
      expect(selectItSystemUsageHasAssociatedContracts.projector(state, { ...usage, uuid: 'usage' })).to.equal(true);
      const emptyState = itSystemUsageFeature.reducer(
        state,
        ITSystemUsageActions.getITSystemUsagesSuccess([{ ...overview, AssociatedContracts: [] }], 1),
      );
      expect(selectItSystemUsageHasAssociatedContracts.projector(emptyState, { ...usage, uuid: 'usage' })).to.equal(false);
    });
  });

  it('keeps the cached badge when refreshing a usage and does not reuse another usage collection', () => {
    const state = itSystemUsageFeature.reducer(
      itSystemUsageInitialState,
      ITSystemUsageActions.associatedContractsLoaded('usage', ['contract']),
    );
    cy.fixture<APIItSystemUsageResponseDTO>('it-system-usage/it-system-usage-no-main-contract.json').then((usage) => {
      expect(selectItSystemUsageHasAssociatedContracts.projector(state, { ...usage, uuid: 'usage' })).to.equal(true);
      expect(selectItSystemUsageHasAssociatedContracts.projector(state, { ...usage, uuid: 'another' })).to.equal(undefined);
      const refreshed = itSystemUsageFeature.reducer(state, ITSystemUsageActions.getITSystemUsage('usage'));
      expect(refreshed.associatedContractUuidsByUsage).to.equal(state.associatedContractUuidsByUsage);
      const emptied = itSystemUsageFeature.reducer(refreshed, ITSystemUsageActions.associatedContractsLoaded('usage', []));
      expect(selectItSystemUsageHasAssociatedContracts.projector(emptied, { ...usage, uuid: 'usage' })).to.equal(false);
    });
  });

  it('uses a main contract as evidence of an association when no collection has been loaded', () => {
    cy.fixture<APIItSystemUsageResponseDTO>('it-system-usage/it-system-usage-valid-main-contract.json').then((usage) => {
      expect(selectItSystemUsageHasAssociatedContracts.projector(itSystemUsageInitialState, usage)).to.equal(true);
    });
  });

  it('still requires a main contract when that field is recommended', async () => {
    store.overrideSelector(selectItSystemUsageHasAssociatedContracts, true);
    store.overrideSelector(selectItSystemUsageGeneral, undefined);
    store.overrideSelector(selectITSystemUsageEnableAndRecommendedAssociatedContracts, { enabled: true, recommended: true });
    store.overrideSelector(selectITSystemUsageEnableAndRecommendedSelectContractToDetermineIfItSystemIsActive, { enabled: true, recommended: true });
    const tabBadges = badges();
    expect(await firstValueFrom(tabBadges.associatedContracts$)).to.deep.equal({ visible: true, filled: true });
    expect(await firstValueFrom(tabBadges.contracts$)).to.deep.equal({ visible: true, filled: false });
  });

  it('requests associated contracts through NgRx without making a direct request', () => {
    const request = cy.stub(TestBed.inject(ItContractV2Service), 'getManyItContractV2GetItContracts');
    const dispatch = cy.stub(store, 'dispatch');
    const tableStore = new ItSystemUsageDetailsContractsComponentStore(store);
    tableStore.getAssociatedContracts('usage');
    expect(dispatch).to.have.been.calledOnceWithExactly(ITSystemUsageActions.getAssociatedContracts('usage'));
    expect(request).not.to.have.been.called;
  });
});
