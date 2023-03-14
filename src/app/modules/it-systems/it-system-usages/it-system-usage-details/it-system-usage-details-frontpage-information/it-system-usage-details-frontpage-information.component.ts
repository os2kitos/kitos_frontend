import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { compact } from 'lodash';
import { filter, map } from 'rxjs';
import {
  APIGeneralDataUpdateRequestDTO,
  APIIdentityNamePairResponseDTO,
  APIItSystemUsageValidityResponseDTO,
} from 'src/app/api/v2';
import { BaseComponent } from 'src/app/shared/base/base.component';
import { optionalNewDate } from 'src/app/shared/helpers/date.helpers';
import { dateGreaterThanValidator, dateLessThanValidator } from 'src/app/shared/helpers/form.helpers';
import { lifeCycleStatusOptions, mapLifeCycleStatus } from 'src/app/shared/models/life-cycle-status.model';
import {
  mapNumberOfExpectedUsers,
  NumberOfExpectedUsers,
  numberOfExpectedUsersOptions,
} from 'src/app/shared/models/number-of-expected-users.model';
import { filterNullish } from 'src/app/shared/pipes/filter-nullish';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { DataClassificationTypeActions } from 'src/app/store/data-classification-type/actions';
import { selectDataClassificationTypes } from 'src/app/store/data-classification-type/selectors';
import { ITSystemUsageActions } from 'src/app/store/it-system-usage/actions';
import {
  selectItSystemUsage,
  selectItSystemUsageGeneral,
  selectITSystemUsageHasModifyPermission,
  selectItSystemUsageValid,
} from 'src/app/store/it-system-usage/selectors';

@Component({
  selector: 'app-it-system-usage-details-frontpage-information',
  templateUrl: 'it-system-usage-details-frontpage-information.component.html',
  styleUrls: ['it-system-usage-details-frontpage-information.component.scss'],
})
export class ITSystemUsageDetailsFrontpageInformationComponent extends BaseComponent implements OnInit {
  public readonly itSystemInformationForm = new FormGroup({
    localCallName: new FormControl('', Validators.maxLength(100)),
    localSystemId: new FormControl('', Validators.maxLength(200)),
    systemVersion: new FormControl('', Validators.maxLength(100)),
    numberOfExpectedUsers: new FormControl<NumberOfExpectedUsers | undefined>(undefined),
    dataClassification: new FormControl<APIIdentityNamePairResponseDTO | undefined>(undefined),
    notes: new FormControl(''),
  });

  public readonly itSystemApplicationForm = new FormGroup({
    createdBy: new FormControl({ value: '', disabled: true }),
    lastModifiedBy: new FormControl({ value: '', disabled: true }),
    lastModified: new FormControl<Date | undefined>({ value: undefined, disabled: true }),
    lifeCycleStatus: new FormControl<APIItSystemUsageValidityResponseDTO.LifeCycleStatusEnum | undefined>(undefined),
    validFrom: new FormControl<Date | undefined>(undefined),
    validTo: new FormControl<Date | undefined>(undefined),
    valid: new FormControl({ value: '', disabled: true }),
  });

  public readonly numberOfExpectedUsersOptions = numberOfExpectedUsersOptions;
  public readonly lifeCycleStatusOptions = lifeCycleStatusOptions;

  public readonly itSystemUsageValid$ = this.store.select(selectItSystemUsageValid);

  public readonly dataClassificationTypes$ = this.store.select(selectDataClassificationTypes);

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

  constructor(private store: Store, private notificationService: NotificationService) {
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

    this.store.dispatch(DataClassificationTypeActions.getDataClassificationTypes());

    // Disable forms if user does not have rights to modify
    this.subscriptions.add(
      this.store
        .select(selectITSystemUsageHasModifyPermission)
        .pipe(filter((hasModifyPermission) => hasModifyPermission === false))
        .subscribe(() => {
          this.itSystemInformationForm.disable();
          this.itSystemApplicationForm.disable();
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
            numberOfExpectedUsers: mapNumberOfExpectedUsers(general.numberOfExpectedUsers),
            dataClassification: general.dataClassification,
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

  public patchITSystemInformationForm(general: APIGeneralDataUpdateRequestDTO) {
    if (this.itSystemInformationForm.valid) {
      this.store.dispatch(ITSystemUsageActions.patchItSystemUsage({ general }));
    } else {
      this.notificationService.showError($localize`IT system information er invalid`);
    }
  }

  public patchITSystemApplicationForm(general: APIGeneralDataUpdateRequestDTO) {
    if (this.itSystemApplicationForm.valid) {
      this.store.dispatch(ITSystemUsageActions.patchItSystemUsage({ general }));
    } else {
      this.notificationService.showError($localize`System anvendelse er invalid`);
    }
  }
}
