import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Store } from '@ngrx/store';
import { BaseComponent } from 'src/app/shared/base/base.component';
import { BusinessCriticalSystem, businessCriticalSystemOptions } from '../../../../../shared/models/gdpr/business-critical-system.model';
import { HostedAt, hostedAtOptions } from 'src/app/shared/models/gdpr/hosted-at.model';
import { dataSensitivityLevelOptions } from 'src/app/shared/models/gdpr/data-sensitivity-level.model';
import { selectRegularOptionTypes } from 'src/app/store/regular-option-type-store/selectors';
import { filterNullish } from 'src/app/shared/pipes/filter-nullish';
import { RegularOptionTypeActions } from 'src/app/store/regular-option-type-store/actions';

interface DataSensitivityLevelControls { [key: string]: FormControl<boolean | null>; }

@Component({
  selector: 'app-it-system-usage-details-gdpr',
  templateUrl: './it-system-usage-details-gdpr.component.html',
  styleUrls: ['./it-system-usage-details-gdpr.component.scss']
})
export class ItSystemUsageDetailsGdprComponent extends BaseComponent implements OnInit {
  public readonly businessCriticalSystemOptions = businessCriticalSystemOptions;
  public readonly hostedAtOptions = hostedAtOptions;
  public readonly dataSensitivityLevelOptions = dataSensitivityLevelOptions;

  public readonly personDataTypes$ = this.store
  .select(selectRegularOptionTypes('it_system_usage-gdpr-person-data-type'))
  .pipe(filterNullish());

  public readonly generalInformationForm = new FormGroup(
    {
      systemOverallPurpose: new FormControl(''),
      businessCriticalSystem: new FormControl<BusinessCriticalSystem | undefined>(undefined),
      systemHosting: new FormControl<HostedAt | undefined>(undefined),
      linkToDocumentation: new FormControl('')
  },
  { updateOn: 'blur' }
  );

  public readonly dataSensitivityLevelForm;

  constructor(
    private readonly store: Store
  ) {
    super();
    const dataSensitivityLevelControls = this.getDataSensitivityLevelControls()
    this.dataSensitivityLevelForm = new FormGroup(
      dataSensitivityLevelControls,
    { updateOn: 'blur'}
    );
  }

  public ngOnInit(): void {
    this.store.dispatch(RegularOptionTypeActions.getOptions('it_system_usage-gdpr-person-data-type'))
  }

  private getDataSensitivityLevelControls(): DataSensitivityLevelControls{
    const dataSensitivityLevelControls: DataSensitivityLevelControls = {};
    dataSensitivityLevelOptions.forEach((level) => dataSensitivityLevelControls[level.value] = new FormControl<boolean>(false))
    return dataSensitivityLevelControls;
  }
}
