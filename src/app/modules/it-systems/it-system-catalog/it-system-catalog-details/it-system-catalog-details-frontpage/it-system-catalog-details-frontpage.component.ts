import { AsyncPipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { BehaviorSubject, combineLatestWith, first, map } from 'rxjs';
import { APIShallowOrganizationDTO } from 'src/app/api/v1';
import {
  APIExternalReferenceDataResponseDTO,
  APIIdentityNamePairResponseDTO,
  APILicensingAndCodeModelChoice,
  APIRecommendedArchiveDutyChoice,
  APIRegularOptionResponseDTO,
  APIUpdateItSystemRequestDTO,
} from 'src/app/api/v2';
import { BaseComponent } from 'src/app/shared/base/base.component';
import { ARCHIVE_TEXT } from 'src/app/shared/constants/constants';
import { MultiSelectDropdownItem } from 'src/app/shared/models/dropdown-option.model';
import {
  ArchiveDutyRecommendationChoice,
  archiveDutyRecommendationChoiceOptions,
  mapArchiveDutyRecommendationChoice,
} from 'src/app/shared/models/it-system/archive-duty-recommendation-choice.model';
import {
  ScopeChoice,
  mapScopeEnumToScopeChoice,
  scopeOptions,
} from 'src/app/shared/models/it-system/it-system-scope.model';
import {
  LicensingAndCodeModel,
  licensingAndCodeModelOptions,
  mapLicensingAndCodeModels,
} from 'src/app/shared/models/it-system/licensing-and-code-model.model';
import { ValidatedValueChange } from 'src/app/shared/models/validated-value-change.model';
import { filterNullish } from 'src/app/shared/pipes/filter-nullish';
import { EntityStatusTextsService } from 'src/app/shared/services/entity-status-texts.service';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { ITSystemActions } from 'src/app/store/it-system/actions';
import {
  selectITSystemCanModifyVisibilityPermission,
  selectITSystemHasModifyPermission,
  selectItSystem,
  selectItSystemExternalReferences,
  selectItSystemIsActive,
  selectItSystemParentSystem,
} from 'src/app/store/it-system/selectors';
import { RegularOptionTypeActions } from 'src/app/store/regular-option-type-store/actions';
import { selectRegularOptionTypes } from 'src/app/store/regular-option-type-store/selectors';
import { CardHeaderComponent } from '../../../../../shared/components/card-header/card-header.component';
import { CardComponent } from '../../../../../shared/components/card/card.component';
import { ContentBoxComponent } from '../../../../../shared/components/contentbox/contentbox.component';
import { ConnectedDropdownComponent } from '../../../../../shared/components/dropdowns/connected-dropdown/connected-dropdown.component';
import { DropdownComponent } from '../../../../../shared/components/dropdowns/dropdown/dropdown.component';
import { MultiSelectDropdownComponent } from '../../../../../shared/components/dropdowns/multi-select-dropdown/multi-select-dropdown.component';
import { ExternalReferenceComponent } from '../../../../../shared/components/external-reference/external-reference.component';
import { FormGridComponent } from '../../../../../shared/components/form-grid/form-grid.component';
import { ParagraphComponent } from '../../../../../shared/components/paragraph/paragraph.component';
import { StatusChipComponent } from '../../../../../shared/components/status-chip/status-chip.component';
import { TextAreaComponent } from '../../../../../shared/components/textarea/textarea.component';
import { TextBoxInfoComponent } from '../../../../../shared/components/textbox-info/textbox-info.component';
import { TextBoxComponent } from '../../../../../shared/components/textbox/textbox.component';
import { ItSystemKleOverviewComponent } from '../../../shared/it-system-kle-overview/it-system-kle-overview.component';
import { ITSystemCatalogDetailsFrontpageComponentStore } from './it-system-catalog-details-frontpage.component-store';

@Component({
  selector: 'app-it-system-catalog-details-frontpage',
  templateUrl: './it-system-catalog-details-frontpage.component.html',
  styleUrl: './it-system-catalog-details-frontpage.component.scss',
  providers: [ITSystemCatalogDetailsFrontpageComponentStore],
  imports: [
    CardComponent,
    CardHeaderComponent,
    StatusChipComponent,
    FormGridComponent,
    FormsModule,
    ReactiveFormsModule,
    TextBoxComponent,
    ConnectedDropdownComponent,
    DropdownComponent,
    ContentBoxComponent,
    ExternalReferenceComponent,
    TextAreaComponent,
    TextBoxInfoComponent,
    ParagraphComponent,
    ItSystemKleOverviewComponent,
    AsyncPipe,
    MultiSelectDropdownComponent,
  ],
})
export class ItSystemCatalogDetailsFrontpageComponent extends BaseComponent implements OnInit {
  public readonly itSystemIsActive$ = this.store.select(selectItSystemIsActive);
  public readonly businessTypes$ = this.store
    .select(selectRegularOptionTypes('it-system_business-type'))
    .pipe(filterNullish());
  public readonly scopeOptions = scopeOptions;
  public readonly itSystems$ = this.componentStore.itSystems$;
  public readonly isLoading$ = this.componentStore.isLoading$;
  public readonly organizations$ = this.componentStore.organizations$;
  public readonly isLoadingOrganizations$ = this.componentStore.isLoadingOrganizations$;
  public readonly hasModifyVisibilityPermission$ = this.store.select(selectITSystemHasModifyPermission);
  public readonly licensingAndCodeModelDropdownOptions$: BehaviorSubject<
    MultiSelectDropdownItem<LicensingAndCodeModel>[]
  > = new BehaviorSubject(this.getDefaultLicensingAndCodeModelDropdownOptions());

  public readonly externalReferences$ = this.store.select(selectItSystemExternalReferences).pipe(
    filterNullish(),
    map((references) => [...references].sort((a, b) => a.title.localeCompare(b.title))),
  );

  public readonly archiveDutyRecommendationOptions = archiveDutyRecommendationChoiceOptions;
  public initialSelectedLicensingAndCodeModels: MultiSelectDropdownItem<LicensingAndCodeModel>[] = [];

  public readonly itSystemFrontpageFormGroup = new FormGroup({
    name: new FormControl<string | undefined>({ value: undefined, disabled: true }, Validators.required),
    parentSystem: new FormControl<APIIdentityNamePairResponseDTO | undefined>({ value: undefined, disabled: true }),
    formerName: new FormControl<string | undefined>({ value: undefined, disabled: true }),
    rightsHolder: new FormControl<APIShallowOrganizationDTO | undefined>({ value: undefined, disabled: true }),
    businessType: new FormControl<APIRegularOptionResponseDTO | undefined>({ value: undefined, disabled: true }),
    scope: new FormControl<ScopeChoice | undefined>({ value: undefined, disabled: true }),
    uuid: new FormControl<string | undefined>({ value: undefined, disabled: true }),
    externalUuid: new FormControl<string | undefined>({ value: undefined, disabled: true }),
    recommendedArchiveDuty: new FormControl<ArchiveDutyRecommendationChoice | undefined>({
      value: undefined,
      disabled: true,
    }),
    recommendedArchiveDutyComment: new FormControl<string | undefined>({ value: undefined, disabled: true }),
    urlReference: new FormControl<APIExternalReferenceDataResponseDTO[] | undefined>({
      value: undefined,
      disabled: true,
    }),
    description: new FormControl<string | undefined>({ value: undefined, disabled: true }),
    legalName: new FormControl<string | undefined>({ value: undefined, disabled: true }),
    legalDataProcessorName: new FormControl<string | undefined>({ value: undefined, disabled: true }),
    licensingAndCodeModels: new FormControl<MultiSelectDropdownItem<LicensingAndCodeModel>[] | undefined>({
      value: undefined,
      disabled: true,
    }),
  });

  public readonly nationalArchivesText = ARCHIVE_TEXT;

  constructor(
    private store: Store,
    private componentStore: ITSystemCatalogDetailsFrontpageComponentStore,
    private entityStatusTextsService: EntityStatusTextsService,
    private notificationService: NotificationService,
  ) {
    super();
  }
  ngOnInit(): void {
    this.getParentSystemDetails();

    this.store.dispatch(RegularOptionTypeActions.getOptions('it-system_business-type'));

    this.subscribeToItSystem();

    this.getParentSystemDetails();

    this.updateSystemParent();
  }

  public patchFrontPage(frontpage: APIUpdateItSystemRequestDTO, valueChange?: ValidatedValueChange<unknown>) {
    if (valueChange && !valueChange.valid) {
      this.notificationService.showError($localize`"${valueChange.text}" er ugyldig`);
    } else {
      this.store.dispatch(ITSystemActions.patchITSystem(frontpage));
    }
  }

  public patchLicensingAndCodeModels(
    frontendModels: LicensingAndCodeModel[],
    valueChange?: ValidatedValueChange<unknown>,
  ) {
    this.setupLicensingAndCodeModelsControl(
      this.itSystemFrontpageFormGroup.controls.licensingAndCodeModels.value ?? [],
    );
    const apiEnums = frontendModels.map((model) => model.value);
    this.patchFrontPage({ licensingAndCodeModels: apiEnums }, valueChange);
  }

  public patchArchiveDutyComment(value: string | undefined, valueChange?: ValidatedValueChange<unknown>) {
    const archiveDutyRecommendationId = this.itSystemFrontpageFormGroup.controls.recommendedArchiveDuty.value?.value;
    this.patchFrontPage({ recommendedArchiveDuty: { id: archiveDutyRecommendationId, comment: value } }, valueChange);
  }

  public onDropdownCleared() {
    this.patchFrontPage(
      { recommendedArchiveDuty: { id: APIRecommendedArchiveDutyChoice.Undecided, comment: '' } },
      undefined,
    );
  }

  public patchArchiveDutyId(value: APIRecommendedArchiveDutyChoice, valueChange?: ValidatedValueChange<unknown>) {
    const archiveDutyRecommendationComment =
      this.itSystemFrontpageFormGroup.controls.recommendedArchiveDutyComment.value ?? undefined;
    this.patchFrontPage(
      { recommendedArchiveDuty: { id: value, comment: archiveDutyRecommendationComment } },
      valueChange,
    );
  }

  public searchItSystems(searchTerm?: string) {
    this.componentStore.searchItSystems(searchTerm);
  }

  public searchRightsHolderOrganizations(searchTerm?: string) {
    this.componentStore.searchRightsHolderOrganizations(searchTerm);
  }

  private getParentSystemDetails() {
    this.subscriptions.add(
      this.store
        .select(selectItSystemParentSystem)
        .pipe(filterNullish(), first())
        .subscribe((parentSystem) => this.componentStore.getParentSystem(parentSystem.uuid)),
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

  public hasModifyPermission$ = this.store.select(selectITSystemHasModifyPermission);

  private subscribeToItSystem() {
    this.subscriptions.add(
      this.store
        .select(selectItSystem)
        .pipe(
          filterNullish(),
          combineLatestWith(
            this.store.select(selectITSystemHasModifyPermission),
            this.store.select(selectITSystemCanModifyVisibilityPermission),
          ),
        )
        .subscribe(([itSystem, hasModifyPermission, canModifyVisibility]) => {
          const licensingAndCodeModelDropdownItems = this.mapLicensingAndCodeModelDropdownItems(
            itSystem.licensingAndCodeModels ?? [],
          );

          this.itSystemFrontpageFormGroup.patchValue({
            name: itSystem.name,
            parentSystem: itSystem.parentSystem,
            formerName: itSystem.formerName,
            rightsHolder: itSystem.rightsHolder,
            businessType: itSystem.businessType as APIRegularOptionResponseDTO,
            scope: mapScopeEnumToScopeChoice(itSystem.scope),
            uuid: itSystem.uuid,
            externalUuid: itSystem.externalUuid,
            recommendedArchiveDuty: mapArchiveDutyRecommendationChoice(itSystem.recommendedArchiveDuty.id),
            recommendedArchiveDutyComment: itSystem.recommendedArchiveDuty.comment,
            urlReference: itSystem.externalReferences,
            description: itSystem.description,
            legalName: itSystem.legalName,
            legalDataProcessorName: itSystem.legalDataProcessorName,
            licensingAndCodeModels: licensingAndCodeModelDropdownItems,
          });

          this.setupLicensingAndCodeModelsControl(licensingAndCodeModelDropdownItems);

          if (hasModifyPermission) {
            this.itSystemFrontpageFormGroup.enable();

            if (itSystem.recommendedArchiveDuty.id === APIRecommendedArchiveDutyChoice.Undecided) {
              this.itSystemFrontpageFormGroup.controls.recommendedArchiveDutyComment.disable();
            } else {
              this.itSystemFrontpageFormGroup.controls.recommendedArchiveDutyComment.enable();
            }
          } else {
            this.itSystemFrontpageFormGroup.disable();
          }

          if (canModifyVisibility) {
            this.itSystemFrontpageFormGroup.controls.scope.enable();
          } else {
            this.itSystemFrontpageFormGroup.controls.scope.disable();
          }

          //Uuids should always be disabled
          this.itSystemFrontpageFormGroup.controls.uuid.disable();
          this.itSystemFrontpageFormGroup.controls.externalUuid.disable();
          this.itSystemFrontpageFormGroup.controls.legalName.disable();
          this.itSystemFrontpageFormGroup.controls.legalDataProcessorName.disable();
        }),
    );
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

  private updateSystemParent() {
    this.subscriptions.add(
      this.componentStore.parentSystem$.pipe(filterNullish()).subscribe((parentSystem) => {
        this.itSystemFrontpageFormGroup.patchValue({
          parentSystem: {
            uuid: parentSystem.uuid,
            name: `${parentSystem.name} ${
              parentSystem.deactivated
                ? `(${this.entityStatusTextsService.map('it-system').falseString.toLowerCase()})`
                : ''
            }`,
          },
        });
      }),
    );
  }
}
