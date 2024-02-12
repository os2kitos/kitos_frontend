import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Store } from '@ngrx/store';
import { first } from 'rxjs';
import { APIExternalReferenceDataResponseDTO, APIRegularOptionResponseDTO } from 'src/app/api/v2';
import { BaseComponent } from 'src/app/shared/base/base.component';
import { mapItSystemScopeToString } from 'src/app/shared/models/it-system/it-system-scope.model';
import { mapOptionCrossReferenceToOptionDTO } from 'src/app/shared/models/options/option-type.model';
import {
  mapRecommendedArchiveDutyComment,
  mapRecommendedArchiveDutyToString,
} from 'src/app/shared/models/recommended-archive-duty.model';
import { filterNullish } from 'src/app/shared/pipes/filter-nullish';
import { EntityStatusTextsService } from 'src/app/shared/services/entity-status-texts.service';
import { selectItSystem, selectItSystemIsActive, selectItSystemParentSystem } from 'src/app/store/it-system/selectors';
import { RegularOptionTypeActions } from 'src/app/store/regular-option-type-store/actions';
import { selectRegularOptionTypes } from 'src/app/store/regular-option-type-store/selectors';
import { ITSystemCatalogDetailsFrontpageComponentStore } from './it-system-catalog-details-frontpage.component-store';

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

  public readonly itSystemFrontpageFormGroup = new FormGroup({
    name: new FormControl({ value: '', disabled: true }),
    parentSystem: new FormControl({ value: '', disabled: true }),
    formerName: new FormControl({ value: '', disabled: true }),
    rightsHolder: new FormControl({ value: '', disabled: true }),
    businessType: new FormControl<APIRegularOptionResponseDTO | undefined>({ value: undefined, disabled: true }),
    scope: new FormControl({ value: '', disabled: true }),
    uuid: new FormControl({ value: '', disabled: true }),
    recommendedArchiveDuty: new FormControl({ value: '', disabled: true }),
    recommendedArchiveDutyComment: new FormControl({ value: '', disabled: true }),
    urlReference: new FormControl<APIExternalReferenceDataResponseDTO[] | undefined>({
      value: undefined,
      disabled: true,
    }),
    description: new FormControl({ value: '', disabled: true }),
  });

  constructor(
    private store: Store,
    private componentStore: ITSystemCatalogDetailsFrontpageComponentStore,
    private entityStatusTextsService: EntityStatusTextsService
  ) {
    super();
  }
  ngOnInit(): void {
    //Fetch parent system details
    this.subscriptions.add(
      this.store
        .select(selectItSystemParentSystem)
        .pipe(filterNullish(), first())
        .subscribe((parentSystem) => this.componentStore.getParentSystem(parentSystem.uuid))
    );

    this.store.dispatch(RegularOptionTypeActions.getOptions('it-system_business-type'));

    this.subscriptions.add(
      this.store
        .select(selectItSystem)
        .pipe(filterNullish())
        .subscribe((itSystem) =>
          this.itSystemFrontpageFormGroup.patchValue({
            name: itSystem.name,
            parentSystem: itSystem.parentSystem?.name || '',
            formerName: itSystem.formerName,
            rightsHolder: itSystem.rightsHolder?.name || '',
            businessType: mapOptionCrossReferenceToOptionDTO(itSystem.businessType),
            scope: mapItSystemScopeToString(itSystem.scope) || '',
            uuid: itSystem.uuid,
            recommendedArchiveDuty: mapRecommendedArchiveDutyToString(itSystem.recommendedArchiveDuty) || '',
            recommendedArchiveDutyComment: mapRecommendedArchiveDutyComment(itSystem.recommendedArchiveDuty),
            urlReference: itSystem.externalReferences,
            description: itSystem.description,
          })
        )
    );

    // Update form with parent system details
    this.subscriptions.add(
      this.componentStore.parentSystem$.pipe(filterNullish()).subscribe((parentSystem) => {
        this.itSystemFrontpageFormGroup.patchValue({
          parentSystem: `${parentSystem.name} ${
            parentSystem.deactivated
              ? `(${this.entityStatusTextsService.map('it-system').falseString.toLowerCase()})`
              : ''
          }`,
        });
      })
    );
  }
}
