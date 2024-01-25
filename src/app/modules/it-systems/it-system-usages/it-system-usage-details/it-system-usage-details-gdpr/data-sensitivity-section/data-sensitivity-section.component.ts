import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Store } from '@ngrx/store';
import { APIGDPRWriteRequestDTO } from 'src/app/api/v2';
import { BaseComponent } from 'src/app/shared/base/base.component';
import { DataSensitivityLevel, dataSensitivityLevelOptions, mapDataSensitivityLevel } from 'src/app/shared/models/gdpr/data-sensitivity-level.model';
import { SpecificPersonalData, mapSpecificPersonalData, specificPersonalDataOptions } from 'src/app/shared/models/gdpr/specific-personal-data.model';
import { ValidatedValueChange } from 'src/app/shared/models/validated-value-change.model';
import { filterNullish } from 'src/app/shared/pipes/filter-nullish';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { ITSystemUsageActions } from 'src/app/store/it-system-usage/actions';
import { selectItSystemUsageGdpr } from 'src/app/store/it-system-usage/selectors';

@Component({
  selector: 'app-data-sensitivity-section',
  templateUrl: './data-sensitivity-section.component.html',
  styleUrls: ['./data-sensitivity-section.component.scss', '../it-system-usage-details-gdpr.component.scss']
})
export class DataSensitivitySectionComponent extends BaseComponent implements OnInit{
  public readonly dataSensitivityLevelOptions = dataSensitivityLevelOptions;
  public readonly specificPersonalDataOptions = specificPersonalDataOptions;

  public readonly dataSensitivityLevelForm = new FormGroup(
    {
      None: new FormControl<boolean>(false),
      PersonData: new FormControl<boolean>(false),
      SensitiveData: new FormControl<boolean>(false),
      LegalData: new FormControl<boolean>(false),
    },
    { updateOn: 'change'}
  );

  public readonly specificPersonalDataForm = new FormGroup(
    {
      CprNumber: new FormControl<boolean>(false),
      SocialProblems: new FormControl<boolean>(false),
      OtherPrivateMatters: new FormControl<boolean>(false)
    },
    { updateOn: 'change'}
  )

  constructor(
    private readonly store: Store,
    private readonly notificationService: NotificationService
    ) {
    super();
  }

  ngOnInit(): void {
    this.subscriptions.add(
      this.store
      .select(selectItSystemUsageGdpr)
      .pipe(filterNullish())
      .subscribe((gdpr) => {
        const levels: (DataSensitivityLevel | undefined)[] = [];
        gdpr.dataSensitivityLevels.forEach((level) => levels.push(mapDataSensitivityLevel(level)))
        this.dataSensitivityLevelForm.patchValue({
            None: levels.includes(dataSensitivityLevelOptions[0]),
            PersonData: levels.includes(dataSensitivityLevelOptions[1]),
            SensitiveData: levels.includes(dataSensitivityLevelOptions[2]),
            LegalData: levels.includes(dataSensitivityLevelOptions[3])
          })

        const specificPersonalData: (SpecificPersonalData | undefined)[] = [];
        gdpr.specificPersonalData.forEach((type) => specificPersonalData.push(mapSpecificPersonalData(type)))
        this.specificPersonalDataForm.patchValue({
          CprNumber: specificPersonalData.includes(specificPersonalDataOptions[0]),
          SocialProblems: specificPersonalData.includes(specificPersonalDataOptions[1]),
          OtherPrivateMatters: specificPersonalData.includes(specificPersonalDataOptions[2])
        })
        }
      ))
      this.toggleFormStates()
    }

    public patchDataSensitivityLevels(valueChange?: ValidatedValueChange<unknown>) {
      if (valueChange && !valueChange.valid) {
          this.notificationService.showInvalidFormField(valueChange.text);
      } else {
        const controls = this.dataSensitivityLevelForm.controls;
        const controlValues = [controls.None.value, controls.PersonData.value, controls.SensitiveData.value, controls.LegalData.value]
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
      const controlValues = [controls.CprNumber.value, controls.SocialProblems.value, controls.OtherPrivateMatters.value]
      const newpecificPersonalData: APIGDPRWriteRequestDTO.SpecificPersonalDataEnum[] = [];

      controlValues.forEach((value, i) => {
        if (value) newpecificPersonalData.push(specificPersonalDataOptions[i].value);
      });

      this.store.dispatch(ITSystemUsageActions.patchItSystemUsage({ gdpr: { specificPersonalData: newpecificPersonalData } }));
    }
  }


    public toggleFormStates(){
      this.toggleFormState(this.specificPersonalDataForm, this.dataSensitivityLevelForm.controls.PersonData.value)
      this.toggleFormState(this.sensitivePersonDataForm, this.dataSensitivityLevelForm.controls.SensitiveData.value)
    }

    private toggleFormState(form: FormGroup, value: boolean | null){
      if (value) {
        form.enable()
      } else {
        form.disable()
      }
    }
}

