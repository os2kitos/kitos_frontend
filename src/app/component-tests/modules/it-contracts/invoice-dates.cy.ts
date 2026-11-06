/// <reference types="cypress" />
// Include existing global command typings in Cypress component compilation.
// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference path="../../../../../cypress/support/index.d.ts" />

import { Actions } from '@ngrx/effects';
import { firstValueFrom, of } from 'rxjs';
import { ITContractEffects } from '../../../store/it-contract/effects';
import { ITContractActions } from '../../../store/it-contract/actions';
import { selectOrganizationUuid } from '../../../store/user-store/selectors';
import { selectOverviewContractRoles } from '../../../store/it-contract/selectors';
import { GridDataCacheService } from '../../../shared/services/grid-data-cache.service';
import { GridCellComponent } from '../../../shared/components/grid/grid-cell/grid-cell.component';
import { restoreGridFilterDates } from '../../../shared/helpers/grid-filter.helpers';
import { GridColumn } from '../../../shared/models/grid-column.model';
import { GridState, toODataString } from '../../../shared/models/grid-state.model';
import { adaptITContract } from '../../../shared/models/it-contract/it-contract.model';
import { AppDatePipe } from '../../../shared/pipes/app-date.pipe';
import { GridExportService } from '../../../shared/services/grid-export.service';

const baseContract = {
  SourceEntityUuid: 'contract', DataProcessingAgreements: [], ItSystemUsages: [], RoleAssignments: [],
};
const columns: GridColumn[] = [1, 2, 3, 4].map((period) => ({
  field: `InvoiceDate${period}`, title: `Faktureringsdato ${period}`, hidden: false, filter: 'date', style: 'date',
}));

describe('Contract overview invoice dates', () => {
  it('renders the full date including its year', () => {
    const dataItem = adaptITContract({ ...baseContract, InvoiceDate1: '2028-02-29T00:00:00Z' });
    cy.mount(GridCellComponent, { componentProperties: { column: columns[0], dataItem } });
    cy.get('app-date-cell').should('contain.text', '29-02-2028');
  });

  it('exports full dates and leaves missing periods blank', () => {
    const service = new GridExportService(new AppDatePipe('en-US'));
    const contract = adaptITContract({ ...baseContract, InvoiceDate2: '2027-09-30T00:00:00Z' });
    const exported = service.transformRow(contract, columns);
    expect(exported.InvoiceDate1).to.equal('');
    expect(exported.InvoiceDate2).to.equal('30-09-2027');
    expect(exported.InvoiceDate3).to.equal('');
    expect(exported.InvoiceDate4).to.equal('');
  });

  for (const period of [1, 2, 3, 4]) {
    it(`restores and queries period ${period} as a standard date`, () => {
      const field = `InvoiceDate${period}`;
      const filter = restoreGridFilterDates({ logic: 'and', filters: [
        { field, operator: 'gte', value: '2028-02-29T00:00:00.000Z' },
      ] });
      expect(filter?.filters[0]).to.deep.equal({ field, operator: 'gte', value: new Date('2028-02-29T00:00:00Z') });
      const query = toODataString({ filter, sort: [{ field, dir: 'desc' }] }, { utcDates: true });
      expect(query).to.contain(`${field} ge 2028-02-29T00:00:00`);
      expect(query).to.contain(`$orderby=${field} desc`);
      expect(query).not.to.contain('Month');
    });
  }
});

describe('Contract invoice filters in the effects request', () => {
  for (const all of [false, true]) {
    it(`uses full dates in the HTTP request (all=${all})`, async () => {
      const state: GridState = {
        all, skip: 0, take: 70,
        filter: { logic: 'and', filters: [
          { field: 'InvoiceFrequency', operator: 'eq', value: 'Quarterly' },
          { field: 'InvoiceDate1', operator: 'gte', value: new Date('2026-03-15T00:00:00Z') },
          { field: 'InvoiceDate4', operator: 'lte', value: new Date('2027-09-30T00:00:00Z') },
        ] },
      };
      const get = cy.stub().returns(of({ value: [], '@odata.count': 0 }));
      const store = { select: (selector: unknown) => of(
        selector === selectOrganizationUuid ? 'organization' :
        selector === selectOverviewContractRoles ? [] : { skip: 0, take: 70 },
      ) };
      const dependencies = [
        new Actions(of(ITContractActions.getITContracts(state, undefined))),
        store, {}, {}, { get }, {}, {}, {}, {}, new GridDataCacheService(),
      ] as unknown as ConstructorParameters<typeof ITContractEffects>;
      const effects = new ITContractEffects(...dependencies);
      await firstValueFrom(effects.getItContracts$);
      expect(get).to.have.been.calledOnce;
      const url = decodeURIComponent(get.firstCall.args[0]);
      expect(url).to.contain("InvoiceFrequency eq 'Quarterly'");
      expect(url).to.contain('InvoiceDate1 ge 2026-03-15T00:00:00');
      expect(url).to.contain('InvoiceDate4 le 2027-09-30T00:00:00');
      expect(url).not.to.contain('Month');
      expect(url).not.to.contain('[object Object]');
      if (all) expect(url).not.to.contain('$top');
    });
  }
});
