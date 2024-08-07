import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { combineLatestWith, first, map } from 'rxjs';
import { APIShallowOrganizationDTO } from 'src/app/api/v1';
import {
  APIExternalReferenceDataResponseDTO,
  APIIdentityNamePairResponseDTO,
  APIRecommendedArchiveDutyResponseDTO,
  APIRegularOptionResponseDTO,
  APIUpdateItSystemRequestDTO,
} from 'src/app/api/v2';
import { BaseComponent } from 'src/app/shared/base/base.component';
import { ARCHIVE_TEXT } from 'src/app/shared/constants';
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
import { ITSystemCatalogDetailsFrontpageComponentStore } from './it-system-catalog-details-frontpage.component-store';
import { mapRecommendedArchiveDutyComment } from 'src/app/shared/models/recommended-archive-duty.model';

@Component({
  selector: 'app-it-system-catalog-details-frontpage',
  templateUrl: './it-system-catalog-details-frontpage.component.html',
  styleUrl: './it-system-catalog-details-frontpage.component.scss',
  providers: [ITSystemCatalogDetailsFrontpageComponentStore],
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

  public readonly externalReferences$ = this.store.select(selectItSystemExternalReferences).pipe(
    filterNullish(),
    map((references) => [...references].sort((a, b) => a.title.localeCompare(b.title)))
  );

  public readonly archiveDutyRecommendationOptions = archiveDutyRecommendationChoiceOptions;

  public readonly itSystemFrontpageFormGroup = new FormGroup({
    name: new FormControl<string | undefined>({ value: undefined, disabled: true }, Validators.required),
    parentSystem: new FormControl<APIIdentityNamePairResponseDTO | undefined>({ value: undefined, disabled: true }),
    formerName: new FormControl<string | undefined>({ value: undefined, disabled: true }),
    rightsHolder: new FormControl<APIShallowOrganizationDTO | undefined>({ value: undefined, disabled: true }),
    businessType: new FormControl<APIRegularOptionResponseDTO | undefined>({ value: undefined, disabled: true }),
    scope: new FormControl<ScopeChoice | undefined>({ value: undefined, disabled: true }),
    uuid: new FormControl<string | undefined>({ value: undefined, disabled: true }),
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
  });

  public readonly nationalArchivesText = ARCHIVE_TEXT;

  constructor(
    private store: Store,
    private componentStore: ITSystemCatalogDetailsFrontpageComponentStore,
    private entityStatusTextsService: EntityStatusTextsService,
    private notificationService: NotificationService
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

  public patchArchiveDutyComment(value: string | undefined, valueChange?: ValidatedValueChange<unknown>) {
    const archiveDutyRecommendationId = this.itSystemFrontpageFormGroup.controls.recommendedArchiveDuty.value?.value;
    this.patchFrontPage({ recommendedArchiveDuty: { id: archiveDutyRecommendationId, comment: value } }, valueChange);
  }

  public onDropdownCleared() {
    //This correctly puts the comment as to undefined, but the dropdown option is not cleared, it's set to the same
    this.patchFrontPage({ recommendedArchiveDuty: { id: APIRecommendedArchiveDutyResponseDTO.IdEnum.Undecided, comment: '' } }, undefined);
  }

  public patchArchiveDutyId(
    value: APIRecommendedArchiveDutyResponseDTO.IdEnum,
    valueChange?: ValidatedValueChange<unknown>
  ) {
    const archiveDutyRecommendationComment =
      this.itSystemFrontpageFormGroup.controls.recommendedArchiveDutyComment.value ?? undefined;
    this.patchFrontPage(
      { recommendedArchiveDuty: { id: value, comment: archiveDutyRecommendationComment } },
      valueChange
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
        .subscribe((parentSystem) => this.componentStore.getParentSystem(parentSystem.uuid))
    );
  }

  private subscribeToItSystem() {
    this.subscriptions.add(
      this.store
        .select(selectItSystem)
        .pipe(
          filterNullish(),
          combineLatestWith(
            this.store.select(selectITSystemHasModifyPermission),
            this.store.select(selectITSystemCanModifyVisibilityPermission)
          )
        )
        .subscribe(([itSystem, hasModifyPermission, canModifyVisibility]) => {
          this.itSystemFrontpageFormGroup.patchValue({
            name: itSystem.name,
            parentSystem: itSystem.parentSystem,
            formerName: itSystem.formerName,
            rightsHolder: itSystem.rightsHolder,
            businessType: itSystem.businessType as APIRegularOptionResponseDTO,
            scope: mapScopeEnumToScopeChoice(itSystem.scope),
            uuid: itSystem.uuid,
            recommendedArchiveDuty: mapArchiveDutyRecommendationChoice(itSystem.recommendedArchiveDuty.id),
            recommendedArchiveDutyComment: itSystem.recommendedArchiveDuty.comment,
            urlReference: itSystem.externalReferences,
            description: itSystem.description,
          });

          if (hasModifyPermission) {
            this.itSystemFrontpageFormGroup.enable();

            if (
              itSystem.recommendedArchiveDuty.id === APIRecommendedArchiveDutyResponseDTO.IdEnum.NoRecommendation ||
              itSystem.recommendedArchiveDuty.id === APIRecommendedArchiveDutyResponseDTO.IdEnum.Undecided
            ) {
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

          //Uuid should always be disabled
          this.itSystemFrontpageFormGroup.controls.uuid.disable();
        })
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
      })
    );
  }
}
