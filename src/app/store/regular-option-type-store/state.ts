import { EntityState } from '@ngrx/entity';
import { APIRegularOptionResponseDTO } from 'src/app/api/v2';
import { RegularOptionType } from 'src/app/shared/models/options/regular-option-types.model';

export interface RegularOptionTypeStateItem extends EntityState<APIRegularOptionResponseDTO> {
  cacheTime: number | undefined;
}

export type RegularOptionTypeState = Record<RegularOptionType, RegularOptionTypeStateItem | null>;
