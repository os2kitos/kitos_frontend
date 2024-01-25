import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Store } from '@ngrx/store';
import { map } from 'rxjs';
import { APIGDPRWriteRequestDTO } from 'src/app/api/v2';
import { BaseComponent } from 'src/app/shared/base/base.component';
import {
  BusinessCritical,
  businessCriticalOptions,
  mapBusinessCritical,
} from 'src/app/shared/models/gdpr/business-critical.model';
import { HostedAt, hostedAtOptions, mapHostedAt } from 'src/app/shared/models/gdpr/hosted-at.model';
import { ValidatedValueChange } from 'src/app/shared/models/validated-value-change.model';
import { filterNullish } from 'src/app/shared/pipes/filter-nullish';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { ITSystemUsageActions } from 'src/app/store/it-system-usage/actions';
import { selectItSystemUsageGdpr } from 'src/app/store/it-system-usage/selectors';

@Component({
  selector: 'app-general-info-section',
  templateUrl: './general-info-section.component.html',
  styleUrls: ['./general-info-section.component.scss', '../it-system-usage-details-gdpr.component.scss'],
})
export class GeneralInfoSectionComponent extends BaseComponent implements OnInit {
  public readonly businessCriticalOptions = businessCriticalOptions;
  public readonly hostedAtOptions = hostedAtOptions;
  public readonly selectDirectoryDocumentation$ = this.store.select(selectItSystemUsageGdpr).pipe(
    filterNullish(),
    map((gdpr) => gdpr.directoryDocumentation)
  );
  public readonly generalInformationForm = new FormGroup(
    {
      purpose: new FormControl(''),
      businessCritical: new FormControl<BusinessCritical | undefined>(undefined),
      hostedAt: new FormControl<HostedAt | undefined>(undefined),
    },
    { updateOn: 'blur' }
  );

  constructor(private readonly store: Store, private readonly notificationService: NotificationService) {
    super();
  }

  public ngOnInit(): void {
    this.subscriptions.add(
      this.store
        .select(selectItSystemUsageGdpr)
        .pipe(filterNullish())
        .subscribe((gdpr) => {
          this.generalInformationForm.patchValue({
            purpose: gdpr.purpose,
            businessCritical: mapBusinessCritical(gdpr.businessCritical),
            hostedAt: mapHostedAt(gdpr.hostedAt),
          });
        })
    );
  }

  public patchGdpr(gdpr: APIGDPRWriteRequestDTO, valueChange?: ValidatedValueChange<unknown>) {
    if (valueChange && !valueChange.valid) {
      this.notificationService.showInvalidFormField(valueChange.text);
    } else {
      this.store.dispatch(ITSystemUsageActions.patchItSystemUsage({ gdpr }));
    }
  }

  public patchSimpleLink(simpleLink: { url: string; name: string }, valueChange?: ValidatedValueChange<unknown>) {
    this.patchGdpr({ directoryDocumentation: { name: simpleLink.name, url: simpleLink.url } }, valueChange);
  }
}
