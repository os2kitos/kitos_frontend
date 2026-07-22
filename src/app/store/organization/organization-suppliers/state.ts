import { EntityState } from '@ngrx/entity';
import { ShallowOrganization } from 'src/app/shared/models/organization/shallow-organization.model';

export interface OrganizationSuppliersState extends EntityState<ShallowOrganization> {
  suppliers: ShallowOrganization[];
  suppliersCacheTime: number | undefined;
  availableSuppliers: ShallowOrganization[];
  availableSuppliersCacheTime: number | undefined;
  suppliersLoading: boolean;
}
