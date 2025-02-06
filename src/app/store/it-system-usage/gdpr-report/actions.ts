import { createActionGroup, emptyProps } from '@ngrx/store';
import { GdprReport } from 'src/app/shared/models/it-system-usage/gdpr/gdpr-report.model';

export const GdprReportActions = createActionGroup({
  source: 'GdprReport',
  events: {
    'Get GDPR reports': emptyProps(),
    'Get GDPR reports Success': (report: GdprReport[]) => ({ report }),
    'Get GDPR reports Error': emptyProps(),
  },
});
