import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import { GDPR_REPORT_FILE_PREEFIX } from 'src/app/shared/constants/constants';
import * as GdprFields from 'src/app/shared/constants/gdpr-overview-grid-column-constants';
import { UIModuleConfigKey } from 'src/app/shared/enums/ui-module-config-key';
import { mapDateToString } from 'src/app/shared/helpers/date.helpers';
import { GridColumn } from 'src/app/shared/models/grid-column.model';
import { hostedAtOptions } from 'src/app/shared/models/it-system-usage/gdpr/hosted-at.model';
import { riskAssessmentResultOptions } from 'src/app/shared/models/it-system-usage/gdpr/risk-assessment-result';
import { yesNoDontKnowOptions } from 'src/app/shared/models/yes-no-dont-know.model';
import { GridUIConfigService } from 'src/app/shared/services/ui-config-services/grid-ui-config.service';
import { GdprReportActions } from 'src/app/store/it-system-usage/gdpr-report/actions';
import { selectGdprReports } from 'src/app/store/it-system-usage/gdpr-report/selectors';

@Component({
  selector: 'app-gdpr-overview',
  templateUrl: './gdpr-overview.component.html',
  styleUrl: './gdpr-overview.component.scss',
})
export class GdprOverviewComponent {
  private readonly gridColumns: GridColumn[] = [
    {
      field: GdprFields.SYSTEM_UUID,
      title: $localize`System UUID`,
      hidden: false,
    },
    {
      field: GdprFields.SYSTEM_NAME,
      title: $localize`Navn`,
      hidden: false,
    },
    {
      field: GdprFields.NO_DATA,
      title: $localize`Ingen personoplysninger`,
      hidden: false,
      style: 'boolean',
      noFilter: true,
    },
    {
      field: GdprFields.PERSONAL_DATA,
      title: $localize`Almindelige personoplysninger`,
      hidden: false,
      style: 'boolean',
      noFilter: true,
    },
    {
      field: GdprFields.PERSONAL_DATA_CPR,
      title: $localize`CPR-nr`,
      hidden: false,
      style: 'boolean',
      noFilter: true,
    },
    {
      field: GdprFields.PERSONAL_DATA_SOCIAL_PROBLEMS,
      title: $localize`Væsentlige sociale problemer`,
      hidden: false,
      style: 'boolean',
      noFilter: true,
    },
    {
      field: GdprFields.PERSONAL_DATA_SOCIAL_OTHER_PRIVATE_MATTERS,
      title: $localize`Andre rent private forhold`,
      hidden: false,
      style: 'boolean',
      noFilter: true,
    },
    {
      field: GdprFields.SENSITIVE_DATA,
      title: $localize`Følsomme personoplysninger`,
      hidden: false,
      style: 'boolean',
      noFilter: true,
    },
    {
      field: GdprFields.LEGAL_DATA,
      title: $localize`Straffesager og lovovertrædelser`,
      hidden: false,
      style: 'boolean',
      noFilter: true,
    },
    {
      field: GdprFields.SENSITIVE_DATA_TYPES,
      title: $localize`Valgte følsomme personoplysninger`,
      hidden: false,
    },
    {
      field: GdprFields.BUSINESS_CRITICAL_NAME,
      title: $localize`Forretningskritisk IT-System`,
      hidden: false,
      extraData: yesNoDontKnowOptions,
      extraFilter: 'enum',
    },
    {
      field: GdprFields.DATA_PROCESSING_AGREEMENT_CONCLUDED,
      title: $localize`Databehandleraftale`,
      hidden: false,
      style: 'boolean',
      noFilter: true,
    },
    {
      field: GdprFields.LINK_TO_DIRECTORY,
      title: $localize`Link til fortegnelse`,
      hidden: false,
      style: 'boolean',
      noFilter: true,
    },
    {
      field: GdprFields.RISK_ASSESSMENT_NAME,
      title: $localize`Foretaget risikovurdering`,
      hidden: false,
      extraData: yesNoDontKnowOptions,
      extraFilter: 'enum',
    },
    {
      field: GdprFields.RISK_ASSESSMENT_DATE,
      title: $localize`Dato for seneste risikovurdering`,
      hidden: false,
      style: 'date',
      width: 350,
    },
    {
      field: GdprFields.PLANNED_RISK_ASSESSMENT_DATE,
      title: $localize`Dato for planlagt risikovurdering`,
      hidden: false,
      style: 'date',
      width: 350,
    },
    {
      field: GdprFields.PRE_RISK_ASSESSMENT_NAME,
      title: $localize`Hvad viste seneste risikovurdering`,
      hidden: false,
      extraFilter: 'enum',
      extraData: riskAssessmentResultOptions,
    },
    {
      field: GdprFields.RISK_ASSESMENT_NOTES,
      title: $localize`Bemærkninger til risikovurdering`,
      hidden: false,
    },
    {
      field: GdprFields.DPIA_NAME,
      title: $localize`Gennemført DPIA / Konsekvensanalyse`,
      hidden: false,
      extraData: yesNoDontKnowOptions,
      extraFilter: 'enum',
    },
    {
      field: GdprFields.DPIA_DATE,
      title: $localize`Dato for seneste DPIA / Konsekvensanalyse`,
      hidden: false,
      style: 'date',
      width: 350,
    },
    {
      field: GdprFields.HOSTED_AT_NAME,
      title: $localize`IT-Systemet driftes`,
      hidden: false,
      extraData: hostedAtOptions,
      extraFilter: 'enum',
    },
    {
      field: GdprFields.TECHNICAL_SUPERVISION_DOCUMENTATION_NAME,
      title: $localize`Dokumentation til teknisk foranstaltning`,
      hidden: false,
      style: 'title-link',
      idField: GdprFields.TECHNICAL_SUPERVISION_DOCUMENTATION,
    },
    {
      field: GdprFields.USER_SUPERVISION,
      title: $localize`Brugerkontrol`,
      hidden: false,
      extraData: yesNoDontKnowOptions,
      extraFilter: 'enum',
    },
    {
      field: GdprFields.USER_SUPERVISION_DOCUMENTATION_NAME,
      title: $localize`Dokumentation til brugerkontrol`,
      hidden: false,
      style: 'title-link',
      idField: GdprFields.USER_SUPERVISION_DOCUMENTATION,
    },
    {
      field: GdprFields.NEXT_DATA_RETENTION_EVALUATION_DATE,
      title: $localize`Dato for næste gang data må slettes`,
      hidden: false,
      style: 'date',
    },
    {
      field: GdprFields.COUNTRIES_SUBJECT_TO_DATA_TRANSFER,
      title: $localize`Lande som data overføres til`,
      hidden: false,
    },
  ];

  public readonly filteredGridColumns$ = of(this.gridColumns).pipe(
    this.uiConfigService.filterGridColumnsByUIConfig(UIModuleConfigKey.Gdpr)
  );

  public readonly gdprReports$ = this.store.select(selectGdprReports);

  constructor(private store: Store, private uiConfigService: GridUIConfigService) {
    this.store.dispatch(GdprReportActions.getGDPRReports());
  }

  public getExportName(): string {
    const currentDate = new Date();
    const formattedDate = mapDateToString(currentDate);
    return `${GDPR_REPORT_FILE_PREEFIX}-${formattedDate}`;
  }
}
