import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Store } from '@ngrx/store';
import { BaseComponent } from 'src/app/shared/base/base.component';
import { filterNullish } from 'src/app/shared/pipes/filter-nullish';
import { selectRegularOptionTypes } from 'src/app/store/regular-option-type-store/selectors';

@Component({
  selector: 'app-it-system-usage-details-gdpr',
  templateUrl: './it-system-usage-details-gdpr.component.html',
  styleUrls: ['./it-system-usage-details-gdpr.component.scss']
})
export class ItSystemUsageDetailsGdprComponent extends BaseComponent {
public readonly personDataTypes$ = this.store
  .select(selectRegularOptionTypes('it_system_usage-gdpr-person-data-type'))
  .pipe(filterNullish());

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
    ) {
    super();
  }
}
