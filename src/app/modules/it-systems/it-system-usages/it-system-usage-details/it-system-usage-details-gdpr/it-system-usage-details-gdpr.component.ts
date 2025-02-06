import { Component, EventEmitter, Output } from '@angular/core';
import { AbstractControl } from '@angular/forms';
import { Store } from '@ngrx/store';
import { BehaviorSubject, filter, first, map } from 'rxjs';
import { BaseComponent } from 'src/app/shared/base/base.component';
import { combineAND, combineOR } from 'src/app/shared/helpers/observable-helpers';
import { selectITSystemUsageHasModifyPermission } from 'src/app/store/it-system-usage/selectors';
import {
  selectITSystemUsageEnabledRegisteredCategories,
  selectITSystemUsageEnableGdprBusinessCritical,
  selectITSystemUsageEnableGdprConductedRiskAssessment,
  selectITSystemUsageEnableGdprDataTypes,
  selectITSystemUsageEnableGdprDocumentation,
  selectITSystemUsageEnableGdprDpiaConducted,
  selectITSystemUsageEnableGdprHostedAt,
  selectITSystemUsageEnableGdprPlannedRiskAssessmentDate,
  selectITSystemUsageEnableGdprPurpose,
  selectITSystemUsageEnableGdprRetentionPeriod,
  selectITSystemUsageEnableGdprTechnicalPrecautions,
  selectITSystemUsageEnableGdprUserSupervision,
} from 'src/app/store/organization/ui-module-customization/selectors';

type UsageGDPRSection =
  | 'data-sensitivity'
  | 'registered-categories'
  | 'technical-precautions'
  | 'user-supervision'
  | 'risk-assessment'
  | 'dpia-conducted'
  | 'retention-period';

@Component({
  selector: 'app-it-system-usage-details-gdpr',
  templateUrl: './it-system-usage-details-gdpr.component.html',
  styleUrls: ['./it-system-usage-details-gdpr.component.scss'],
})
export class ItSystemUsageDetailsGdprComponent extends BaseComponent {
  @Output() disableLinkControls = new EventEmitter<void>();

  public constructor(private readonly store: Store) {
    super();
  }

  public readonly showGeneralInfo$ = combineOR([
    this.store.select(selectITSystemUsageEnableGdprPurpose),
    this.store.select(selectITSystemUsageEnableGdprBusinessCritical),
    this.store.select(selectITSystemUsageEnableGdprHostedAt),
    this.store.select(selectITSystemUsageEnableGdprDocumentation),
  ]);

  public readonly showDataTypes$ = this.store.select(selectITSystemUsageEnableGdprDataTypes);

  public readonly registeredCategoriesEnabled$ = this.store.select(selectITSystemUsageEnabledRegisteredCategories);
  public readonly technicalPrecautionsEnabled$ = this.store.select(selectITSystemUsageEnableGdprTechnicalPrecautions);
  public readonly userSupervisionEnabled$ = this.store.select(selectITSystemUsageEnableGdprUserSupervision);

  public readonly showRiskAssessment$ = combineOR([
    this.store.select(selectITSystemUsageEnableGdprPlannedRiskAssessmentDate),
    this.store.select(selectITSystemUsageEnableGdprConductedRiskAssessment),
  ]);

  public readonly showDpiaConducted$ = this.store.select(selectITSystemUsageEnableGdprDpiaConducted);
  public readonly showRetentionPeriod$ = this.store.select(selectITSystemUsageEnableGdprRetentionPeriod);

  public readonly showMoreInformation$ = combineOR([
    this.showDataTypes$,
    this.registeredCategoriesEnabled$,
    this.technicalPrecautionsEnabled$,
    this.userSupervisionEnabled$,
    this.showRiskAssessment$,
    this.showDpiaConducted$,
    this.showRetentionPeriod$,
  ]);

  public readonly dataSensitivityExpanded$ = new BehaviorSubject<boolean>(false);
  public readonly registeredCategoriesExpanded$ = new BehaviorSubject<boolean>(false);
  public readonly technicalPrecautionsExpanded$ = new BehaviorSubject<boolean>(false);
  public readonly userSupervisionExpanded$ = new BehaviorSubject<boolean>(false);
  public readonly riskAssessmentExpanded$ = new BehaviorSubject<boolean>(false);
  public readonly dpiaConductedExpanded$ = new BehaviorSubject<boolean>(false);
  public readonly retentionPeriodExpanded$ = new BehaviorSubject<boolean>(false);

  public readonly allExpanded$ = combineAND([
    this.dataSensitivityExpanded$,
    this.registeredCategoriesExpanded$,
    this.technicalPrecautionsExpanded$,
    this.userSupervisionExpanded$,
    this.riskAssessmentExpanded$,
    this.dpiaConductedExpanded$,
    this.retentionPeriodExpanded$,
  ]);

  public readonly expandAllButtonText$ = this.allExpanded$.pipe(
    map((allExpanded) => (allExpanded ? $localize`Luk alle` : $localize`Åben alle`))
  );

  public disableFormsIfNoPermissions(controls: AbstractControl[]) {
    this.subscriptions.add(
      this.store
        .select(selectITSystemUsageHasModifyPermission)
        .pipe(filter((hasModifyPermission) => hasModifyPermission === false))
        .subscribe(() => {
          controls.forEach((control: AbstractControl) => control.disable());
          this.disableLinkControls.emit();
        })
    );
  }

  public expandedSectionChanged(expanded: boolean, section: UsageGDPRSection) {
    switch (section) {
      case 'data-sensitivity':
        this.dataSensitivityExpanded$.next(expanded);
        break;
      case 'registered-categories':
        this.registeredCategoriesExpanded$.next(expanded);
        break;
      case 'technical-precautions':
        this.technicalPrecautionsExpanded$.next(expanded);
        break;
      case 'user-supervision':
        this.userSupervisionExpanded$.next(expanded);
        break;
      case 'risk-assessment':
        this.riskAssessmentExpanded$.next(expanded);
        break;
      case 'dpia-conducted':
        this.dpiaConductedExpanded$.next(expanded);
        break;
      case 'retention-period':
        this.retentionPeriodExpanded$.next(expanded);
        break;
    }
  }

  public changeAllClick() {
    this.subscriptions.add(
      this.allExpanded$.pipe(first()).subscribe((allExpanded) => {
        const targetValue = !allExpanded;
        this.dataSensitivityExpanded$.next(targetValue);
        this.registeredCategoriesExpanded$.next(targetValue);
        this.technicalPrecautionsExpanded$.next(targetValue);
        this.userSupervisionExpanded$.next(targetValue);
        this.riskAssessmentExpanded$.next(targetValue);
        this.dpiaConductedExpanded$.next(targetValue);
        this.retentionPeriodExpanded$.next(targetValue);
      })
    );
  }
}
