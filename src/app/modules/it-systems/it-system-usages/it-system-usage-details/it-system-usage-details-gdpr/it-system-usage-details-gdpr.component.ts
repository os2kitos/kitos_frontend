import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Store } from '@ngrx/store';
import { BaseComponent } from 'src/app/shared/base/base.component';
import { HostedAt, hostedAtOptions, mapHostedAt } from 'src/app/shared/models/gdpr/hosted-at.model';
import { filterNullish } from 'src/app/shared/pipes/filter-nullish';
import { selectItSystemUsageGdpr } from 'src/app/store/it-system-usage/selectors';
import { RegularOptionTypeActions } from 'src/app/store/regular-option-type-store/actions';
import { selectRegularOptionTypes } from 'src/app/store/regular-option-type-store/selectors';
import { BusinessCritical, businessCriticalOptions, mapBusinessCritical } from '../../../../../shared/models/gdpr/business-critical.model';
import { APIGDPRWriteRequestDTO } from 'src/app/api/v2';
import { ValidatedValueChange } from 'src/app/shared/models/validated-value-change.model';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { ITSystemUsageActions } from 'src/app/store/it-system-usage/actions';

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
      purpose: new FormControl(''),
      businessCritical: new FormControl<BusinessCritical | undefined>(undefined),
      hostedAt: new FormControl<HostedAt | undefined>(undefined)
    },
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
    private readonly notificationService: NotificationService
    ) {
    super();
  }

  public ngOnInit(): void {
    this.store.dispatch(RegularOptionTypeActions.getOptions('it_system_usage-gdpr-person-data-type'))
    this.subscriptions.add(
      this.store
      .select(selectItSystemUsageGdpr)
      .pipe(filterNullish())
      .subscribe((gdpr) => {
        this.generalInformationForm.patchValue({
            purpose: gdpr.purpose,
            businessCritical: mapBusinessCritical(gdpr.businessCritical),
            hostedAt: mapHostedAt(gdpr.hostedAt)
        })
      })
    )
  }

  public patchGdpr(gdpr: APIGDPRWriteRequestDTO, valueChange?: ValidatedValueChange<unknown>) {
    if (valueChange && !valueChange.valid) {
        this.notificationService.showError($localize`"${valueChange.text}" er ugyldig`);
    } else {
      this.store.dispatch(ITSystemUsageActions.patchItSystemUsage({ gdpr }));
    }
  }
}
