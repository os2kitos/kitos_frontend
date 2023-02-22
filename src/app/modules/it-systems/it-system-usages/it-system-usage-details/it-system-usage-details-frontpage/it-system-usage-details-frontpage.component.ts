import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { compact } from 'lodash';
import { combineLatest, map } from 'rxjs';
import { APIExpectedUsersIntervalDTO } from 'src/app/api/v2';
import { BaseComponent } from 'src/app/shared/base/base.component';
import { dateGreaterThanValidator, dateLessThanValidator } from 'src/app/shared/helpers/form.helpers';
import { ITSystemUsageActions } from 'src/app/store/it-system-usage/actions';
import {
  selectItSystemUsage,
  selectItSystemUsageDataClassificationTypes,
  selectItSystemUsageGeneral,
  selectItSystemUsageValid,
} from 'src/app/store/it-system-usage/selectors';

interface NumberOfExpectedUser {
  name: string;
  value: APIExpectedUsersIntervalDTO;
}

@Component({
  templateUrl: 'it-system-usage-details-frontpage.component.html',
  styleUrls: ['it-system-usage-details-frontpage.component.scss'],
})
export class ITSystemUsageDetailsFrontpageComponent extends BaseComponent implements OnInit {
  public readonly itSystemInformationForm = new FormGroup(
    {
      localCallName: new FormControl('', Validators.maxLength(100)),
      localSystemId: new FormControl('', Validators.maxLength(200)),
      systemVersion: new FormControl('', Validators.maxLength(100)),
      numberOfExpectedUsers: new FormControl<NumberOfExpectedUser | undefined>(undefined),
      dataClassificationUuid: new FormControl(''),
      notes: new FormControl(''),
    },
    { updateOn: 'blur' }
  );

  public readonly itSystemApplicationForm = new FormGroup(
    {
      createdBy: new FormControl({ value: '', disabled: true }),
      lastModifiedBy: new FormControl({ value: '', disabled: true }),
      lastModified: new FormControl<Date | undefined>({ value: undefined, disabled: true }),
      lifeCycleStatus: new FormControl<number | undefined>(undefined),
      validFrom: new FormControl<Date | undefined>(undefined),
      validTo: new FormControl<Date | undefined>(undefined),
      valid: new FormControl({ value: '', disabled: true }),
    },
    { updateOn: 'blur' }
  );

  public readonly numberOfExpectedUsersOptions: NumberOfExpectedUser[] = [
    { name: '<10', value: { lowerBound: 0, upperBound: 9 } },
    { name: '10-50', value: { lowerBound: 10, upperBound: 49 } },
    { name: '50-100', value: { lowerBound: 50, upperBound: 99 } },
    { name: '>100', value: { lowerBound: 100, upperBound: undefined } },
  ];

  public readonly lifeCycleOptions = [
    {
      name: $localize`Under indfasning`,
      value: 2 /* APIItSystemUsageValidityResponseDTO.LifeCycleStatusEnum.PhasingIn */,
    },
    { name: $localize`I drift`, value: 3 /* APIItSystemUsageValidityResponseDTO.LifeCycleStatusEnum.Operational */ },
    {
      name: $localize`Under udfasning`,
      value: 4 /* APIItSystemUsageValidityResponseDTO.LifeCycleStatusEnum.PhasingOut */,
    },
    { name: $localize`Ikke i drift`, value: 1 /* APIItSystemUsageValidityResponseDTO.LifeCycleStatusEnum.NotInUse */ },
  ];

  public itSystemUsageValid$ = this.store.select(selectItSystemUsageValid);

  public itSystemUsageClassificationTypes$ = this.store.select(selectItSystemUsageDataClassificationTypes);

  public invalidReason$ = this.store.select(selectItSystemUsageGeneral).pipe(
    map((general) => {
      if (general?.validity.valid) return undefined;

      return $localize`Følgende gør systemet 'ikke aktivt': ${compact([
        general?.validity.validAccordingToLifeCycle ? undefined : $localize`Livscyklus`,
        general?.validity.validAccordingToMainContract ? undefined : $localize`Den markerede kontrakt`,
        general?.validity.validAccordingToValidityPeriod ? undefined : $localize`"Gyldig til" er overskredet`,
      ]).join(', ')}`;
    })
  );

  constructor(private store: Store) {
    super();
  }

  ngOnInit() {
    this.itSystemApplicationForm.controls.validFrom.validator = dateLessThanValidator(
      this.itSystemApplicationForm.controls.validTo
    );
    this.itSystemApplicationForm.controls.validTo.validator = dateGreaterThanValidator(
      this.itSystemApplicationForm.controls.validFrom
    );

    this.store.dispatch(ITSystemUsageActions.getItSystemUsageClassificationTypes());

    this.subscriptions.add(
      this.itSystemInformationForm.valueChanges.subscribe((value) => {
        console.log('Form update', value);
      })
    );

    this.subscriptions.add(
      this.itSystemApplicationForm.valueChanges.subscribe((value) => {
        console.log('Form update', value);
      })
    );

    this.subscriptions.add(
      combineLatest([this.store.select(selectItSystemUsageGeneral), this.itSystemUsageClassificationTypes$]).subscribe(
        ([general, classificationTypes]) => {
          if (!general || classificationTypes.length === 0) return;

          this.itSystemInformationForm.patchValue({
            localCallName: general.localCallName,
            localSystemId: general.localSystemId,
            systemVersion: general.systemVersion,
            numberOfExpectedUsers: this.numberOfExpectedUsersOptions.find(
              (option) => option.value.lowerBound === general.numberOfExpectedUsers?.lowerBound
            ),
            dataClassificationUuid: general.dataClassification?.uuid,
            notes: general.notes,
          });
        }
      )
    );

    this.subscriptions.add(
      this.store.select(selectItSystemUsage).subscribe((itSystemUsage) => {
        if (!itSystemUsage) return;

        const validFrom = itSystemUsage.general.validity.validFrom;
        const validTo = itSystemUsage.general.validity.validTo;

        this.itSystemApplicationForm.patchValue({
          createdBy: itSystemUsage.createdBy.name,
          lastModifiedBy: itSystemUsage.lastModifiedBy.name,
          lastModified: new Date(itSystemUsage.lastModified),
          lifeCycleStatus: Number(itSystemUsage.general.validity.lifeCycleStatus),
          validFrom: validFrom ? new Date(validFrom) : undefined,
          validTo: validTo ? new Date(validTo) : undefined,
          valid: itSystemUsage.general.validity.valid
            ? $localize`Systemet er aktivt`
            : $localize`Systemet er ikke aktivt`,
        });
      })
    );
  }
}
