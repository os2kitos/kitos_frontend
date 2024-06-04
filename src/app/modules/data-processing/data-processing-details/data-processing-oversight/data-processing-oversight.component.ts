import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Store } from '@ngrx/store';
import { BehaviorSubject, map } from 'rxjs';
import { APIDataProcessingRegistrationOversightWriteRequestDTO, APIUpdateDataProcessingRegistrationRequestDTO } from 'src/app/api/v2';
import { BaseComponent } from 'src/app/shared/base/base.component';
import { ValidatedValueChange } from 'src/app/shared/models/validated-value-change.model';
import { YesNoEnum, yesNoOptions } from 'src/app/shared/models/yes-no.model';
import { filterNullish } from 'src/app/shared/pipes/filter-nullish';
import { matchNonEmptyArray } from 'src/app/shared/pipes/match-non-empty-array';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { DataProcessingActions } from 'src/app/store/data-processing/actions';
import { selectDataProcessingHasModifyPermissions, selectDataProcessingOversightOptions } from 'src/app/store/data-processing/selectors';

@Component({
  selector: 'app-data-processing-oversight',
  templateUrl: './data-processing-oversight.component.html',
  styleUrl: './data-processing-oversight.component.scss'
})
export class DataProcessingOversightComponent extends BaseComponent {

  public readonly oversightOptions$ = this.store
    .select(selectDataProcessingOversightOptions)
    .pipe(filterNullish());

  public readonly anyOversightOptions$ = this.oversightOptions$.pipe(matchNonEmptyArray());
  public readonly hasModifyPermission$ = this.store.select(selectDataProcessingHasModifyPermissions);
  public readonly yesNoOptions = yesNoOptions.map((option) => ({ id: option.value, label: option.name }));

  public readonly hasOversightsValue$ = new BehaviorSubject<YesNoEnum | undefined>(undefined);
  public readonly isHasOversightsTrue$ = this.hasOversightsValue$.pipe(map((value) => value === 'Yes'));

  public readonly dataProcessingOversightForm = new FormGroup(
    {
      options: new FormControl({ value: '', disabled: false }),
      remarks: new FormControl({ value: '', disabled: false }),
      interval: new FormControl({ value: '', disabled: false }),
      intervalRemarks: new FormControl({ value: '', disabled: false }),
    },
    { updateOn: 'blur' }
  );

  public readonly oversightsFormGroup = new FormGroup(
    {
      completedAt: new FormControl({ value: '', disabled: false }),
      oversightDates: new FormControl({ value: '', disabled: false }),
    }
  );

  constructor(private store: Store, private notificationService: NotificationService) {
    super();
  }

  public patch(request: APIUpdateDataProcessingRegistrationRequestDTO, valueChange?: ValidatedValueChange<unknown>) {
    if (valueChange && !valueChange.valid) {
      this.notificationService.showError($localize`"${valueChange.text}" er ugyldig`);
    } else {
      this.store.dispatch(DataProcessingActions.patchDataProcessing(request));
    }
  }

  public patchDeadlines(
    value: APIDataProcessingRegistrationOversightWriteRequestDTO,
    valueChange?: ValidatedValueChange<unknown>
  ): void {
    this.patch({ oversight: value }, valueChange);
  }
}
