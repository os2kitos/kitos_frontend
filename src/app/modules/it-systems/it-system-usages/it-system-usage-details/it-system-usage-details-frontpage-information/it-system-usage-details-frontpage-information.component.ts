import { AsyncPipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { BehaviorSubject, filter, map } from 'rxjs';
import {
  APIGeneralDataResponseDTO,
  APIGeneralDataUpdateRequestDTO,
  APIIdentityNamePairResponseDTO,
  APILicensingAndCodeModelChoice,
  APIRegularOptionResponseDTO,
} from 'src/app/api/v2';
import { BaseComponent } from 'src/app/shared/base/base.component';
import { TooltipComponent } from 'src/app/shared/components/tooltip/tooltip.component';
import { SUPPLIER_DISABLED_MESSAGE } from 'src/app/shared/constants/constants';
import { optionalNewDate } from 'src/app/shared/helpers/date.helpers';
import {
  dateGreaterThanOrEqualControlValidator,
  dateLessThanControlValidator,
} from 'src/app/shared/helpers/form.helpers';
import { combineOR } from 'src/app/shared/helpers/observable-helpers';
import { toBulletPoints } from 'src/app/shared/helpers/string.helpers';
import {
  MultiSelectDropdownItem,
  mapRegularOptionToMultiSelectItem,
} from 'src/app/shared/models/dropdown-option.model';
import { itSystemUsageFields } from 'src/app/shared/models/field-permissions-blueprints.model';
import { HostedAt, hostedAtOptions, mapHostedAt } from 'src/app/shared/models/it-system-usage/gdpr/hosted-at.model';
import {
  LicensingAndCodeModel,
  licensingAndCodeModelOptions,
  mapLicensingAndCodeModels,
} from 'src/app/shared/models/it-system/licensing-and-code-model.model';
import {
  LifeCycleStatus,
  lifeCycleStatusOptions,
  mapLifeCycleStatus,
} from 'src/app/shared/models/life-cycle-status.model';
import {
  NumberOfExpectedUsers,
  mapNumberOfExpectedUsers,
  numberOfExpectedUsersOptions,
} from 'src/app/shared/models/number-of-expected-users.model';
import { SimpleLink } from 'src/app/shared/models/SimpleLink.model';
import { ValidatedValueChange } from 'src/app/shared/models/validated-value-change.model';
import {
  YesNoDontKnowOption,
  mapToYesNoDontKnowEnum,
  yesNoDontKnowOptions,
} from 'src/app/shared/models/yes-no-dont-know.model';
import {
  YesNoPartiallyOption,
  mapToYesNoPartiallyEnum,
  yesNoPartiallyOptions,
} from 'src/app/shared/models/yes-no-partially.model';
import { mapToYesNoEnum, yesNoOptions } from 'src/app/shared/models/yes-no.model';
import { filterNullish } from 'src/app/shared/pipes/filter-nullish';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { ITSystemUsageActions } from 'src/app/store/it-system-usage/actions';
import {
  selectITSystemUsageFieldPermissions,
  selectITSystemUsageHasModifyPermission,
  selectItSystemUsage,
  selectItSystemUsageGeneral,
  selectItSystemUsageValid,
} from 'src/app/store/it-system-usage/selectors';
import {
  selectITSystemUsageEnableAmountOfUsers,
  selectITSystemUsageEnableContainsAITechnology,
  selectITSystemUsageEnableCriticalityFieldsLastChanged,
  selectITSystemUsageEnableCriticalityLevelDocumentation,
  selectITSystemUsageEnableDataClassification,
  selectITSystemUsageEnableDescription,
  selectITSystemUsageEnableFrontPageUsagePeriod,
  selectITSystemUsageEnableGeneralHostedAt,
  selectITSystemUsageEnableGeneralPurpose,
  selectITSystemUsageEnableIsBusinessCritical,
  selectITSystemUsageEnableIsSociallyCritical,
  selectITSystemUsageEnableLastEditedAt,
  selectITSystemUsageEnableLastEditedBy,
  selectITSystemUsageEnableLicensingAndCodeModels,
  selectITSystemUsageEnableLifeCycleStatus,
  selectITSystemUsageEnableName,
  selectITSystemUsageEnableStatus,
  selectITSystemUsageEnableSystemUsageCriticalityLevel,
  selectITSystemUsageEnableTakenIntoUsageBy,
  selectITSystemUsageEnableTechnicalSystemType,
  selectITSystemUsageEnableVersion,
  selectITSystemUsageEnableWebAccessibility,
  selectITSystemUsageEnabledSystemId,
} from 'src/app/store/organization/ui-module-customization/selectors';
import { RegularOptionTypeActions } from 'src/app/store/regular-option-type-store/actions';
import { selectRegularOptionTypes } from 'src/app/store/regular-option-type-store/selectors';
import { CardHeaderComponent } from '../../../../../shared/components/card-header/card-header.component';
import { CardComponent } from '../../../../../shared/components/card/card.component';
import { DatePickerComponent } from '../../../../../shared/components/datepicker/datepicker.component';
import { DropdownComponent } from '../../../../../shared/components/dropdowns/dropdown/dropdown.component';
import { MultiSelectDropdownComponent } from '../../../../../shared/components/dropdowns/multi-select-dropdown/multi-select-dropdown.component';
import { StatusChipComponent } from '../../../../../shared/components/status-chip/status-chip.component';
import { TextAreaComponent } from '../../../../../shared/components/textarea/textarea.component';
import { TextBoxComponent } from '../../../../../shared/components/textbox/textbox.component';
import { EditUrlSectionComponent } from '../edit-url-section/edit-url-section.component';

@Component({
  selector: 'app-it-system-usage-details-frontpage-information',
  templateUrl: 'it-system-usage-details-frontpage-information.component.html',
  styleUrls: ['it-system-usage-details-frontpage-information.component.scss'],
  imports: [
    CardComponent,
    CardHeaderComponent,
    StatusChipComponent,
    FormsModule,
    ReactiveFormsModule,
    TextBoxComponent,
    DropdownComponent,
    MultiSelectDropdownComponent,
    TextAreaComponent,
    DatePickerComponent,
    AsyncPipe,
    TooltipComponent,
    EditUrlSectionComponent,
  ],
})
export class ITSystemUsageDetailsFrontpageInformationComponent extends BaseComponent implements OnInit {
  public readonly itSystemInformationForm = new FormGroup(
    {
      purpose: new FormControl(''),
      localCallName: new FormControl(''),
      localSystemId: new FormControl(''),
      systemVersion: new FormControl(''),
      technicalSystemTypes: new FormControl<MultiSelectDropdownItem<APIRegularOptionResponseDTO>[] | undefined>(
        undefined,
      ),
      numberOfExpectedUsers: new FormControl<NumberOfExpectedUsers | undefined>(undefined),
      dataClassification: new FormControl<APIIdentityNamePairResponseDTO | undefined>(undefined),
      notes: new FormControl<string | undefined>(undefined),
      aiTechnology: new FormControl<YesNoDontKnowOption | undefined>(undefined),
      hostedAt: new FormControl<HostedAt | undefined>(undefined),
      licensingAndCodeModels: new FormControl<MultiSelectDropdownItem<LicensingAndCodeModel>[] | undefined>(undefined),
    },
    { updateOn: 'blur' },
  );

  public readonly itSystemCriticalityForm = new FormGroup(
    {
      isSociallyCritical: new FormControl<YesNoDontKnowOption | undefined>(undefined),
      isBusinessCritical: new FormControl<YesNoDontKnowOption | undefined>(undefined),
      criticalityFieldsLastChanged: new FormControl<Date | undefined>(undefined),
      systemUsageCriticalityLevel: new FormControl<APIIdentityNamePairResponseDTO | undefined>(undefined),
    },
    { updateOn: 'blur' },
  );

  public readonly supplierMessage = SUPPLIER_DISABLED_MESSAGE;

  public readonly aiTechnologyOptions = yesNoOptions;
  public readonly isSociallyCriticalOptions = yesNoDontKnowOptions;
  public readonly isBusinessCriticalOptions = yesNoDontKnowOptions;
  public readonly nameEnabled$ = this.store.select(selectITSystemUsageEnableName);
  public readonly systemIdEnabled$ = this.store.select(selectITSystemUsageEnabledSystemId);
  public readonly versionEnabled$ = this.store.select(selectITSystemUsageEnableVersion);
  public readonly technicalSystemTypeEnabled$ = this.store.select(selectITSystemUsageEnableTechnicalSystemType);
  public readonly purposeEnabled$ = this.store.select(selectITSystemUsageEnableGeneralPurpose);
  public readonly hostedAtEnabled$ = this.store.select(selectITSystemUsageEnableGeneralHostedAt);
  public readonly amountOfUsersEnabled$ = this.store.select(selectITSystemUsageEnableAmountOfUsers);
  public readonly dataClassificationEnabled$ = this.store.select(selectITSystemUsageEnableDataClassification);
  public readonly descriptionEnabled$ = this.store.select(selectITSystemUsageEnableDescription);
  public readonly takenIntoUsageByEnabled$ = this.store.select(selectITSystemUsageEnableTakenIntoUsageBy);
  public readonly lastEditedByEnabled$ = this.store.select(selectITSystemUsageEnableLastEditedBy);
  public readonly lastEditedAtEnabled$ = this.store.select(selectITSystemUsageEnableLastEditedAt);
  public readonly lifeCycleStatusEnabled$ = this.store.select(selectITSystemUsageEnableLifeCycleStatus);
  public readonly usagePeriodEnabled$ = this.store.select(selectITSystemUsageEnableFrontPageUsagePeriod);
  public readonly statusEnabled$ = this.store.select(selectITSystemUsageEnableStatus);
  public readonly containsAITechnologyEnabled$ = this.store.select(selectITSystemUsageEnableContainsAITechnology);
  public readonly webAccessiblityEnabled$ = this.store.select(selectITSystemUsageEnableWebAccessibility);
  public readonly isSociallyCriticalEnabled$ = this.store.select(selectITSystemUsageEnableIsSociallyCritical);
  public readonly isBusinessCriticalEnabled$ = this.store.select(selectITSystemUsageEnableIsBusinessCritical);
  public readonly licensingAndCodeModelsEnabled$ = this.store.select(selectITSystemUsageEnableLicensingAndCodeModels);
  public readonly criticalityFieldsLastChangedEnabled$ = this.store.select(
    selectITSystemUsageEnableCriticalityFieldsLastChanged,
  );
  public readonly criticalityLevelDocumentationEnabled$ = this.store.select(
    selectITSystemUsageEnableCriticalityLevelDocumentation,
  );
  public readonly containsAITechnologyModifyEnabled$ = this.store.select(
    selectITSystemUsageFieldPermissions(itSystemUsageFields.containsAITechnology),
  );

  public readonly showSystemUsageCard$ = combineOR([
    this.takenIntoUsageByEnabled$,
    this.lastEditedByEnabled$,
    this.lastEditedAtEnabled$,
    this.lifeCycleStatusEnabled$,
    this.usagePeriodEnabled$,
    this.statusEnabled$,
  ]);

  public readonly systemUsageCriticalityEnabled$ = this.store.select(
    selectITSystemUsageEnableSystemUsageCriticalityLevel,
  );

  public readonly systemUsageCriticalityModifyEnabled$ = this.store.select(
    selectITSystemUsageFieldPermissions(itSystemUsageFields.systemUsageCriticalityLevel),
  );

  public readonly showSystemCriticalityCard$ = combineOR([
    this.isSociallyCriticalEnabled$,
    this.isBusinessCriticalEnabled$,
    this.criticalityFieldsLastChangedEnabled$,
    this.systemUsageCriticalityEnabled$,
    this.criticalityLevelDocumentationEnabled$,
  ]);

  public disableCriticalityLevelDocumentationControl = false;

  public selectCriticalityLevelDocumentation$ = this.store.select(selectItSystemUsageGeneral).pipe(
    map((general) =>
      general?.criticalityLevelDocumentation
        ? ({
            url: general.criticalityLevelDocumentation.url,
            name: general.criticalityLevelDocumentation.name,
          } as SimpleLink)
        : undefined,
    ),
  );

  public readonly itSystemApplicationForm = new FormGroup(
    {
      createdBy: new FormControl({ value: '', disabled: true }),
      lastModifiedBy: new FormControl({ value: '', disabled: true }),
      lastModified: new FormControl<Date | undefined>({ value: undefined, disabled: true }),
      lifeCycleStatus: new FormControl<LifeCycleStatus | undefined>(undefined),
      validFrom: new FormControl<Date | undefined>(undefined),
      validTo: new FormControl<Date | undefined>(undefined),
      valid: new FormControl({ value: '', disabled: true }),
    },
    { updateOn: 'blur' },
  );

  public readonly webAccessibilityForm = new FormGroup({
    webAccessibilityCompliance: new FormControl<YesNoPartiallyOption | undefined>(undefined),
    lastWebAccessibilityCheck: new FormControl<Date | undefined>(undefined),
    webAccessibilityNotes: new FormControl(''),
  });

  public readonly numberOfExpectedUsersOptions = numberOfExpectedUsersOptions;
  public readonly lifeCycleStatusOptions = lifeCycleStatusOptions;
  public readonly yesNoPartiallyOptions = yesNoPartiallyOptions;
  public readonly hostedAtOptions = hostedAtOptions;

  public readonly itSystemUsageValid$ = this.store.select(selectItSystemUsageValid);
  public readonly systemUsageCriticalityLevelTypes$ = this.store
    .select(selectRegularOptionTypes('it-system-usage_system-usage-criticality-level'))
    .pipe(filterNullish());

  public readonly technicalSystemTypeDropdownOptions$ = new BehaviorSubject<
    MultiSelectDropdownItem<APIRegularOptionResponseDTO>[]
  >([]);
  public initialSelectedTechnicalSystemTypes: MultiSelectDropdownItem<APIRegularOptionResponseDTO>[] = [];

  public readonly licensingAndCodeModelDropdownOptions$ = new BehaviorSubject<
    MultiSelectDropdownItem<LicensingAndCodeModel>[]
  >(this.getDefaultLicensingAndCodeModelDropdownOptions());
  public initialSelectedLicensingAndCodeModels: MultiSelectDropdownItem<LicensingAndCodeModel>[] = [];
  public readonly licensingAndCodeModelOptions = licensingAndCodeModelOptions;

  public readonly hasModifyPermission$ = this.store.select(selectITSystemUsageHasModifyPermission);

  public readonly dataClassificationTypes$ = this.store
    .select(selectRegularOptionTypes('it-system_usage-data-classification-type'))
    .pipe(filterNullish());
  public readonly invalidReason$ = this.store.select(selectItSystemUsageGeneral).pipe(
    map((general) => {
      if (general?.validity.valid) return undefined;

      const reasonsForInactivity = [
        general?.validity.validAccordingToLifeCycle ? undefined : $localize`Livscyklus`,
        general?.validity.validAccordingToMainContract ? undefined : $localize`Den markerede kontrakt`,
        general?.validity.validAccordingToValidityPeriod ? undefined : $localize`Ibrugtagningsperiode`,
      ];

      return $localize`Følgende gør systemet 'ikke aktivt': ` + '\n' + toBulletPoints(reasonsForInactivity);
    }),
  );

  constructor(
    private store: Store,
    private notificationService: NotificationService,
  ) {
    super();
  }

  ngOnInit() {
    this.addDateValidators();
    this.itSystemCriticalityForm.controls.criticalityFieldsLastChanged.disable();

    this.store.dispatch(RegularOptionTypeActions.getOptions('it-system_usage-data-classification-type'));
    this.store.dispatch(RegularOptionTypeActions.getOptions('it-system-usage_system-usage-criticality-level'));
    this.store.dispatch(RegularOptionTypeActions.getOptions('it-system-usage_technical-system-type'));

    this.subscriptions.add(
      this.store
        .select(selectRegularOptionTypes('it-system-usage_technical-system-type'))
        .pipe(filterNullish())
        .subscribe((options) => {
          const dropdownItems: MultiSelectDropdownItem<APIRegularOptionResponseDTO>[] = options.map((option) =>
            mapRegularOptionToMultiSelectItem(option),
          );
          this.technicalSystemTypeDropdownOptions$.next(dropdownItems);
        }),
    );

    this.disableFormsIfNoModifyPermission();
    this.setupFormValueChangeSubscriptions();
  }

  private disableFormsIfNoModifyPermission() {
    this.subscriptions.add(
      this.store
        .select(selectITSystemUsageHasModifyPermission)
        .pipe(filter((hasModifyPermission) => hasModifyPermission === false))
        .subscribe(() => {
          this.itSystemInformationForm.disable();
          this.itSystemApplicationForm.disable();
          this.webAccessibilityForm.disable();
        }),
    );

    this.subscriptions.add(
      this.webAccessibilityForm.controls.webAccessibilityCompliance.valueChanges.subscribe((value) => {
        const hasValue = !!value;
        if (hasValue && !this.webAccessibilityForm.disabled) {
          this.webAccessibilityForm.controls.lastWebAccessibilityCheck.enable();
          this.webAccessibilityForm.controls.webAccessibilityNotes.enable();
        } else {
          this.webAccessibilityForm.controls.lastWebAccessibilityCheck.disable();
          this.webAccessibilityForm.controls.webAccessibilityNotes.disable();
        }
      }),
    );

    this.subscriptions.add(
      this.containsAITechnologyModifyEnabled$.subscribe((isModifyEnabled) => {
        const control = this.itSystemInformationForm.controls.aiTechnology;
        if (isModifyEnabled) {
          control.enable();
        } else {
          control.disable();
        }
      }),
    );

    this.subscriptions.add(
      this.systemUsageCriticalityModifyEnabled$.subscribe((enabled) => {
        const control = this.itSystemCriticalityForm.controls.systemUsageCriticalityLevel;
        if (enabled) {
          control.enable();
        } else {
          control.disable();
        }
      }),
    );
  }

  private setupFormValueChangeSubscriptions() {
    this.subscriptions.add(
      this.store
        .select(selectItSystemUsageGeneral)
        .pipe(filterNullish())
        .subscribe((general) => {
          const technicalSystemTypeItems = this.mapTechnicalSystemTypeDropdownItems(general.technicalSystemTypes ?? []);
          const licensingAndCodeModelItems = this.mapLicensingAndCodeModelDropdownItems(
            general.licensingAndCodeModels ?? [],
          );

          this.itSystemInformationForm.patchValue({
            purpose: general.purpose,
            localCallName: general.localCallName,
            localSystemId: general.localSystemId,
            systemVersion: general.systemVersion,
            technicalSystemTypes: technicalSystemTypeItems,
            numberOfExpectedUsers: mapNumberOfExpectedUsers(general.numberOfExpectedUsers ?? undefined),
            dataClassification: general.dataClassification,
            notes: general.notes,
            aiTechnology: mapToYesNoEnum(general.containsAITechnology),
            hostedAt: mapHostedAt(general.hostedAt ?? undefined),
            licensingAndCodeModels: licensingAndCodeModelItems,
          });

          this.setupTechnicalSystemTypesControl(technicalSystemTypeItems);
          this.setupLicensingAndCodeModelsControl(licensingAndCodeModelItems);

          this.itSystemCriticalityForm.patchValue({
            isSociallyCritical: mapToYesNoDontKnowEnum(general.isSociallyCritical),
            isBusinessCritical: mapToYesNoDontKnowEnum(general.isBusinessCritical),
            systemUsageCriticalityLevel: general.systemUsageCriticalityLevel,
          });

          this.setFormCriticalityFieldsLastChanged(general);

          this.webAccessibilityForm.patchValue({
            webAccessibilityCompliance: mapToYesNoPartiallyEnum(general.webAccessibilityCompliance ?? undefined),
            lastWebAccessibilityCheck: optionalNewDate(general.lastWebAccessibilityCheck ?? undefined),
            webAccessibilityNotes: general.webAccessibilityNotes,
          });
        }),
    );

    // Set initial state of application form
    this.subscriptions.add(
      this.store
        .select(selectItSystemUsage)
        .pipe(filterNullish())
        .subscribe((itSystemUsage) =>
          this.itSystemApplicationForm.patchValue({
            createdBy: itSystemUsage.createdBy?.name,
            lastModifiedBy: itSystemUsage.lastModifiedBy?.name,
            lastModified: new Date(itSystemUsage.lastModified),
            lifeCycleStatus: mapLifeCycleStatus(itSystemUsage.general.validity.lifeCycleStatus ?? undefined),
            validFrom: optionalNewDate(itSystemUsage.general.validity.validFrom ?? undefined),
            validTo: optionalNewDate(itSystemUsage.general.validity.validTo ?? undefined),
            valid: itSystemUsage.general.validity.valid
              ? $localize`Systemet er aktivt`
              : $localize`Systemet er ikke aktivt`,
          }),
        ),
    );
  }

  private noLicensingAndCodeModelSelected(): boolean {
    return this.initialSelectedLicensingAndCodeModels.length === 0;
  }

  private proprietaryLicensingAndCodeModelIsSelected(): boolean {
    return this.initialSelectedLicensingAndCodeModels.some(
      (option) => option.value.value === APILicensingAndCodeModelChoice.Proprietary,
    );
  }

  private anyNonProprietaryLicensingAndCodeModelIsSelected(): boolean {
    return this.initialSelectedLicensingAndCodeModels.some(
      (option) => option.value.value !== APILicensingAndCodeModelChoice.Proprietary,
    );
  }

  private setupLicensingAndCodeModelsControl(
    licensingAndCodeModelDropdownItems: MultiSelectDropdownItem<LicensingAndCodeModel>[],
  ) {
    this.initialSelectedLicensingAndCodeModels = licensingAndCodeModelDropdownItems;

    let newOptions: MultiSelectDropdownItem<LicensingAndCodeModel>[];

    if (this.noLicensingAndCodeModelSelected()) {
      newOptions = this.getDefaultLicensingAndCodeModelDropdownOptions();
    } else if (this.proprietaryLicensingAndCodeModelIsSelected()) {
      newOptions = this.enableAppropriateLicensingAndCodeModels(true);
    } else if (this.anyNonProprietaryLicensingAndCodeModelIsSelected()) {
      newOptions = this.enableAppropriateLicensingAndCodeModels(false);
    } else {
      newOptions = [...this.licensingAndCodeModelDropdownOptions$.value];
    }

    this.licensingAndCodeModelDropdownOptions$.next(newOptions);
  }

  private enableAppropriateLicensingAndCodeModels(
    enableProprietary: boolean,
  ): MultiSelectDropdownItem<LicensingAndCodeModel>[] {
    return this.licensingAndCodeModelDropdownOptions$.value.map((option) => {
      const isProprietary = option.value.value === APILicensingAndCodeModelChoice.Proprietary;
      const shouldBeEnabled = enableProprietary ? isProprietary : !isProprietary;
      return { ...option, disabled: !shouldBeEnabled };
    });
  }

  private mapLicensingAndCodeModelDropdownItems(apiModels: APILicensingAndCodeModelChoice[]) {
    const frontendModels = mapLicensingAndCodeModels(apiModels);
    return frontendModels.map((option) => ({
      name: option.name,
      value: option,
      selected: false,
    }));
  }

  private getDefaultLicensingAndCodeModelDropdownOptions(): MultiSelectDropdownItem<LicensingAndCodeModel>[] {
    return licensingAndCodeModelOptions.map(
      (option) =>
        ({
          name: option.name,
          value: option,
          selected: false,
        }) as MultiSelectDropdownItem<LicensingAndCodeModel>,
    );
  }

  private addDateValidators() {
    this.itSystemApplicationForm.controls.validFrom.validator = dateLessThanControlValidator(
      this.itSystemApplicationForm.controls.validTo,
    );
    this.itSystemApplicationForm.controls.validTo.validator = dateGreaterThanOrEqualControlValidator(
      this.itSystemApplicationForm.controls.validFrom,
    );
  }

  private setFormCriticalityFieldsLastChanged(general: APIGeneralDataResponseDTO) {
    if (general.criticalityFieldsLastChanged) {
      this.itSystemCriticalityForm.controls.criticalityFieldsLastChanged.setValue(
        new Date(general.criticalityFieldsLastChanged),
      );
    }
  }

  public patchGeneral(general: APIGeneralDataUpdateRequestDTO, valueChange?: ValidatedValueChange<unknown>) {
    if (valueChange && !valueChange.valid) {
      this.notificationService.showError($localize`"${valueChange.text}" er ugyldig`);
    } else {
      this.store.dispatch(ITSystemUsageActions.patchITSystemUsage({ general }));
    }
  }

  public patchCriticalityLevelDocumentation(
    simpleLink: { url: string; name: string },
    valueChange?: ValidatedValueChange<unknown>,
  ) {
    this.patchGeneral({ criticalityLevelDocumentation: simpleLink }, valueChange);
  }

  public resetCriticalityLevelDocumentation() {
    this.patchGeneral({ criticalityLevelDocumentation: undefined });
  }

  public patchTechnicalSystemTypes(selectedOptions: APIRegularOptionResponseDTO[]) {
    const uuids = selectedOptions.map((option) => option.uuid);
    this.patchGeneral({ technicalSystemTypeUuids: uuids });
  }

  public patchLicensingAndCodeModels(
    selectedOptions: LicensingAndCodeModel[],
    valueChange?: ValidatedValueChange<unknown>,
  ) {
    this.setupLicensingAndCodeModelsControl(this.itSystemInformationForm.controls.licensingAndCodeModels.value ?? []);
    const apiEnums = selectedOptions.map((option) => option.value);
    this.patchGeneral({ licensingAndCodeModels: apiEnums }, valueChange);
  }

  private setupTechnicalSystemTypesControl(items: MultiSelectDropdownItem<APIRegularOptionResponseDTO>[]) {
    this.initialSelectedTechnicalSystemTypes = items;
  }

  private mapTechnicalSystemTypeDropdownItems(
    types: APIIdentityNamePairResponseDTO[],
  ): MultiSelectDropdownItem<APIRegularOptionResponseDTO>[] {
    return types.map((type) => ({
      name: type.name,
      value: { uuid: type.uuid, name: type.name, description: '' } as APIRegularOptionResponseDTO,
      selected: true,
    }));
  }
}
