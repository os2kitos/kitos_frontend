import { AsyncPipe } from '@angular/common';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { map } from 'rxjs';
import { APIGDPRRegistrationsResponseDTO, APIGDPRWriteRequestDTO } from 'src/app/api/v2';
import { BaseAccordionComponent } from 'src/app/shared/base/base-accordion.component';
import { ValidatedValueChange } from 'src/app/shared/models/validated-value-change.model';
import {
  YesNoDontKnowOption,
  mapToYesNoDontKnowEnum,
  yesNoDontKnowOptions,
} from 'src/app/shared/models/yes-no-dont-know.model';
import { filterNullish } from 'src/app/shared/pipes/filter-nullish';
import { ITSystemUsageActions } from 'src/app/store/it-system-usage/actions';
import { selectItSystemUsageGdpr } from 'src/app/store/it-system-usage/selectors';
import { AccordionComponent } from '../../../../../../shared/components/accordion/accordion.component';
import { DatePickerComponent } from '../../../../../../shared/components/datepicker/datepicker.component';
import { DropdownComponent } from '../../../../../../shared/components/dropdowns/dropdown/dropdown.component';
import { NumericInputComponent } from '../../../../../../shared/components/numeric-input/numeric-input.component';
import { StandardVerticalContentGridComponent } from '../../../../../../shared/components/standard-vertical-content-grid/standard-vertical-content-grid.component';

@Component({
  selector: 'app-gdpr-retention-period-section',
  templateUrl: './gdpr-retention-period-section.component.html',
  styleUrls: ['./gdpr-retention-period-section.component.scss'],
  imports: [
    AccordionComponent,
    FormsModule,
    ReactiveFormsModule,
    StandardVerticalContentGridComponent,
    DropdownComponent,
    DatePickerComponent,
    NumericInputComponent,
    AsyncPipe,
  ],
})
export class GdprRetentionPeriodSectionComponent extends BaseAccordionComponent implements OnInit {
  @Output() public noPermissions = new EventEmitter<AbstractControl[]>();

  private readonly currentGdpr$ = this.store.select(selectItSystemUsageGdpr).pipe(filterNullish());
  public readonly isRetentionPeriodFalse$ = this.currentGdpr$.pipe(
    map((gdpr) => gdpr.retentionPeriodDefined !== APIGDPRRegistrationsResponseDTO.RetentionPeriodDefinedEnum.Yes)
  );

  public readonly yesNoDontKnowOptions = yesNoDontKnowOptions;

  public readonly formGroup = new FormGroup(
    {
      yesNoDontKnowControl: new FormControl<YesNoDontKnowOption | undefined>(undefined),
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

    this.noPermissions.emit([this.formGroup]);
  }

  public patchGdpr(gdpr: APIGDPRWriteRequestDTO, valueChange?: ValidatedValueChange<unknown>) {
    if (!this.formGroup.valid) return;
    if (valueChange && !valueChange.valid) return;

    this.store.dispatch(ITSystemUsageActions.patchITSystemUsage({ gdpr }));
  }
}
