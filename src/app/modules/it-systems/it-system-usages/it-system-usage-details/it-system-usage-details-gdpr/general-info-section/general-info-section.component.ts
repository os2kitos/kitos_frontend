import { AsyncPipe } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Observable, map } from 'rxjs';
import { APIGDPRWriteRequestDTO } from 'src/app/api/v2';
import { BaseComponent } from 'src/app/shared/base/base.component';
import { TooltipComponent } from 'src/app/shared/components/tooltip/tooltip.component';
import { SUPPLIER_DISABLED_MESSAGE } from 'src/app/shared/constants/constants';
import { itSystemUsageFields } from 'src/app/shared/models/field-permissions-blueprints.model';
import {
  GdprCriticality,
  gdprCriticalityOptions,
  mapGdprCriticality,
} from 'src/app/shared/models/it-system-usage/gdpr/gdpr-criticality.model';
import { HostedAt, hostedAtOptions, mapHostedAt } from 'src/app/shared/models/it-system-usage/gdpr/hosted-at.model';
import { SimpleLink } from 'src/app/shared/models/SimpleLink.model';
import { ValidatedValueChange } from 'src/app/shared/models/validated-value-change.model';
import { filterNullish } from 'src/app/shared/pipes/filter-nullish';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { ITSystemUsageActions } from 'src/app/store/it-system-usage/actions';
import { selectITSystemUsageFieldPermissions, selectItSystemUsageGdpr } from 'src/app/store/it-system-usage/selectors';
import {
  selectITSystemUsageEnableGdprCriticality,
  selectITSystemUsageEnableGdprDocumentation,
  selectITSystemUsageEnableGdprHostedAt,
  selectITSystemUsageEnableGdprPurpose
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
    TextBoxComponent,
    DropdownComponent,
    EditUrlSectionComponent,
    AsyncPipe,
    TooltipComponent,
  ],
})
export class GeneralInfoSectionComponent extends BaseComponent implements OnInit {
  @Input() disableLinkControl!: Observable<void>;
  @Output() noPermissions = new EventEmitter<AbstractControl[]>();

  public readonly supplierMessage = SUPPLIER_DISABLED_MESSAGE;

  public readonly hostedAtOptions = hostedAtOptions;
  public readonly gdpr$ = this.store.select(selectItSystemUsageGdpr).pipe(filterNullish());
  public readonly selectDirectoryDocumentation$ = this.gdpr$.pipe(
    map((gdpr) =>
      gdpr.directoryDocumentation
        ? ({ url: gdpr.directoryDocumentation.url, name: gdpr.directoryDocumentation.name } as SimpleLink)
        : undefined,
    ),
  );
  public readonly generalInformationForm = new FormGroup(
    {
      purpose: new FormControl(''),
      hostedAt: new FormControl<HostedAt | undefined>(undefined),
      gdprCriticality: new FormControl<GdprCriticality | undefined>(undefined),
    },
    { updateOn: 'blur' },
  );
  public disableDirectoryDocumentationControl = false;

  public readonly purposeEnabled$ = this.store.select(selectITSystemUsageEnableGdprPurpose);
  public readonly hostedAtEnabled$ = this.store.select(selectITSystemUsageEnableGdprHostedAt);
  public readonly documentationEnabled$ = this.store.select(selectITSystemUsageEnableGdprDocumentation);
  public readonly gdprCriticalityEnabled$ = this.store.select(selectITSystemUsageEnableGdprCriticality);
  public readonly gdprCriticalityOptions = gdprCriticalityOptions;

  public readonly gdprCriticalityModifyEnabled$ = this.store.select(
    selectITSystemUsageFieldPermissions(itSystemUsageFields.gdpr.criticality),
  );

  constructor(
    private readonly store: Store,
    private readonly notificationService: NotificationService,
  ) {
    super();
  }

  public ngOnInit(): void {
    this.subscriptions.add(
      this.gdpr$.subscribe((gdpr) => {
        this.generalInformationForm.patchValue({
          purpose: gdpr.purpose,
          hostedAt: mapHostedAt(gdpr.hostedAt ?? undefined),
          gdprCriticality: mapGdprCriticality(gdpr.gdprCriticality ?? undefined),
        });
      }),
    );

    this.noPermissions.emit([this.generalInformationForm]);
    this.disableLinkControl.subscribe(() => {
      this.disableDirectoryDocumentationControl = true;
    });

    this.subscriptions.add(
      this.gdprCriticalityModifyEnabled$.subscribe((enabled) => {
        const control = this.generalInformationForm.controls.gdprCriticality;
        if (enabled) {
          control.enable();
        } else {
          control.disable();
        }
      }),
    );
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
