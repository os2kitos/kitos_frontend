import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Store } from '@ngrx/store';
import { filter } from 'rxjs';
import { APIExpectedUsersIntervalDTO } from 'src/app/api/v2';
import { BaseComponent } from 'src/app/shared/base/base.component';
import { selectITSystemUsageGeneral } from 'src/app/store/it-system-usage/selectors';

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
      localCallName: new FormControl(''),
      localSystemId: new FormControl(''),
      systemVersion: new FormControl(''),
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

  constructor(private store: Store) {
    super();
  }

  ngOnInit() {
    this.subscriptions.add(
      this.itSystemForm.valueChanges.subscribe((value) => {
        console.log(value);
      })
    );

    this.subscriptions.add(
      this.store
        .select(selectITSystemUsageGeneral)
        .pipe(filter((general) => !!general))
        .subscribe((general) =>
          this.itSystemForm.patchValue({
            localCallName: general?.localCallName,
            localSystemId: general?.localSystemId,
            systemVersion: general?.systemVersion,
            numberOfExpectedUsers: this.numberOfExpectedUsersOptions.find(
              (option) => option.value.lowerBound === general?.numberOfExpectedUsers?.lowerBound
            ),
            dataClassificationUuid: general?.dataClassification?.name,
            notes: general?.notes,
          })
        )
    );
  }
}
