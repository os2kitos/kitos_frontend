import { provideHttpClient } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { firstValueFrom, of } from 'rxjs';
import { APIDataSensitivityLevelChoice, APIGDPRRegistrationsResponseDTO, ItContractV2Service } from '../../api/v2';
import { getItSystemUsageRecommendedTabBadges } from '../../modules/it-systems/it-system-usages/it-system-usage-details/it-system-usage-recommended-tabs.helper';
import { selectItSystemUsageGdpr, selectItSystemUsageGeneral } from '../../store/it-system-usage/selectors';
import { UIModuleConfigInitialState, uiModuleConfigFeature } from '../../store/organization/ui-module-customization/reducer';
import {
  selectITSystemUsageEnableAndRecommendedGdprDataTypes,
  selectITSystemUsageEnableAndRecommendedGdprDocumentation,
  selectITSystemUsageEnableAndRecommendedGdprPurpose,
  selectITSystemUsageEnableAndRecommendedGeneralPurpose,
  selectITSystemUsageEnableAndRecommendedRegisteredCategories,
} from '../../store/organization/ui-module-customization/selectors';

describe('System usage GDPR tab recommendations', () => {
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
          initialState: { [uiModuleConfigFeature.name]: UIModuleConfigInitialState },
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
    return getItSystemUsageRecommendedTabBadges(store, TestBed.inject(ItContractV2Service), {
      roles$: hidden$,
      references$: hidden$,
      notifications$: hidden$,
    });
  };
  const badge = () => badges().gdpr$;

  for (const section of [
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
});
