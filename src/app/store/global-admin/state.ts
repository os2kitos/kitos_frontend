import { EntityState } from '@ngrx/entity';
import { GlobalAdminUser } from 'src/app/shared/models/global-admin/global-admin-user.model';

export interface GlobalAdminState extends EntityState<GlobalAdminUser> {
  loading: boolean;
}
