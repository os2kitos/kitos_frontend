import { createEntityAdapter } from '@ngrx/entity';
import { createFeature, createReducer, on } from '@ngrx/store';
import { APIKLEDetailsDTO } from 'src/app/api/v2';
import { KLEActions } from './actions';
import { KLEState } from './state';

export const kleAdapter = createEntityAdapter<APIKLEDetailsDTO>({
  selectId: (kle) => kle.uuid,
});

export const kleInitialState: KLEState = kleAdapter.getInitialState({
  cacheTime: undefined,

  adminKleStatus: undefined,
  adminKleIsLoading: false,
  adminKleChangesDownloaded: false,
});

export const kleFeature = createFeature({
  name: 'KLE',
  reducer: createReducer(
    kleInitialState,
    on(
      KLEActions.getKLEsSuccess,
      (state, { kles }): KLEState => ({
        ...kleAdapter.setAll(kles, state),
        cacheTime: new Date().getTime(),
      })
    ),

    on(KLEActions.getAdminKLEStatus, (state): KLEState => ({ ...state, adminKleIsLoading: true })),
    on(
      KLEActions.getAdminKLEStatusSuccess,
      (state, { status }): KLEState => ({ ...state, adminKleIsLoading: false, adminKleStatus: status })
    ),
    on(KLEActions.getAdminKLEStatusError, (state): KLEState => ({ ...state, adminKleIsLoading: false })),

    on(KLEActions.getAdminKLEFile, (state): KLEState => ({ ...state, adminKleIsLoading: true })),
    on(KLEActions.getAdminKLEFileSuccess, (state): KLEState => {
      return { ...state, adminKleIsLoading: false, adminKleChangesDownloaded: true };
    }),
    on(KLEActions.getAdminKLEFileError, (state): KLEState => {
      return { ...state, adminKleIsLoading: false };
    }),

    on(KLEActions.updateAdminKLE, (state): KLEState => ({ ...state, adminKleIsLoading: true })),
    on(KLEActions.updateAdminKLESuccess, (state): KLEState => ({ ...state, adminKleIsLoading: false })),
    on(KLEActions.updateAdminKLEError, (state): KLEState => ({ ...state, adminKleIsLoading: false }))
  ),
});
