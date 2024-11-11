import { EntityState } from '@ngrx/entity';
import { APIKLEDetailsDTO, APIKLEStatusResponseDTO } from 'src/app/api/v2';

export interface KLEState extends EntityState<APIKLEDetailsDTO> {
  cacheTime: number | undefined;
  adminKleStatus: APIKLEStatusResponseDTO | undefined;
  adminKleIsLoading: boolean;
  adminKleChangesDownloaded: boolean;
}
