import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Store } from '@ngrx/store';
import { first } from 'rxjs';
import { APIExternalReferenceDataResponseDTO, APIRegularOptionResponseDTO } from 'src/app/api/v2';
import { BaseComponent } from 'src/app/shared/base/base.component';
import { AppPath } from 'src/app/shared/enums/app-path';
import { mapItSystemScopeToString } from 'src/app/shared/models/it-system-scope.model';
import { mapOptionCrossReferenceToOptionDTO } from 'src/app/shared/models/option-type.model';
import {
  mapRecommendedArchiveDutyComment,
  mapRecommendedArchiveDutyToString,
} from 'src/app/shared/models/recommended-archive-duty.model';
import { filterNullish } from 'src/app/shared/pipes/filter-nullish';
import { EntityStatusTextsService } from 'src/app/shared/services/entity-status-texts.service';
import { BusinessTypeActions } from 'src/app/store/business-type/actions';
import { selectBusinessTypes } from 'src/app/store/business-type/selectors';
import { selectItSystemUsageSystemContextUuid } from 'src/app/store/it-system-usage/selectors';
import { ITSystemActions } from 'src/app/store/it-system/actions';
import {
  selectItSystem,
  selectItSystemIsActive,
  selectItSystemKleWithDetails,
  selectItSystemParentSystem,
} from 'src/app/store/it-system/selectors';
import { KLEActions } from 'src/app/store/kle/actions';
import { ITSystemUsageDetailsFrontpageCatalogComponentStore } from './it-system-usage-details-frontpage-catalog.component-store';

@Component({
  selector: 'app-it-system-usage-details-frontpage-catalog',
  templateUrl: 'it-system-usage-details-frontpage-catalog.component.html',
  styleUrls: ['it-system-usage-details-frontpage-catalog.component.scss'],
  providers: [ITSystemUsageDetailsFrontpageCatalogComponentStore],
})
export class ITSystemUsageDetailsFrontpageCatalogComponent extends BaseComponent implements OnInit {
  public readonly AppPath = AppPath;

  public readonly itSystemInformationForm = new FormGroup({
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

  public readonly kle$ = this.store.select(selectItSystemKleWithDetails);
  public readonly businessTypes$ = this.store.select(selectBusinessTypes);
  public readonly itSystemIsActive$ = this.store.select(selectItSystemIsActive);
  public readonly itSystemCatalogItemUuid$ = this.store.select(selectItSystemUsageSystemContextUuid);

  constructor(
    private store: Store,
    private componentStore: ITSystemUsageDetailsFrontpageCatalogComponentStore,
    private readonly entityStatusTextsService: EntityStatusTextsService
  ) {
    super();
  }

  ngOnInit() {
    // Fetch IT System details
    this.subscriptions.add(
      this.store
        .select(selectItSystemUsageSystemContextUuid)
        .pipe(filterNullish(), first())
        .subscribe((systemContextUuid) => this.store.dispatch(ITSystemActions.getItSystem(systemContextUuid)))
    );

    // Fetch parent system details
    this.subscriptions.add(
      this.store
        .select(selectItSystemParentSystem)
        .pipe(filterNullish(), first())
        .subscribe((parentSystem) => this.componentStore.getParentSystem(parentSystem.uuid))
    );

    this.store.dispatch(BusinessTypeActions.getBusinessTypes());
    this.store.dispatch(KLEActions.getKles());

    // Set initial state of information form
    this.subscriptions.add(
      this.store
        .select(selectItSystem)
        .pipe(filterNullish())
        .subscribe((itSystem) =>
          this.itSystemInformationForm.patchValue({
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
        this.itSystemInformationForm.patchValue({
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
