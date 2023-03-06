import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { compact } from 'lodash';
import { first, map } from 'rxjs';
import { APIIdentityNamePairResponseDTO, APIItSystemUsageValidityResponseDTO } from 'src/app/api/v2';
import { BaseComponent } from 'src/app/shared/base/base.component';
import { optionalNewDate } from 'src/app/shared/helpers/date.helpers';
import { dateGreaterThanValidator, dateLessThanValidator } from 'src/app/shared/helpers/form.helpers';
import { lifeCycleStatusOptions, mapLifeCycleStatus } from 'src/app/shared/models/life-cycle-status.model';
import {
  NumberOfExpectedUsers,
  numberOfExpectedUsersOptions,
} from 'src/app/shared/models/number-of-expected-users.model';
import { filterNullish } from 'src/app/shared/pipes/filter-nullish';
import {
  selectItSystemUsage,
  selectItSystemUsageGeneral,
  selectItSystemUsageValid,
} from 'src/app/store/it-system-usage/selectors';
import { selectOrganizationUuid } from 'src/app/store/user-store/selectors';
import { ITSystemUsageDetailsFrontpageInformationComponentStore } from './it-system-usage-details-frontpage-information.component-store';

@Component({
  selector: 'app-it-system-usage-details-frontpage-information',
  templateUrl: 'it-system-usage-details-frontpage-information.component.html',
  styleUrls: ['it-system-usage-details-frontpage-information.component.scss'],
})
export class ITSystemUsageDetailsFrontpageInformationComponent extends BaseComponent implements OnInit {
  public readonly itSystemInformationForm = new FormGroup(
    {
      localCallName: new FormControl('', Validators.maxLength(100)),
      localSystemId: new FormControl('', Validators.maxLength(200)),
      systemVersion: new FormControl('', Validators.maxLength(100)),
      numberOfExpectedUsers: new FormControl<NumberOfExpectedUsers | undefined>(undefined),
      dataClassificationUuid: new FormControl<APIIdentityNamePairResponseDTO | undefined>(undefined),
      notes: new FormControl(''),
    },
    { updateOn: 'blur' }
  );

  public readonly itSystemApplicationForm = new FormGroup(
    {
      createdBy: new FormControl({ value: '', disabled: true }),
      lastModifiedBy: new FormControl({ value: '', disabled: true }),
      lastModified: new FormControl<Date | undefined>({ value: undefined, disabled: true }),
      lifeCycleStatus: new FormControl<APIItSystemUsageValidityResponseDTO.LifeCycleStatusEnum | undefined>(undefined),
      validFrom: new FormControl<Date | undefined>(undefined),
      validTo: new FormControl<Date | undefined>(undefined),
      valid: new FormControl({ value: '', disabled: true }),
    },
    { updateOn: 'blur' }
  );

  public readonly numberOfExpectedUsersOptions = numberOfExpectedUsersOptions;
  public readonly lifeCycleStatusOptions = lifeCycleStatusOptions;

  public readonly itSystemUsageValid$ = this.store.select(selectItSystemUsageValid);

  public readonly dataClassificationTypes$ = this.componentStore.dataClassificationTypes$;

  public readonly invalidReason$ = this.store.select(selectItSystemUsageGeneral).pipe(
    map((general) => {
      if (general?.validity.valid) return undefined;

      return (
        $localize`Følgende gør systemet 'ikke aktivt': ` +
        compact([
          general?.validity.validAccordingToLifeCycle ? undefined : $localize`Livscyklus`,
          general?.validity.validAccordingToMainContract ? undefined : $localize`Den markerede kontrakt`,
          general?.validity.validAccordingToValidityPeriod ? undefined : $localize`Ibrugtagningsperiode`,
        ]).join(', ')
      );
    })
  );

  constructor(private store: Store, private componentStore: ITSystemUsageDetailsFrontpageInformationComponentStore) {
    super();
  }

  ngOnInit() {
    // Add custom date validators
    this.itSystemApplicationForm.controls.validFrom.validator = dateLessThanValidator(
      this.itSystemApplicationForm.controls.validTo
    );
    this.itSystemApplicationForm.controls.validTo.validator = dateGreaterThanValidator(
      this.itSystemApplicationForm.controls.validFrom
    );

    // Fetch data classification types
    this.subscriptions.add(
      this.store
        .select(selectOrganizationUuid)
        .pipe(filterNullish(), first())
        .subscribe((organizationUuid) => this.componentStore.getDataClassificationTypes(organizationUuid))
    );

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

    // Set initial state of information form
    this.subscriptions.add(
      this.store
        .select(selectItSystemUsageGeneral)
        .pipe(filterNullish())
        .subscribe((general) =>
          this.itSystemInformationForm.patchValue({
            localCallName: general.localCallName,
            localSystemId: general.localSystemId,
            systemVersion: general.systemVersion,
            numberOfExpectedUsers: this.numberOfExpectedUsersOptions.find(
              (option) => option.value.lowerBound === general.numberOfExpectedUsers?.lowerBound
            ),
            dataClassificationUuid: general.dataClassification,
            notes: general.notes,
          })
        )
    );

    // Set initial state of application form
    this.subscriptions.add(
      this.store
        .select(selectItSystemUsage)
        .pipe(filterNullish())
        .subscribe((itSystemUsage) =>
          this.itSystemApplicationForm.patchValue({
            createdBy: itSystemUsage.createdBy.name,
            lastModifiedBy: itSystemUsage.lastModifiedBy.name,
            lastModified: new Date(itSystemUsage.lastModified),
            lifeCycleStatus: mapLifeCycleStatus(itSystemUsage.general.validity.lifeCycleStatus),
            validFrom: optionalNewDate(itSystemUsage.general.validity.validFrom),
            validTo: optionalNewDate(itSystemUsage.general.validity.validTo),
            valid: itSystemUsage.general.validity.valid
              ? $localize`Systemet er aktivt`
              : $localize`Systemet er ikke aktivt`,
          })
        )
    );
  }
}
