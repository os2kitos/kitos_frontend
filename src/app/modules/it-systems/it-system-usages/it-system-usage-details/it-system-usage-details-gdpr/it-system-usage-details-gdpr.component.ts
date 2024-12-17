import { Component, EventEmitter, Output } from '@angular/core';
import { AbstractControl } from '@angular/forms';
import { Store } from '@ngrx/store';
import { filter } from 'rxjs';
import { BaseComponent } from 'src/app/shared/base/base.component';
import { combineOR } from 'src/app/shared/helpers/observable-helpers';
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
}
