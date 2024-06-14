import { Component, Input, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup } from '@angular/forms';
import { Store } from '@ngrx/store';
import { filter, map } from 'rxjs';
import { APIGDPRRegistrationsResponseDTO, APIGDPRWriteRequestDTO } from 'src/app/api/v2';
import { BaseComponent } from 'src/app/shared/base/base.component';
import { ValidatedValueChange } from 'src/app/shared/models/validated-value-change.model';
import {
  YesNoDontKnowOptions,
  mapToYesNoDontKnowEnum,
  yesNoDontKnowOptions,
} from 'src/app/shared/models/yes-no-dont-know.model';
import { filterNullish } from 'src/app/shared/pipes/filter-nullish';
import { ITSystemUsageActions } from 'src/app/store/it-system-usage/actions';
import { selectITSystemUsageHasModifyPermission, selectItSystemUsageGdpr } from 'src/app/store/it-system-usage/selectors';

@Component({
  selector: 'app-gdpr-retention-period-section',
  templateUrl: './gdpr-retention-period-section.component.html',
  styleUrls: ['./gdpr-retention-period-section.component.scss'],
})
export class GdprRetentionPeriodSectionComponent extends BaseComponent implements OnInit {
  @Input() onNoPermissions: (forms: AbstractControl[]) => void = (forms: AbstractControl[]) => {};

  private readonly currentGdpr$ = this.store.select(selectItSystemUsageGdpr).pipe(filterNullish());
  public readonly isRetentionPeriodFalse$ = this.currentGdpr$.pipe(
    map((gdpr) => gdpr.retentionPeriodDefined !== APIGDPRRegistrationsResponseDTO.RetentionPeriodDefinedEnum.Yes)
  );

  public readonly yesNoDontKnowOptions = yesNoDontKnowOptions;

  public readonly formGroup = new FormGroup(
    {
      yesNoDontKnowControl: new FormControl<YesNoDontKnowOptions | undefined>(undefined),
      dateControl: new FormControl<Date | undefined>(undefined),
      frequencyControl: new FormControl<number | undefined>(undefined),
    },
    { updateOn: 'blur' }
  );

  constructor(private readonly store: Store) {
    super();
  }
  ngOnInit(): void {
    this.isRetentionPeriodFalse$.subscribe((isYesNoDontKnowFalse) => {
      if (isYesNoDontKnowFalse) {
        this.formGroup.controls.dateControl.disable();
        this.formGroup.controls.frequencyControl.disable();
      } else {
        this.formGroup.controls.dateControl.enable();
        this.formGroup.controls.frequencyControl.enable();
      }
    });

    this.currentGdpr$.subscribe((gdpr) => {
      this.formGroup.patchValue({
        yesNoDontKnowControl: mapToYesNoDontKnowEnum(gdpr.retentionPeriodDefined),
        dateControl: gdpr.nextDataRetentionEvaluationDate ? new Date(gdpr.nextDataRetentionEvaluationDate) : undefined,
        frequencyControl: gdpr.dataRetentionEvaluationFrequencyInMonths,
      });
    });

    this.onNoPermissions([this.formGroup]);
  }

  public patchGdpr(gdpr: APIGDPRWriteRequestDTO, valueChange?: ValidatedValueChange<unknown>) {
    if (!this.formGroup.valid) return;
    if (valueChange && !valueChange.valid) return;

    this.store.dispatch(ITSystemUsageActions.patchITSystemUsage({ gdpr }));
  }
}
