import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { combineLatest } from 'rxjs';
import { APIExpectedUsersIntervalDTO, APIItSystemUsageValidityResponseDTO } from 'src/app/api/v2';
import { BaseComponent } from 'src/app/shared/base/base.component';
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
      lastModified: new FormControl({ value: '', disabled: true }),
      lifeCycleStatus: new FormControl<APIItSystemUsageValidityResponseDTO.LifeCycleStatusEnum | undefined>(undefined),
      validFrom: new FormControl(''),
      validTo: new FormControl(''),
      valid: new FormControl({ value: false, disabled: true }),
    },
    { updateOn: 'blur' }
  );

  public readonly numberOfExpectedUsersOptions: NumberOfExpectedUser[] = [
    { name: '<10', value: { lowerBound: 0 } },
    { name: '10-50', value: { lowerBound: 10 } },
    { name: '50-100', value: { lowerBound: 50 } },
    { name: '>100', value: { lowerBound: 100 } },
  ];

  public itSystemUsageValid$ = this.store.select(selectItSystemUsageValid);

  public itSystemUsageClassificationTypes$ = this.store.select(selectItSystemUsageDataClassificationTypes);

  constructor(private store: Store) {
    super();
  }

  ngOnInit() {
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

        this.itSystemApplicationForm.patchValue({
          createdBy: itSystemUsage.createdBy.name,
          lastModifiedBy: itSystemUsage.lastModifiedBy.name,
          lastModified: itSystemUsage.lastModified,
          lifeCycleStatus: itSystemUsage.general.validity.lifeCycleStatus,
          validFrom: itSystemUsage.general.validity.validFrom,
          validTo: itSystemUsage.general.validity.validTo,
          valid: itSystemUsage.general.validity.valid,
        });
      })
    );
  }
}
