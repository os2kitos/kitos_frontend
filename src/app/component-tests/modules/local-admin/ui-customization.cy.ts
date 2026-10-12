import { provideHttpClient } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { provideEffects } from '@ngrx/effects';
import { provideStore, Store } from '@ngrx/store';
import { filter, firstValueFrom, take } from 'rxjs';
import { UiConfigComponent } from '../../../modules/local-admin/ui-config/ui-config.component';
import { UIModuleConfigKey } from '../../../shared/enums/ui-module-config-key';
import { UIModuleConfigActions } from '../../../store/organization/ui-module-customization/actions';
import { UIModuleCustomizationEffects } from '../../../store/organization/ui-module-customization/effects';
import { uiModuleConfigFeature } from '../../../store/organization/ui-module-customization/reducer';
import { selectModuleConfig, selectUIConfigLoading } from '../../../store/organization/ui-module-customization/selectors';

const modules = [
  UIModuleConfigKey.ItSystemUsage,
  UIModuleConfigKey.ItContract,
  UIModuleConfigKey.DataProcessingRegistrations,
];

for (const module of modules) {
  describe(`${module} customization saves`, () => {
    const endpoint = `**/api/v2/internal/organizations/*/ui-customization/${module}`;
    const field = 'app-ui-config-tab-section:first .field-config-option';
    const recommended = `${field} .recommended-checkbox input:not(:disabled)`;

    beforeEach(() => {
      cy.intercept('GET', endpoint, { body: { module, nodes: [] } }).as('getCustomization');
      cy.mount(UiConfigComponent, {
        componentProperties: { moduleKey: module },
        providers: [
          provideHttpClient(),
          provideNoopAnimations(),
          provideStore({
            [uiModuleConfigFeature.name]: uiModuleConfigFeature.reducer,
            User: () => ({ organization: { uuid: '00000000-0000-0000-0000-000000000001' } }),
            Organization: () => ({
              uiRootConfig: { showItSystemModule: true, showItContractModule: true, showDataProcessing: true },
            }),
          }),
          provideEffects(UIModuleCustomizationEffects),
        ],
      }).then(() => {
        TestBed.inject(Store).dispatch(UIModuleConfigActions.getUIModuleConfig({ module }));
      });
      cy.wait('@getCustomization');
      cy.get(recommended).first().should('not.be.checked');
    });

    for (const bulk of [false, true]) {
      it(`uses the ${bulk ? 'bulk' : 'single'} PUT response and keeps the shared cache valid`, () => {
        cy.intercept('PUT', endpoint, (request) => {
          // Deliberately return different values to prove the response is authoritative.
          request.reply({ body: { module, nodes: [] } });
        }).as('putCustomization');
        if (bulk) {
          cy.get('app-ui-config-tab-section').first().find('[data-cy="toggle-all-recommended"]').click();
        } else {
          cy.get(recommended).first().click();
        }
        cy.wait('@putCustomization').its('request.body.nodes').should((nodes) => {
          expect(nodes.some((node: { recommended?: boolean }) => node.recommended === true)).to.equal(true);
        });
        cy.get(recommended).first().should('not.be.checked');
        cy.then(() => {
          const store = TestBed.inject(Store);
          store.select(selectModuleConfig(module)).pipe(take(1)).subscribe((config) => {
            expect(config?.cacheTime).to.be.a('number');
            expect(config?.moduleConfigViewModel?.children?.[0].children?.every((node) => !node.isRecommended))
              .to.equal(true);
          });
          // Simulate dependent components requesting customization after saving.
          store.dispatch(UIModuleConfigActions.getUIModuleConfig({ module }));
          return firstValueFrom(store.select(selectUIConfigLoading).pipe(filter((loading) => !loading)));
        });
        cy.get('@putCustomization.all').should('have.length', 1);
        // Initial loading and the existing read-before-write GET only; no post-PUT GET.
        cy.get('@getCustomization.all').should('have.length', 2);
      });
    }

    it('restores the persisted recommendation after a failed PUT and allows retry', () => {
      cy.intercept('PUT', endpoint, { statusCode: 500 }).as('failedPut');
      cy.get(recommended).first().click();
      cy.wait('@failedPut');
      cy.get(recommended).first().should('not.be.checked');
      cy.intercept('PUT', endpoint, (request) => {
        request.reply({ body: { module, nodes: request.body.nodes } });
      }).as('retryPut');
      cy.get(recommended).first().click();
      cy.wait('@retryPut');
      cy.get(recommended).first().should('be.checked');
    });

    it('restores field visibility after a failed PUT', () => {
      cy.intercept('PUT', endpoint, { statusCode: 500 }).as('failedPut');
      cy.get(`${field} [data-cy="field-checkbox"] button:not(:disabled)`).first().as('fieldButton');
      cy.get('@fieldButton').find('input').should('be.checked');
      cy.get('@fieldButton').click();
      cy.wait('@failedPut');
      cy.get(`${field} [data-cy="field-checkbox"] button:not(:disabled)`).first()
        .find('input').should('be.checked');
    });

    it('restores the persisted value if the read-before-write GET fails', () => {
      cy.intercept('GET', endpoint, { statusCode: 500 }).as('failedGet');
      cy.intercept('PUT', endpoint, { body: { module, nodes: [] } }).as('unexpectedPut');
      cy.get(recommended).first().click();
      cy.wait('@failedGet');
      cy.get(recommended).first().should('not.be.checked');
      cy.get('@unexpectedPut.all').should('have.length', 0);
    });
  });
}
