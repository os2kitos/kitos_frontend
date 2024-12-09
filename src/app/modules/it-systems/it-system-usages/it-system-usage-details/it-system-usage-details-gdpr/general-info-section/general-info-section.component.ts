import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AbstractControl, FormControl, FormGroup } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Observable, map } from 'rxjs';
import { APIGDPRWriteRequestDTO } from 'src/app/api/v2';
import { BaseComponent } from 'src/app/shared/base/base.component';
import { HostedAt, hostedAtOptions, mapHostedAt } from 'src/app/shared/models/it-system-usage/gdpr/hosted-at.model';
import { ValidatedValueChange } from 'src/app/shared/models/validated-value-change.model';
import {
  YesNoDontKnowOptions,
  mapToYesNoDontKnowEnum,
  yesNoDontKnowOptions,
} from 'src/app/shared/models/yes-no-dont-know.model';
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
  @Input() disableLinkControl!: Observable<void>;
  @Output() noPermissions = new EventEmitter<AbstractControl[]>();

  public readonly businessCriticalOptions = yesNoDontKnowOptions;
  public readonly hostedAtOptions = hostedAtOptions;
  public readonly gdpr$ = this.store.select(selectItSystemUsageGdpr).pipe(filterNullish());
  public readonly selectDirectoryDocumentation$ = this.gdpr$.pipe(map((gdpr) => gdpr.directoryDocumentation));
  public readonly generalInformationForm = new FormGroup(
    {
      purpose: new FormControl(''),
      businessCritical: new FormControl<YesNoDontKnowOptions | undefined>(undefined),
      hostedAt: new FormControl<HostedAt | undefined>(undefined),
    },
    { updateOn: 'blur' }
  );
  public disableDirectoryDocumentationControl = false;

  constructor(private readonly store: Store, private readonly notificationService: NotificationService) {
    super();
  }

  public ngOnInit(): void {
    this.subscriptions.add(
      this.gdpr$.subscribe((gdpr) => {
        this.generalInformationForm.patchValue({
          purpose: gdpr.purpose,
          businessCritical: mapToYesNoDontKnowEnum(gdpr.businessCritical),
          hostedAt: mapHostedAt(gdpr.hostedAt),
        });
      })
    );

    this.noPermissions.emit([this.generalInformationForm]);
    this.disableLinkControl.subscribe(() => {
      this.disableDirectoryDocumentationControl = true;
    });
  }

  public patchGdpr(gdpr: APIGDPRWriteRequestDTO, valueChange?: ValidatedValueChange<unknown>) {
    if (valueChange && !valueChange.valid) {
      this.notificationService.showInvalidFormField(valueChange.text);
    } else {
      this.store.dispatch(ITSystemUsageActions.patchITSystemUsage({ gdpr }));
    }
  }

  public patchSimpleLink(simpleLink: { url: string; name: string }, valueChange?: ValidatedValueChange<unknown>) {
    this.patchGdpr({ directoryDocumentation: simpleLink }, valueChange);
  }

  public resetSimpleLink() {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    this.patchGdpr({ directoryDocumentation: null as any });
  }
}
