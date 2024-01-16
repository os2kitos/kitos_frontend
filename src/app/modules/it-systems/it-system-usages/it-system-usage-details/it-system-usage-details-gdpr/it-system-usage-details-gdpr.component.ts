import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Store } from '@ngrx/store';
import { BaseComponent } from 'src/app/shared/base/base.component';

@Component({
  selector: 'app-it-system-usage-details-gdpr',
  templateUrl: './it-system-usage-details-gdpr.component.html',
  styleUrls: ['./it-system-usage-details-gdpr.component.scss']
})
export class ItSystemUsageDetailsGdprComponent extends BaseComponent implements OnInit {
  public readonly generalInformationForm = new FormGroup(
    {
    systemOverallPurpose: new FormControl(''),
    businessCriticalSystem: new FormControl('') //todo make enum for the options here
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
