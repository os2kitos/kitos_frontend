import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Store } from '@ngrx/store';
import { BaseComponent } from 'src/app/shared/base/base.component';
import { BusinessCriticalSystem, businessCriticalSystemOptions } from '../../../../../shared/models/business-critical-system.model';

@Component({
  selector: 'app-it-system-usage-details-gdpr',
  templateUrl: './it-system-usage-details-gdpr.component.html',
  styleUrls: ['./it-system-usage-details-gdpr.component.scss']
})
export class ItSystemUsageDetailsGdprComponent extends BaseComponent implements OnInit {
  public readonly businessCriticalSystemOptions = businessCriticalSystemOptions;
  public readonly generalInformationForm = new FormGroup(
    {
      systemOverallPurpose: new FormControl(''),
      businessCriticalSystem: new FormControl<BusinessCriticalSystem | undefined>(undefined),
      systemHosting: new FormControl(''),
      linkToDocumentation: new FormControl('')
  },
  { updateOn: 'blur' }
  );

  constructor(
    private readonly store: Store
  ) {
    super();
  }

  public ngOnInit(): void {
    console.log("running oninit")
  }
}
