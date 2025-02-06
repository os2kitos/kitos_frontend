import { createEntityAdapter } from '@ngrx/entity';
import { createFeature, createReducer, on } from '@ngrx/store';
import { GdprReport } from 'src/app/shared/models/it-system-usage/gdpr/gdpr-report.model';
import { GdprReportActions } from './actions';
import { GdprReportState } from './state';
import { ITSystemUsageActions } from '../actions';
import { DataProcessingActions } from '../../data-processing/actions';

export const gdprReportsAdapter = createEntityAdapter<GdprReport>({
  selectId: (report: GdprReport) => report.systemUuid,
});

export const initialGdprReportState: GdprReportState = gdprReportsAdapter.getInitialState({
  cacheTime: undefined,
});

export const gdprReportFeature = createFeature({
  name: 'GdprReport',
  reducer: createReducer(
    initialGdprReportState,
    on(GdprReportActions.getGDPRReportsSuccess, (state, { report }): GdprReportState => {
      return {
        ...gdprReportsAdapter.setAll(report, state),
        cacheTime: new Date().getTime(),
      };
    }),

    on(
      ITSystemUsageActions.removeITSystemUsageSuccess,
      ITSystemUsageActions.createItSystemUsageSuccess,
      ITSystemUsageActions.patchITSystemUsageSuccess,
      DataProcessingActions.patchDataProcessingSuccess,
      (state): GdprReportState => {
        return {
          ...state,
          cacheTime: undefined,
        };
      }
    )
  ),
});
