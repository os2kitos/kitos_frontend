import { EntityState } from '@ngrx/entity';
import { LocalAdminUser } from 'src/app/shared/models/local-admin/local-admin-user.model';

export interface LocalAdminUsersState extends EntityState<LocalAdminUser> {
  loading: boolean;
}
