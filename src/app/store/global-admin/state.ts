import { EntityState } from '@ngrx/entity';
import { ShallowUser } from 'src/app/shared/models/userV2.model';

export interface GlobalAdminState extends EntityState<ShallowUser> {
  loading: boolean;
}
