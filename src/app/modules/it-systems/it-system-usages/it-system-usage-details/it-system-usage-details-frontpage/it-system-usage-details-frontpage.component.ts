import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { combineLatest } from 'rxjs';
import { APIExpectedUsersIntervalDTO } from 'src/app/api/v2';
import { BaseComponent } from 'src/app/shared/base/base.component';
import { ITSystemUsageActions } from 'src/app/store/it-system-usage/actions';
import {
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
  public readonly itSystemForm = new FormGroup(
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
      this.itSystemForm.valueChanges.subscribe((value) => {
        console.log('Form update', value);
      })
    );

    this.subscriptions.add(
      combineLatest([this.store.select(selectItSystemUsageGeneral), this.itSystemUsageClassificationTypes$]).subscribe(
        ([general, classificationTypes]) => {
          if (!general || classificationTypes.length === 0) return;

          return this.itSystemForm.patchValue({
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
  }
}
