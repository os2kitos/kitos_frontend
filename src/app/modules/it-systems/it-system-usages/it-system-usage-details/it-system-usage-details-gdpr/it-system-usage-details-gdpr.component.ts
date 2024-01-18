import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { BaseComponent } from 'src/app/shared/base/base.component';
import { HostedAt, hostedAtOptions } from 'src/app/shared/models/gdpr/hosted-at.model';
import { filterNullish } from 'src/app/shared/pipes/filter-nullish';
import { selectItSystemUsage } from 'src/app/store/it-system-usage/selectors';
import { RegularOptionTypeActions } from 'src/app/store/regular-option-type-store/actions';
import { selectRegularOptionTypes } from 'src/app/store/regular-option-type-store/selectors';
import { BusinessCritical, businessCriticalOptions, mapBusinessCritical } from '../../../../../shared/models/gdpr/business-critical.model';
import { EditUrlDialogComponent } from './edit-url-dialog/edit-url-dialog.component';

@Component({
  selector: 'app-it-system-usage-details-gdpr',
  templateUrl: './it-system-usage-details-gdpr.component.html',
  styleUrls: ['./it-system-usage-details-gdpr.component.scss']
})
export class ItSystemUsageDetailsGdprComponent extends BaseComponent implements OnInit {
  public readonly businessCriticalOptions = businessCriticalOptions;
  public readonly hostedAtOptions = hostedAtOptions;

  public readonly personDataTypes$ = this.store
  .select(selectRegularOptionTypes('it_system_usage-gdpr-person-data-type'))
  .pipe(filterNullish());

  public readonly generalInformationForm = new FormGroup(
    {
      systemOverallPurpose: new FormControl(''),
      businessCritical: new FormControl<BusinessCritical | undefined>(undefined),
      systemHosting: new FormControl<HostedAt | undefined>(undefined)  },
  { updateOn: 'blur' }
  );

  public readonly dataSensitivityLevelForm = new FormGroup(
    {
      None: new FormControl<boolean>(false),
      PersonData: new FormControl<boolean>(false),
      SensitiveData: new FormControl<boolean>(false),
      LegalData: new FormControl<boolean>(false),
    },
    { updateOn: 'blur'}
  );

  constructor(
    private readonly store: Store,
    private readonly dialog: MatDialog,
    ) {
    super();
  }

  public onEdit(){
    this.dialog.open(EditUrlDialogComponent)
  }

  public ngOnInit(): void {
    this.store.dispatch(RegularOptionTypeActions.getOptions('it_system_usage-gdpr-person-data-type'))
    this.subscriptions.add(
      this.store
      .select(selectItSystemUsage)
      .pipe(filterNullish())
      .subscribe((itSystemUsage) => {
        this.generalInformationForm.patchValue({
            systemOverallPurpose: itSystemUsage.gdpr.purpose,
            businessCritical: mapBusinessCritical(itSystemUsage.gdpr.businessCritical)
        })
      })
    )
  }
}
