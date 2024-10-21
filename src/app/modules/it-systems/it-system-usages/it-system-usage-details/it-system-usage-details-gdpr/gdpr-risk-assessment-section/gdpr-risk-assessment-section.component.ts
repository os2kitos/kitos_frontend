import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AbstractControl, FormControl, FormGroup } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Observable, map } from 'rxjs';
import { APIGDPRRegistrationsResponseDTO, APIGDPRWriteRequestDTO } from 'src/app/api/v2';
import { BaseComponent } from 'src/app/shared/base/base.component';
import { fieldOrGroupIsEnabled } from 'src/app/shared/models/helpers/ui-config-helpers';
import {
  RiskAssessmentResultOptions,
  mapRiskAssessmentEnum,
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
import { selectITSystemUsageUIModuleConfig } from 'src/app/store/organization/ui-module-customization/selectors';

@Component({
  selector: 'app-gdpr-risk-assessment-section',
  templateUrl: './gdpr-risk-assessment-section.component.html',
  styleUrls: ['./gdpr-risk-assessment-section.component.scss'],
})
export class GdprRiskAssessmentSectionComponent extends BaseComponent implements OnInit {
  @Output() public noPermissions = new EventEmitter<AbstractControl[]>();
  @Input() disableLinkControl!: Observable<void>;

  private readonly currentGdpr$ = this.store.select(selectItSystemUsageGdpr).pipe(filterNullish());
  public readonly isRiskAssessmentFalse$ = this.currentGdpr$.pipe(
    map((gdpr) => gdpr.riskAssessmentConducted !== APIGDPRRegistrationsResponseDTO.RiskAssessmentConductedEnum.Yes)
  );
  public readonly selectRiskDocumentation$ = this.currentGdpr$.pipe(map((gdpr) => gdpr.riskAssessmentDocumentation));
  public disableDirectoryDocumentationControl = false;
  public readonly itSystemUsagesUIModuleConfig$ = this.store.select(selectITSystemUsageUIModuleConfig);


  public readonly yesNoDontKnowOptions = yesNoDontKnowOptions;
  public readonly riskAssessmentResultOptions = riskAssessmentResultOptions;

  public readonly riskAssessmentFormGroup = new FormGroup(
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
        this.riskAssessmentFormGroup.controls.conductedDateControl.disable();
        this.riskAssessmentFormGroup.controls.assessmentResultControl.disable();
        this.riskAssessmentFormGroup.controls.notesControl.disable();
        this.disableDirectoryDocumentationControl = true;
      } else {
        this.riskAssessmentFormGroup.controls.conductedDateControl.enable();
        this.riskAssessmentFormGroup.controls.assessmentResultControl.enable();
        this.riskAssessmentFormGroup.controls.notesControl.enable();
        this.disableDirectoryDocumentationControl = false;
      }
    });

    this.currentGdpr$.subscribe((gdpr) => {
      this.riskAssessmentFormGroup.patchValue({
        plannedDateControl: gdpr.plannedRiskAssessmentDate ? new Date(gdpr.plannedRiskAssessmentDate) : undefined,
        yesNoDontKnowControl: mapToYesNoDontKnowEnum(gdpr.riskAssessmentConducted),
        conductedDateControl: gdpr.riskAssessmentConductedDate ? new Date(gdpr.riskAssessmentConductedDate) : undefined,
        assessmentResultControl: mapRiskAssessmentEnum(gdpr.riskAssessmentResult),
        notesControl: gdpr.riskAssessmentNotes,
      });
    });

    this.noPermissions.emit([this.riskAssessmentFormGroup]);
    this.disableLinkControl.subscribe(() => {
      this.disableDirectoryDocumentationControl = true;
    });
  }

  public patchGdpr(gdpr: APIGDPRWriteRequestDTO, valueChange?: ValidatedValueChange<unknown>) {
    if (!this.riskAssessmentFormGroup.valid) return;
    if (valueChange && !valueChange.valid) return;

    this.store.dispatch(ITSystemUsageActions.patchITSystemUsage({ gdpr }));
  }

  public enableGdprPlannedRiskAssessmentDate(){
    return this.itSystemUsagesUIModuleConfig$.pipe(filterNullish()).subscribe((config) => {
      return config?.configViewModels ? fieldOrGroupIsEnabled(config?.configViewModels, 'ItSystemUsages.gdpr', 'plannedRiskAssessmentDate') : true;
    });
  }
}
