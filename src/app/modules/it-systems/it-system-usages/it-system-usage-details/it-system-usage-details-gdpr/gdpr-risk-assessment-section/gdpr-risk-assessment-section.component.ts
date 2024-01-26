import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Store } from '@ngrx/store';
import { map } from 'rxjs';
import { APIGDPRRegistrationsResponseDTO, APIGDPRWriteRequestDTO } from 'src/app/api/v2';
import { BaseComponent } from 'src/app/shared/base/base.component';
import {
  RiskAssessmentResultOptions,
  riskAssessmentResultOptions,
} from 'src/app/shared/models/it-system-usage/gdpr/risk-assessment-result';
import { ValidatedValueChange } from 'src/app/shared/models/validated-value-change.model';
import {
  YesNoDontKnowOptions,
  mapToYesNoDontKnowEnum,
  yesNoDontKnowOptions,
} from 'src/app/shared/models/yes-no-dont-know.model';
import { filterNullish } from 'src/app/shared/pipes/filter-nullish';
import { ITSystemUsageActions } from 'src/app/store/it-system-usage/actions';
import { selectItSystemUsageGdpr } from 'src/app/store/it-system-usage/selectors';

@Component({
  selector: 'app-gdpr-risk-assessment-section',
  templateUrl: './gdpr-risk-assessment-section.component.html',
  styleUrls: ['./gdpr-risk-assessment-section.component.scss'],
})
export class GdprRiskAssessmentSectionComponent extends BaseComponent implements OnInit {
  private readonly currentGdpr$ = this.store.select(selectItSystemUsageGdpr).pipe(filterNullish());
  public readonly isRiskAssessmentFalse$ = this.currentGdpr$.pipe(
    map((gdpr) => gdpr.riskAssessmentConducted !== APIGDPRRegistrationsResponseDTO.RiskAssessmentConductedEnum.Yes)
  );
  public readonly selectRiskDocumentation$ = this.currentGdpr$.pipe(map((gdpr) => gdpr.riskAssessmentDocumentation));

  public readonly yesNoDontKnowOptions = yesNoDontKnowOptions;
  public readonly riskAssessmentResultOptions = riskAssessmentResultOptions;

  public readonly riskAssessmnetFormGroup = new FormGroup(
    {
      plannedDateControl: new FormControl<Date | undefined>(undefined),
      yesNoDontKnowControl: new FormControl<YesNoDontKnowOptions | undefined>(undefined),
      conductedDateControl: new FormControl<Date | undefined>(undefined),
      assessmentResultControl: new FormControl<RiskAssessmentResultOptions | undefined>(undefined),
      notesControl: new FormControl<string | undefined>(undefined),
    },
    { updateOn: 'blur' }
  );

  constructor(private readonly store: Store) {
    super();
  }
  ngOnInit(): void {
    this.isRiskAssessmentFalse$.subscribe((isYesNoDontKnowFalse) => {
      if (isYesNoDontKnowFalse) {
        this.riskAssessmnetFormGroup.controls.conductedDateControl.disable();
        this.riskAssessmnetFormGroup.controls.assessmentResultControl.disable();
        this.riskAssessmnetFormGroup.controls.notesControl.disable();
      } else {
        this.riskAssessmnetFormGroup.controls.conductedDateControl.enable();
        this.riskAssessmnetFormGroup.controls.assessmentResultControl.enable();
        this.riskAssessmnetFormGroup.controls.notesControl.enable();
      }
    });

    this.currentGdpr$.subscribe((gdpr) => {
      this.riskAssessmnetFormGroup.patchValue({
        plannedDateControl: gdpr.plannedRiskAssessmentDate ? new Date(gdpr.plannedRiskAssessmentDate) : undefined,
        yesNoDontKnowControl: mapToYesNoDontKnowEnum(gdpr.riskAssessmentConducted),
        conductedDateControl: gdpr.riskAssessmentConductedDate ? new Date(gdpr.riskAssessmentConductedDate) : undefined,
        notesControl: gdpr.riskAssessmentNotes,
      });
    });
  }

  public patchGdpr(gdpr: APIGDPRWriteRequestDTO, valueChange?: ValidatedValueChange<unknown>) {
    if (!this.riskAssessmnetFormGroup.valid) return;
    if (valueChange && !valueChange.valid) return;

    this.store.dispatch(ITSystemUsageActions.patchItSystemUsage({ gdpr }));
  }
}
