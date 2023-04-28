import { createSelector } from '@ngrx/store';
import { APIKLEDetailsDTO } from 'src/app/api/v2';
import { convertKleNumberToNumeric } from 'src/app/shared/helpers/kle.helpers';
import { selectKLEEntities } from '../kle/selectors';
import { itSystemAdapter, itSystemFeature } from './reducer';

const { selectITSystemState } = itSystemFeature;

export const selectAll = createSelector(selectITSystemState, itSystemAdapter.getSelectors().selectAll);

export const selectItSystemLoading = createSelector(selectITSystemState, (state) => state.loading);
export const selectItSystem = createSelector(selectITSystemState, (state) => state.itSystem);

export const selectItSystemIsActive = createSelector(selectItSystem, (state) =>
  state?.deactivated !== undefined ? !state.deactivated : undefined
);

export const selectItSystemParentSystem = createSelector(selectItSystem, (state) => state?.parentSystem);

export const selectItSystemKle = createSelector(selectItSystem, (state) => state?.kle);

export const selectItSystemKleWithDetails = createSelector(selectItSystemKle, selectKLEEntities, (kle, kles) => {
  return kle
    ?.map(
      (kle) =>
        kles[kle.uuid] ??
        <APIKLEDetailsDTO>{
          ...kle,
          kleNumber: kle.name,
          description: $localize`ukendt - genindlæs KITOS for at få vist beskrivelsen`,
        }
    )
    ?.sort((a, b) => convertKleNumberToNumeric(a) - convertKleNumberToNumeric(b));
});
