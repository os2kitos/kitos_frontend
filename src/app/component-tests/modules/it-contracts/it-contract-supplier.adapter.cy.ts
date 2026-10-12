/// <reference types="cypress" />

import { adaptITContractSupplier } from '../../../shared/models/it-contract/it-contract-supplier.model';

const baseValue = {
  SupplierUuid: 'test-uuid',
  Id: 1,
  OrganizationId: 1,
  Organization: { Uuid: 'org-uuid', Name: 'Org' },
  SupplierId: 2,
  SupplierType: undefined,
  SupplierName: 'Test Supplier',
  IsSupplierDisabled: false,
  HighestCriticalityUuid: null,
  HighestCriticalityName: null,
  HighestCriticalityRank: null,
  ContractsAtHighestCriticalityCsv: null,
  ContractsAtHighestCriticality: [],
};

describe('adaptITContractSupplier CVR fallback', () => {
  it('uses SupplierCvr when present', () => {
    const result = adaptITContractSupplier({
      ...baseValue,
      SupplierCvr: '12345678',
      SupplierForeignCvr: null,
    });

    expect(result?.SupplierCvr).to.equal('12345678');
  });

  it('falls back to SupplierForeignCvr when SupplierCvr is null', () => {
    const result = adaptITContractSupplier({
      ...baseValue,
      SupplierCvr: null,
      SupplierForeignCvr: 'FOREIGN-001',
    });

    expect(result?.SupplierCvr).to.equal('FOREIGN-001');
  });

  it('falls back to SupplierForeignCvr when SupplierCvr is an empty string', () => {
    const result = adaptITContractSupplier({
      ...baseValue,
      SupplierCvr: '',
      SupplierForeignCvr: 'FOREIGN-002',
    });

    expect(result?.SupplierCvr).to.equal('FOREIGN-002');
  });

  it('returns null when both SupplierCvr and SupplierForeignCvr are missing', () => {
    const result = adaptITContractSupplier({
      ...baseValue,
      SupplierCvr: null,
      SupplierForeignCvr: null,
    });

    expect(result?.SupplierCvr).to.equal(null);
  });
});