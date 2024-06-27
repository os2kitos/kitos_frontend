import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { AbstractControl, FormControl, FormGroup } from '@angular/forms';
import { Store } from '@ngrx/store';
import { combineLatest, filter, pipe, tap } from 'rxjs';
import { APIGDPRWriteRequestDTO } from 'src/app/api/v2';
import { BaseComponent } from 'src/app/shared/base/base.component';
import { dataSensitivityLevelOptions } from 'src/app/shared/models/it-system-usage/gdpr/data-sensitivity-level.model';
import { specificPersonalDataOptions } from 'src/app/shared/models/it-system-usage/gdpr/specific-personal-data.model';
import { ValidatedValueChange } from 'src/app/shared/models/validated-value-change.model';
import { filterNullish } from 'src/app/shared/pipes/filter-nullish';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { ITSystemUsageActions } from 'src/app/store/it-system-usage/actions';
import {
  selectITSystemUsageHasModifyPermission,
  selectItSystemUsageGdprDataSensitivityLevels,
  selectItSystemUsageGdprSensitivePersonalData,
  selectItSystemUsageGdprSpecificPersonalData,
} from 'src/app/store/it-system-usage/selectors';
import { RegularOptionTypeActions } from 'src/app/store/regular-option-type-store/actions';
import { selectRegularOptionTypes } from 'src/app/store/regular-option-type-store/selectors';

@Component({
  selector: 'app-data-sensitivity-section',
  templateUrl: './data-sensitivity-section.component.html',
  styleUrls: ['./data-sensitivity-section.component.scss', '../it-system-usage-details-gdpr.component.scss'],
})
export class DataSensitivitySectionComponent extends BaseComponent implements OnInit {
  @Output() public noPermissions = new EventEmitter<AbstractControl[]>();

  private readonly dataSensitivityLevelsDtoField = 'dataSensitivityLevels';
  private readonly specificPersonalDataDtoField = 'specificPersonalData';
  private readonly sensitivePersonalDataDtoField = 'sensitivePersonDataUuids';

  public readonly dataSensitivityLevels$ = this.store
    .select(selectItSystemUsageGdprDataSensitivityLevels)
    .pipe(filterNullish());
  public readonly specificPersonalData$ = this.store
    .select(selectItSystemUsageGdprSpecificPersonalData)
    .pipe(filterNullish());
  public readonly sensitivePersonalData$ = this.store
    .select(selectItSystemUsageGdprSensitivePersonalData)
    .pipe(filterNullish());

  public readonly dataSensitivityLevelOptions = dataSensitivityLevelOptions;
  public readonly specificPersonalDataOptions = specificPersonalDataOptions;
  public readonly sensitivePersonalDataOptions$ = this.store
    .select(selectRegularOptionTypes('it_system_usage-gdpr-sensitive-data-type'))
    .pipe(filterNullish());

  public readonly dataSensitivityLevelForm = new FormGroup(
    {
      NoneControl: new FormControl<boolean>(false),
      PersonDataControl: new FormControl<boolean>(false),
      SensitiveDataControl: new FormControl<boolean>(false),
      LegalDataControl: new FormControl<boolean>(false),
    },
    { updateOn: 'change' }
  );

  public readonly specificPersonalDataForm = new FormGroup(
    {
      CprNumberControl: new FormControl<boolean>(false),
      SocialProblemsControl: new FormControl<boolean>(false),
      OtherPrivateMattersControl: new FormControl<boolean>(false),
    },
    { updateOn: 'change' }
  );

  public readonly sensitivePersonDataForm = new FormGroup({}, { updateOn: 'change' });
  public hasModifyPermissions$ = this.store.select(selectITSystemUsageHasModifyPermission);

  constructor(private readonly store: Store, private readonly notificationService: NotificationService) {
    super();
  }

  ngOnInit(): void {
    this.store.dispatch(RegularOptionTypeActions.getOptions('it_system_usage-gdpr-sensitive-data-type'));
    this.setupDataSensitivityLevelForm();
    this.setupSpecificPersonalDataForm();
    this.setupSensitivePersonalDataForm();
    this.toggleControlState(this.specificPersonalDataForm, this.dataSensitivityLevelForm.controls.PersonDataControl.value);

    const forms = [this.dataSensitivityLevelForm, this.specificPersonalDataForm, this.sensitivePersonDataForm];
    this.noPermissions.emit(forms);
  }

  private setupDataSensitivityLevelForm(): void {
    this.dataSensitivityLevels$.subscribe((dataSensitivityLevels) => {
      this.dataSensitivityLevelForm.patchValue({
        NoneControl: dataSensitivityLevels?.includes(dataSensitivityLevelOptions[0]),
        PersonDataControl: dataSensitivityLevels?.includes(dataSensitivityLevelOptions[1]),
        SensitiveDataControl: dataSensitivityLevels?.includes(dataSensitivityLevelOptions[2]),
        LegalDataControl: dataSensitivityLevels?.includes(dataSensitivityLevelOptions[3]),
      });
    });
  }

  private setupSpecificPersonalDataForm(): void {
    this.specificPersonalData$.subscribe((specificPersonalData) => {
      this.specificPersonalDataForm.patchValue({
        CprNumberControl: specificPersonalData.includes(specificPersonalDataOptions[0]),
        SocialProblemsControl: specificPersonalData.includes(specificPersonalDataOptions[1]),
        OtherPrivateMattersControl: specificPersonalData.includes(specificPersonalDataOptions[2]),
      });
    });
  }

  private setupSensitivePersonalDataForm(): void {
    this.sensitivePersonalDataOptions$.subscribe((options) => {
      options?.forEach((option) => {
        this.sensitivePersonDataForm.addControl(option.uuid, new FormControl<boolean>({ value: false, disabled: true }));
        const newControl = this.sensitivePersonDataForm.get(option.uuid);
        if (newControl)
          this.toggleControlState(newControl, this.dataSensitivityLevelForm.controls.SensitiveDataControl.value);
      });
      this.sensitivePersonalData$.subscribe((sensitivePersonData) => {
        sensitivePersonData.forEach((type) => {
          if (type) {
            const control = this.sensitivePersonDataForm.get(type.uuid);
            control?.patchValue(true);
          }
        });
      });
    });
  }

  public patchDataSensitivityLevels(valueChange?: ValidatedValueChange<unknown>) {
    const dataSensitivityLevelEnums = dataSensitivityLevelOptions.map((option) => option.value);
    this.patchCheckboxFormData<APIGDPRWriteRequestDTO.DataSensitivityLevelsEnum>(
      this.dataSensitivityLevelForm,
      this.dataSensitivityLevelsDtoField,
      valueChange,
      dataSensitivityLevelEnums
    );
    this.toggleFormStates();
  }

  public patchSpecificPersonalData(valueChange?: ValidatedValueChange<unknown>) {
    const specificPersonalDataEnums = specificPersonalDataOptions.map((option) => option.value);
    this.patchCheckboxFormData<APIGDPRWriteRequestDTO.SpecificPersonalDataEnum>(
      this.specificPersonalDataForm,
      this.specificPersonalDataDtoField,
      valueChange,
      specificPersonalDataEnums
    );
  }

  public patchSensitivePersonalData(valueChange?: ValidatedValueChange<unknown>) {
    this.patchCheckboxFormData(this.sensitivePersonDataForm, this.sensitivePersonalDataDtoField, valueChange);
  }

  private patchCheckboxFormData<T>(
    form: FormGroup,
    dtoField: string,
    valueChange?: ValidatedValueChange<unknown>,
    options?: T[]
  ) {
    if (valueChange && !valueChange.valid) {
      this.notificationService.showInvalidFormField(valueChange.text);
    } else {
      let newData: T[] | string[];
      if (options) {
        newData = this.getEnumFormData(form, options);
      } else {
        newData = this.getChoiceTypeFormData(form);
      }
      this.store.dispatch(ITSystemUsageActions.patchITSystemUsage({ gdpr: { [dtoField]: newData } }));
    }
  }

  private getEnumFormData<T>(form: FormGroup, options: T[]): T[] {
    const newData: T[] = [];
    let i = 0;
    for (const controlKey in form.controls) {
      const control = form.get(controlKey);
      if (control?.value) newData.push(options[i]);
      i++;
    }
    return newData;
  }

  private getChoiceTypeFormData(form: FormGroup): string[] {
    const newData: string[] = [];
    for (const controlKey in form.controls) {
      const control = form.get(controlKey);
      if (control?.value) {
        newData.push(controlKey);
      }
    }
    return newData;
  }

  private toggleFormStates() {
    this.toggleControlState(this.specificPersonalDataForm, this.dataSensitivityLevelForm.controls.PersonDataControl.value);
    this.toggleControlState(
      this.sensitivePersonDataForm,
      this.dataSensitivityLevelForm.controls.SensitiveDataControl.value
    );
  }

  private toggleControlState(control: AbstractControl, value: boolean | null) {
    this.hasModifyPermissions$
      .pipe(
        filter((hasModifyPermissions) => hasModifyPermissions !== false))
      .subscribe(() => {
          if (value) {
            control.enable();
          } else {
            control.disable();
          }
        }
      );
  }
}
