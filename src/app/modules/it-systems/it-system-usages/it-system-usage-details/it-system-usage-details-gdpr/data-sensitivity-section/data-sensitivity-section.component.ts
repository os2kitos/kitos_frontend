import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Store } from '@ngrx/store';
import { APIGDPRWriteRequestDTO } from 'src/app/api/v2';
import { BaseComponent } from 'src/app/shared/base/base.component';
import { DataSensitivityLevel, dataSensitivityLevelOptions, mapDataSensitivityLevel } from 'src/app/shared/models/gdpr/data-sensitivity-level.model';
import { ValidatedValueChange } from 'src/app/shared/models/validated-value-change.model';
import { filterNullish } from 'src/app/shared/pipes/filter-nullish';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { ITSystemUsageActions } from 'src/app/store/it-system-usage/actions';
import { selectItSystemUsageGdpr } from 'src/app/store/it-system-usage/selectors';

@Component({
  selector: 'app-data-sensitivity-section',
  templateUrl: './data-sensitivity-section.component.html',
  styleUrls: ['../it-system-usage-details-gdpr.component.scss']
})
export class DataSensitivitySectionComponent extends BaseComponent implements OnInit{
  public readonly dataSensitivityLevelOptions = dataSensitivityLevelOptions;

  public readonly dataSensitivityLevelForm = new FormGroup(
    {
      None: new FormControl<boolean>(false),
      PersonData: new FormControl<boolean>(false),
      SensitiveData: new FormControl<boolean>(false),
      LegalData: new FormControl<boolean>(false),
    },
    { updateOn: 'change'}
  );

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
          })}
          )
      )
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
      }
    }

}
