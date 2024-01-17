import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Store } from '@ngrx/store';
import { BaseComponent } from 'src/app/shared/base/base.component';
import { BusinessCriticalSystem, businessCriticalSystemOptions } from '../../../../../shared/models/gdpr/business-critical-system.model';
import { HostedAt, hostedAtOptions } from 'src/app/shared/models/gdpr/hosted-at.model';
import { dataSensitivityLevelOptions } from 'src/app/shared/models/gdpr/data-sensitivity-level.model';

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
    const dataSensitivityLevelControls: DataSensitivityLevelControls = {};
    dataSensitivityLevelOptions.forEach((level) => dataSensitivityLevelControls[level.value] = new FormControl<boolean>(false))
    this.dataSensitivityLevelForm = new FormGroup(
      dataSensitivityLevelControls,
    { updateOn: 'blur'}
    );
  }

  public ngOnInit(): void {
    console.log("running oninit")
  }
}
