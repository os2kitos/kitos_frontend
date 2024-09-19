import { EntityState } from '@ngrx/entity';
import { GridColumn } from 'src/app/shared/models/grid-column.model';
import { GridState } from 'src/app/shared/models/grid-state.model';
import { OrganizationUser } from 'src/app/shared/models/organization-user/organization-user.model';

export interface OrganizationUserState extends EntityState<OrganizationUser> {
  total: number;
  isLoadingUsersQuery: boolean;
  gridState: GridState;
  gridColumns: GridColumn[];
}
