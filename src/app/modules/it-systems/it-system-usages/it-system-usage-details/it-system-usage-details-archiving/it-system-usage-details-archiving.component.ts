import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Store } from '@ngrx/store';
import { filter, map } from 'rxjs';
import { APIArchivingUpdateRequestDTO, APIIdentityNamePairResponseDTO } from 'src/app/api/v2';
import { BaseComponent } from 'src/app/shared/base/base.component';
import { RadioButtonOption } from 'src/app/shared/components/radio-buttons/radio-buttons.component';
import {
  ArchiveDutyChoice,
  archiveDutyChoiceOptions,
  mapArchiveDutyChoice,
} from 'src/app/shared/models/it-system/it-system-usage/archive-duty-choice.model';
import { TreeNodeModel } from 'src/app/shared/models/tree-node.model';
import { ValidatedValueChange } from 'src/app/shared/models/validated-value-change.model';
import { filterNullish } from 'src/app/shared/pipes/filter-nullish';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { ITSystemUsageActions } from 'src/app/store/it-system-usage/actions';
import {
  selectITSystemUsageHasModifyPermission,
  selectItSystemUsageArchiving,
} from 'src/app/store/it-system-usage/selectors';
import { selectItSystemRecomendedArchiveDutyComment } from 'src/app/store/it-system/selectors';
import { RegularOptionTypeActions } from 'src/app/store/regular-option-type-store/actions';
import { selectRegularOptionTypes } from 'src/app/store/regular-option-type-store/selectors';
import { ItSystemUsageDetailsArchivingComponentStore } from './it-system-usage-details-archiving.component-store';

@Component({
  selector: 'app-it-system-usage-details-archiving',
  templateUrl: './it-system-usage-details-archiving.component.html',
  styleUrls: ['./it-system-usage-details-archiving.component.scss'],
  providers: [ItSystemUsageDetailsArchivingComponentStore],
})
export class ItSystemUsageDetailsArchivingComponent extends BaseComponent implements OnInit {
  public readonly archiveForm = new FormGroup(
    {
      archiveDuty: new FormControl<ArchiveDutyChoice | undefined>(undefined),
      type: new FormControl<APIIdentityNamePairResponseDTO | undefined>(undefined),
      location: new FormControl<APIIdentityNamePairResponseDTO | undefined>(undefined),
      supplier: new FormControl<APIIdentityNamePairResponseDTO | undefined>(undefined),
      active: new FormControl<boolean | undefined>(undefined),
      testLocation: new FormControl<APIIdentityNamePairResponseDTO | undefined>(undefined),
      notes: new FormControl<string | undefined>(undefined),
      frequencyInMonths: new FormControl<number | undefined>(undefined),
      documentBearing: new FormControl<boolean | undefined>(undefined),
    },
    { updateOn: 'blur' }
  );

  public readonly archiving$ = this.store.select(selectItSystemUsageArchiving);
  public readonly journalPeriods$ = this.archiving$.pipe(map((archive) => archive?.journalPeriods));
  public readonly recommendedArchiveDutyComment$ = this.store.select(selectItSystemRecomendedArchiveDutyComment);
  public readonly supplierOrganizations$ = this.componentStore.supplierOrganizations$;

  public readonly archiveTypes$ = this.store
    .select(selectRegularOptionTypes('it-system_usage-archive-type'))
    .pipe(filterNullish());
  public readonly archiveLocationTypes$ = this.store
    .select(selectRegularOptionTypes('it-system_usage-archive-location-type'))
    .pipe(filterNullish());
  public readonly archiveLocationTestTypes$ = this.store
    .select(selectRegularOptionTypes('it-system_usage-archive-location-test-type'))
    .pipe(filterNullish());

  public readonly archiveDutyChoice = archiveDutyChoiceOptions;

  public readonly activeOptions: Array<RadioButtonOption<boolean>> = [
    { id: true, label: 'Ja' },
    { id: false, label: 'Nej' },
  ];

  constructor(
    private store: Store,
    private notificationService: NotificationService,
    private componentStore: ItSystemUsageDetailsArchivingComponentStore
  ) {
    super();
  }

  ngOnInit() {
    this.store.dispatch(RegularOptionTypeActions.getOptions('it-system_usage-archive-type'));
    this.store.dispatch(RegularOptionTypeActions.getOptions('it-system_usage-archive-location-type'));
    this.store.dispatch(RegularOptionTypeActions.getOptions('it-system_usage-archive-location-test-type'));

    this.subscriptions.add(
      this.store
        .select(selectITSystemUsageHasModifyPermission)
        .pipe(filter((hasModifyPermission) => hasModifyPermission == false))
        .subscribe(() => {
          this.archiveForm.disable();
        })
    );

    this.subscriptions.add(
      this.store
        .select(selectItSystemUsageArchiving)
        .pipe(filterNullish())
        .subscribe((archive) =>
          this.archiveForm.patchValue({
            archiveDuty: mapArchiveDutyChoice(archive.archiveDuty),
            type: archive.type,
            location: archive.location,
            supplier: archive.supplier,
            active: archive.active,
            testLocation: archive.testLocation,
            notes: archive.notes,
            frequencyInMonths: archive.frequencyInMonths,
            documentBearing: archive.documentBearing,
          })
        )
    );

    this.componentStore.getOrganizations(undefined);
  }

  public supplierFilterChange(search?: string) {
    this.componentStore.getOrganizations(search);
  }

  public patchArchiving(archiving: APIArchivingUpdateRequestDTO, valueChange?: ValidatedValueChange<unknown>) {
    if (valueChange && !valueChange.valid) {
      this.notificationService.showError($localize`"${valueChange.text}" er ugyldig`);
    } else {
      this.store.dispatch(ITSystemUsageActions.patchItSystemUsage({ archiving }));
    }
  }

  public patchActiveValue(activeValue: boolean | undefined, valueChange?: ValidatedValueChange<unknown>) {
    this.patchArchiving({ active: activeValue }, valueChange);
  }

  public patchSupplier(supplier: TreeNodeModel | undefined) {
    this.patchArchiving({ supplierOrganizationUuid: supplier?.id });
  }
}
