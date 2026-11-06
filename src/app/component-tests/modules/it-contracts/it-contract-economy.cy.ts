import { TestBed } from '@angular/core/testing';
import { MatIconTestingModule } from '@angular/material/icon/testing';
import { DatePickerComponent } from '../../../shared/components/datepicker/datepicker.component';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { Actions } from '@ngrx/effects';
import { firstValueFrom, EMPTY } from 'rxjs';
import { APIInvoiceFrequencyChoice } from '../../../api/v2';
import { ItContractEconomyComponent } from '../../../modules/it-contracts/it-contract-details/it-contract-economy/it-contract-economy.component';
import { NotificationService } from '../../../shared/services/notification.service';
import { selectItContractHasModifyPermissions, selectItContractPaymentModel } from '../../../store/it-contract/selectors';
import { UIModuleConfigKey } from '../../../shared/enums/ui-module-config-key';
import { UIConfigService } from '../../../shared/services/ui-config-services/ui-config.service';
import {
  selectItContractsEnableAndRecommendedInvoiceFrequency,
  selectItContractsEnableAndRecommendedPaymentModel,
} from '../../../store/organization/ui-module-customization/selectors';

describe('Invoice UI customization', () => {
  it('configures invoice visibility and recommendation independently of the payment model', () => {
    const service = new UIConfigService();
    const module = UIModuleConfigKey.ItContract;
    const fullKey = `${module}.economy.invoiceFrequency`;
    expect(service.getAllNodesOfBlueprint(module).some(node => node.fullKey === fullKey)).to.equal(true);
    for (const enabled of [false, true]) {
      const config = service.buildUIModuleConfig([
        { fullKey, enabled, recommended: true },
        { fullKey: `${module}.economy.paymentModel`, enabled: false, recommended: false },
      ], module);
      expect(selectItContractsEnableAndRecommendedInvoiceFrequency.projector(config))
        .to.deep.equal({ enabled, recommended: true });
      expect(selectItContractsEnableAndRecommendedPaymentModel.projector(config))
        .to.deep.equal({ enabled: false, recommended: false });
    }
  });
});

describe('Contract invoice dates', () => {
  let store: MockStore;
  let component: ItContractEconomyComponent;

  beforeEach(() => {
    cy.clock(new Date(2025, 0, 1, 12).getTime(), ['Date']).then(() => {
      TestBed.configureTestingModule({ providers: [provideMockStore()] });
      store = TestBed.inject(MockStore);
      store.overrideSelector(selectItContractHasModifyPermissions, true);
      component = new ItContractEconomyComponent(store, new NotificationService(new Actions(EMPTY), store));
    });
  });

  afterEach(() => {
    component.ngOnDestroy();
    store.resetSelectors();
    TestBed.resetTestingModule();
  });

  it('loads and saves full dates outside the selected calendar period and preserves other periods', () => {
    store.overrideSelector(selectItContractPaymentModel, {
      invoiceFrequency: APIInvoiceFrequencyChoice.Quarterly,
      invoiceDates: [{ period: 2, date: '2026-04-10' }],
    });
    component.ngOnInit();
    expect(component.economyFormGroup.controls.invoiceDate2.value).to.deep.equal(new Date('2026-04-10'));
    const save = cy.spy(component, 'patchEconomy');
    const date = new Date(2025, 11, 31);
    component.onInvoiceDateChange(1, date);
    expect(save).to.have.been.calledWith({ paymentModel: {
      invoiceFrequency: APIInvoiceFrequencyChoice.Quarterly,
      invoiceDates: [
        { period: 1, date: date.toDateString() },
        { period: 2, date: new Date('2026-04-10').toDateString() },
      ],
    } });
    component.onInvoiceDateChange(2, undefined);
    expect(save.lastCall.args[0].paymentModel?.invoiceDates).to.deep.equal([{ period: 1, date: date.toDateString() }]);
    component.onInvoiceFrequencyChange(APIInvoiceFrequencyChoice.Yearly);
    expect(save.lastCall.args[0].paymentModel?.invoiceDates).to.deep.equal([]);
    expect(component.economyFormGroup.controls.invoiceDate1.value).to.equal(undefined);
  });

  it('keeps invoice date controls disabled without modify permission', () => {
    store.overrideSelector(selectItContractHasModifyPermissions, false);
    store.overrideSelector(selectItContractPaymentModel, { invoiceFrequency: APIInvoiceFrequencyChoice.Yearly });
    component.ngOnInit();
    expect(component.economyFormGroup.controls.invoiceDate1.disabled).to.equal(true);
  });

  it('allows typing the first half date while the second half sets its maximum', () => {
    store.overrideSelector(selectItContractPaymentModel, {
      invoiceFrequency: APIInvoiceFrequencyChoice.HalfYearly,
      invoiceDates: [{ period: 2, date: '2026-11-26' }],
    });
    component.ngOnInit();
    const save = cy.spy(component, 'patchEconomy');
    TestBed.resetTestingModule();
    cy.mount(`
      @for (period of economy.invoicePeriods; track period.period) {
        <app-datepicker [formGroup]="economy.economyFormGroup"
          [formName]="'invoiceDate' + period.period"
          [minDate]="economy.getMinimumInvoiceDate(period.period)"
          [maxDate]="economy.getMaximumInvoiceDate(period.period)"
          (valueChange)="economy.onInvoiceDateChange(period.period, $event)" />
      }
    `, {
      imports: [DatePickerComponent, MatIconTestingModule],
      componentProperties: { economy: component },
    });
    cy.get('input').first().type('01-11-2026').should('have.value', '01-11-2026').blur();
    cy.then(() => expect(save).to.have.been.calledOnce);
  });

  it('rejects yesterday, allows today and preserves the lower bound across empty periods', () => {
    store.overrideSelector(selectItContractPaymentModel, { invoiceFrequency: APIInvoiceFrequencyChoice.Quarterly });
    component.ngOnInit();
    const save = cy.spy(component, 'patchEconomy');
    const today = new Date(2025, 0, 1);

    expect(component.getMinimumInvoiceDate(3)).to.deep.equal(today);
    component.onInvoiceDateChange(3, new Date(2024, 11, 31));
    expect(save).not.to.have.been.called;
    expect(component.economyFormGroup.controls.invoiceDate3.invalid).to.equal(true);
    component.onInvoiceDateChange(3, today);
    expect(save).to.have.been.calledOnce;
    expect(component.economyFormGroup.controls.invoiceDate3.valid).to.equal(true);
  });

  it('allows the date 100 years from today and rejects later dates', () => {
    store.overrideSelector(selectItContractPaymentModel, { invoiceFrequency: APIInvoiceFrequencyChoice.Yearly });
    component.ngOnInit();
    const save = cy.spy(component, 'patchEconomy');
    const boundary = component.latestInvoiceDate;
    const tomorrow = new Date(boundary);
    tomorrow.setDate(tomorrow.getDate() + 1);

    component.onInvoiceDateChange(1, new Date(3999, 10, 1));
    component.onInvoiceDateChange(1, tomorrow);
    expect(save).not.to.have.been.called;
    expect(component.economyFormGroup.controls.invoiceDate1.invalid).to.equal(true);
    component.onInvoiceDateChange(1, boundary);
    expect(save).to.have.been.calledOnce;
    expect(component.economyFormGroup.controls.invoiceDate1.valid).to.equal(true);
  });

  it('enforces date order across gaps, allows equal dates and supports corrections and clearing', () => {
    store.overrideSelector(selectItContractPaymentModel, {
      invoiceFrequency: APIInvoiceFrequencyChoice.Quarterly,
      invoiceDates: [{ period: 1, date: '2026-04-10' }],
    });
    component.ngOnInit();
    const save = cy.spy(component, 'patchEconomy');

    component.onInvoiceDateChange(3, new Date(2026, 3, 9));
    expect(save).not.to.have.been.called;
    component.onInvoiceDateChange(3, new Date(2026, 3, 10));
    expect(save).to.have.been.calledOnce;
    component.onInvoiceDateChange(1, new Date(2026, 3, 11));
    expect(save).to.have.been.calledOnce;
    component.onInvoiceDateChange(1, undefined);
    expect(save).to.have.been.calledTwice;
  });

  it('marks the date collection filled with one saved date, regardless of empty periods', async () => {
    const model = store.overrideSelector(selectItContractPaymentModel, {
      invoiceFrequency: APIInvoiceFrequencyChoice.Quarterly,
      invoiceDates: [],
    });
    component.ngOnInit();
    expect(await firstValueFrom(component.invoiceDatesFilled$)).to.equal(false);
    model.setResult({
      invoiceFrequency: APIInvoiceFrequencyChoice.Quarterly,
      invoiceDates: [{ period: 2, date: '2026-04-10' }],
    });
    store.refreshState();
    expect(await firstValueFrom(component.invoiceDatesFilled$)).to.equal(true);
    expect(component.economyFormGroup.controls.invoiceDate1.value).to.equal(undefined);
  });
});
