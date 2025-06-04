import { AsyncPipe, NgIf } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Observable, map } from 'rxjs';
import { APIGDPRWriteRequestDTO } from 'src/app/api/v2';
import { BaseComponent } from 'src/app/shared/base/base.component';
import { HostedAt, hostedAtOptions, mapHostedAt } from 'src/app/shared/models/it-system-usage/gdpr/hosted-at.model';
import { ValidatedValueChange } from 'src/app/shared/models/validated-value-change.model';
import {
  YesNoDontKnowOption,
  mapToYesNoDontKnowEnum,
  yesNoDontKnowOptions,
} from 'src/app/shared/models/yes-no-dont-know.model';
import { filterNullish } from 'src/app/shared/pipes/filter-nullish';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { ITSystemUsageActions } from 'src/app/store/it-system-usage/actions';
import { selectItSystemUsageGdpr } from 'src/app/store/it-system-usage/selectors';
import {
  selectITSystemUsageEnableGdprBusinessCritical,
  selectITSystemUsageEnableGdprDocumentation,
  selectITSystemUsageEnableGdprHostedAt,
  selectITSystemUsageEnableGdprPurpose,
} from 'src/app/store/organization/ui-module-customization/selectors';
import { CardHeaderComponent } from '../../../../../../shared/components/card-header/card-header.component';
import { CardComponent } from '../../../../../../shared/components/card/card.component';
import { DropdownComponent } from '../../../../../../shared/components/dropdowns/dropdown/dropdown.component';
import { FormGridComponent } from '../../../../../../shared/components/form-grid/form-grid.component';
import { TextBoxComponent } from '../../../../../../shared/components/textbox/textbox.component';
import { EditUrlSectionComponent } from '../edit-url-section/edit-url-section.component';

@Component({
  selector: 'app-general-info-section',
  templateUrl: './general-info-section.component.html',
  styleUrls: ['./general-info-section.component.scss', '../it-system-usage-details-gdpr.component.scss'],
  imports: [
    CardComponent,
    CardHeaderComponent,
    FormGridComponent,
    FormsModule,
    ReactiveFormsModule,
    NgIf,
    TextBoxComponent,
    DropdownComponent,
    EditUrlSectionComponent,
    AsyncPipe,
  ],
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
      businessCritical: new FormControl<YesNoDontKnowOption | undefined>(undefined),
      hostedAt: new FormControl<HostedAt | undefined>(undefined),
    },
    { updateOn: 'blur' }
  );
  public disableDirectoryDocumentationControl = false;

  public readonly purposeEnabled$ = this.store.select(selectITSystemUsageEnableGdprPurpose);
  public readonly businessCriticalEnabled$ = this.store.select(selectITSystemUsageEnableGdprBusinessCritical);
  public readonly hostedAtEnabled$ = this.store.select(selectITSystemUsageEnableGdprHostedAt);
  public readonly documentationEnabled$ = this.store.select(selectITSystemUsageEnableGdprDocumentation);

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
