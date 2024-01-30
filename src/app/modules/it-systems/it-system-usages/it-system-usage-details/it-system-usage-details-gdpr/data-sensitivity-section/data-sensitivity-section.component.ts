import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup } from '@angular/forms';
import { Store } from '@ngrx/store';
import { APIGDPRRegistrationsResponseDTO, APIGDPRWriteRequestDTO } from 'src/app/api/v2';
import { BaseComponent } from 'src/app/shared/base/base.component';
import { DataSensitivityLevel, dataSensitivityLevelOptions, mapDataSensitivityLevel } from 'src/app/shared/models/gdpr/data-sensitivity-level.model';
import { SpecificPersonalData, mapSpecificPersonalData, specificPersonalDataOptions } from 'src/app/shared/models/gdpr/specific-personal-data.model';
import { IdentityNamePair, mapIdentityNamePair } from 'src/app/shared/models/identity-name-pair.model';
import { ValidatedValueChange } from 'src/app/shared/models/validated-value-change.model';
import { filterNullish } from 'src/app/shared/pipes/filter-nullish';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { ITSystemUsageActions } from 'src/app/store/it-system-usage/actions';
import { selectItSystemUsageGdpr } from 'src/app/store/it-system-usage/selectors';
import { RegularOptionTypeActions } from 'src/app/store/regular-option-type-store/actions';
import { selectRegularOptionTypes } from 'src/app/store/regular-option-type-store/selectors';

@Component({
  selector: 'app-data-sensitivity-section',
  templateUrl: './data-sensitivity-section.component.html',
  styleUrls: ['./data-sensitivity-section.component.scss', '../it-system-usage-details-gdpr.component.scss']
})
export class DataSensitivitySectionComponent extends BaseComponent implements OnInit{
  public readonly dataSensitivityLevelOptions = dataSensitivityLevelOptions;
  public readonly specificPersonalDataOptions = specificPersonalDataOptions;
  public readonly sensitivePersonalDataOptions$ = this.store
    .select(selectRegularOptionTypes('it_system_usage-gdpr-sensitive-data-type'))

  public readonly dataSensitivityLevelForm = new FormGroup(
    {
      NoneControl: new FormControl<boolean>(false),
      PersonDataControl: new FormControl<boolean>(false),
      SensitiveDataControl: new FormControl<boolean>(false),
      LegalDataControl: new FormControl<boolean>(false),
    },
    { updateOn: 'change'}
  );

  public readonly specificPersonalDataForm = new FormGroup(
    {
      CprNumberControl: new FormControl<boolean>(false),
      SocialProblemsControl: new FormControl<boolean>(false),
      OtherPrivateMattersControl: new FormControl<boolean>(false)
    },
    { updateOn: 'change'}
  )

  public readonly sensitivePersonDataForm = new FormGroup({},
    { updateOn: 'change'})

  constructor(
    private readonly store: Store,
    private readonly notificationService: NotificationService
    ) {
    super();
  }

  ngOnInit(): void {
    this.store.dispatch(RegularOptionTypeActions.getOptions('it_system_usage-gdpr-sensitive-data-type'));

    this.subscriptions.add(
      this.store
      .select(selectItSystemUsageGdpr)
      .pipe(filterNullish())
      .subscribe((gdpr) => {
        this.setupDataSensitivityLevels(gdpr);
        this.setupSpecificPersonalData(gdpr);
        this.setupSensitivePersonalData(gdpr);
        }
      ))
      this.toggleFormState(this.specificPersonalDataForm, this.dataSensitivityLevelForm.controls.PersonDataControl.value)
    }

    private setupDataSensitivityLevels(gdpr: APIGDPRRegistrationsResponseDTO): void {
      const dataSensitivityLevels: (DataSensitivityLevel | undefined)[] = [];
        gdpr.dataSensitivityLevels.forEach((level) => dataSensitivityLevels.push(mapDataSensitivityLevel(level)))
        this.dataSensitivityLevelForm.patchValue({
            NoneControl: dataSensitivityLevels.includes(dataSensitivityLevelOptions[0]),
            PersonDataControl: dataSensitivityLevels.includes(dataSensitivityLevelOptions[1]),
            SensitiveDataControl: dataSensitivityLevels.includes(dataSensitivityLevelOptions[2]),
            LegalDataControl: dataSensitivityLevels.includes(dataSensitivityLevelOptions[3])
          })
    }

    private setupSpecificPersonalData(gdpr: APIGDPRRegistrationsResponseDTO): void {
      const specificPersonalData: (SpecificPersonalData | undefined)[] = [];
        gdpr.specificPersonalData.forEach((personalDataType) => specificPersonalData.push(mapSpecificPersonalData(personalDataType)))
        this.specificPersonalDataForm.patchValue({
          CprNumberControl: specificPersonalData.includes(specificPersonalDataOptions[0]),
          SocialProblemsControl: specificPersonalData.includes(specificPersonalDataOptions[1]),
          OtherPrivateMattersControl: specificPersonalData.includes(specificPersonalDataOptions[2])
        })
    }

    private setupSensitivePersonalData(gdpr: APIGDPRRegistrationsResponseDTO): void {
      this.sensitivePersonalDataOptions$.subscribe((options) => {
          options?.forEach((option) => {
            this.sensitivePersonDataForm.addControl(option.uuid, new FormControl<boolean>(false));
            const newControl = this.sensitivePersonDataForm.get(option.uuid);
            if (newControl) this.toggleFormState(newControl, this.dataSensitivityLevelForm.controls.SensitiveDataControl.value)
          })
        })

      const sensitivePersonData: (IdentityNamePair | undefined)[] = [];
      gdpr.sensitivePersonData.forEach((sensitiveDataType) => sensitivePersonData.push(mapIdentityNamePair(sensitiveDataType)))
      sensitivePersonData.forEach((type) => {
          if (type){
            const control = this.sensitivePersonDataForm.get(type.uuid);
            control?.patchValue(true)
          }
      })
    }

    public patchDataSensitivityLevels(valueChange?: ValidatedValueChange<unknown>) {
      if (valueChange && !valueChange.valid) {
          this.notificationService.showInvalidFormField(valueChange.text);
      } else {
        const controls = this.dataSensitivityLevelForm.controls;
        const controlValues = [controls.NoneControl.value, controls.PersonDataControl.value, controls.SensitiveDataControl.value, controls.LegalDataControl.value]
        const newLevels: APIGDPRWriteRequestDTO.DataSensitivityLevelsEnum[] = [];

        controlValues.forEach((value, i) => {
          if (value) newLevels.push(dataSensitivityLevelOptions[i].value);
        });

        this.store.dispatch(ITSystemUsageActions.patchItSystemUsage({ gdpr: { dataSensitivityLevels: newLevels } }));
        this.toggleFormStates()
      }
    }

    public patchSpecificPersonalData(valueChange?: ValidatedValueChange<unknown>) {
      if (valueChange && !valueChange.valid) {
        this.notificationService.showInvalidFormField(valueChange.text);
    } else {
      const controls = this.specificPersonalDataForm.controls;
      const controlValues = [controls.CprNumberControl.value, controls.SocialProblemsControl.value, controls.OtherPrivateMattersControl.value]
      const newSpecificPersonalData: APIGDPRWriteRequestDTO.SpecificPersonalDataEnum[] = [];

      controlValues.forEach((value, i) => {
        if (value) newSpecificPersonalData.push(specificPersonalDataOptions[i].value);
      });

      this.store.dispatch(ITSystemUsageActions.patchItSystemUsage({ gdpr: { specificPersonalData: newSpecificPersonalData } }));
    }
  }

    public patchSensitivePersonalData(valueChange?: ValidatedValueChange<unknown>) {
      if (valueChange && !valueChange.valid) {
        this.notificationService.showInvalidFormField(valueChange.text);
    } else {
      const newSensitivePersonalDataUuids: string[] = [];
      for (const controlKey in this.sensitivePersonDataForm.controls){
        const control = this.sensitivePersonDataForm.get(controlKey);
        if (control?.value){
          newSensitivePersonalDataUuids.push(controlKey);
        }
      }
      this.store.dispatch(ITSystemUsageActions.patchItSystemUsage({ gdpr: { sensitivePersonDataUuids: newSensitivePersonalDataUuids } }));
    }
  }

    public toggleFormStates(){
      this.toggleFormState(this.specificPersonalDataForm, this.dataSensitivityLevelForm.controls.PersonDataControl.value)
      this.toggleFormState(this.sensitivePersonDataForm, this.dataSensitivityLevelForm.controls.SensitiveDataControl.value)
    }

    private toggleFormState(form: FormGroup | AbstractControl, value: boolean | null){
      if (value) {
        form.enable()
      } else {
        form.disable()
      }
    }
}

