import { EntityState } from '@ngrx/entity';
import { GdprReport } from 'src/app/shared/models/it-system-usage/gdpr/gdpr-report.model';

export interface GdprReportState extends EntityState<GdprReport> {
  cacheTime: number | undefined;
}
