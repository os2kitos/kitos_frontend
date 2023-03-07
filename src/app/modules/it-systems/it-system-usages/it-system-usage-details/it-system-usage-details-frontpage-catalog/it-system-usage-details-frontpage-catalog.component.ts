import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Store } from '@ngrx/store';
import { combineLatest, first, map } from 'rxjs';
import { APIExternalReferenceDataResponseDTO, APIRegularOptionResponseDTO } from 'src/app/api/v2';
import { BaseComponent } from 'src/app/shared/base/base.component';
import { mapBusinessTypeToOption } from 'src/app/shared/models/business-type.model';
import { mapItSystemScopeToString } from 'src/app/shared/models/it-system-scope.model';
import { mapRecommendedArchiveDutyToString } from 'src/app/shared/models/recommended-archive-duty.model';
import { filterNullish } from 'src/app/shared/pipes/filter-nullish';
import { selectItSystemUsageSystemContextUuid } from 'src/app/store/it-system-usage/selectors';
import { ITSystemActions } from 'src/app/store/it-system/actions';
import {
  selectItSystem,
  selectItSystemDeactivated,
  selectItSystemKle,
  selectItSystemParentSystem,
} from 'src/app/store/it-system/selectors';
import { selectOrganizationUuid } from 'src/app/store/user-store/selectors';
import { ITSystemUsageDetailsFrontpageCatalogComponentStore } from './it-system-usage-details-frontpage-catalog.component-store';

@Component({
  selector: 'app-it-system-usage-details-frontpage-catalog',
  templateUrl: 'it-system-usage-details-frontpage-catalog.component.html',
  styleUrls: ['it-system-usage-details-frontpage-catalog.component.scss'],
})
export class ITSystemUsageDetailsFrontpageCatalogComponent extends BaseComponent implements OnInit {
  public readonly itSystemInformationForm = new FormGroup({
    name: new FormControl({ value: '', disabled: true }),
    parentSystem: new FormControl({ value: '', disabled: true }),
    formerName: new FormControl({ value: '', disabled: true }),
    rightsHolder: new FormControl({ value: '', disabled: true }),
    businessType: new FormControl<APIRegularOptionResponseDTO | undefined>({ value: undefined, disabled: true }),
    scope: new FormControl({ value: '', disabled: true }),
    uuid: new FormControl({ value: '', disabled: true }),
    recommendedArchiveDuty: new FormControl({ value: '', disabled: true }),
    recommendedArchiveDutyComment: new FormControl<string | undefined>({ value: undefined, disabled: true }),
    urlReference: new FormControl<APIExternalReferenceDataResponseDTO[] | undefined>({
      value: undefined,
      disabled: true,
    }),
    description: new FormControl({ value: '', disabled: true }),
  });

  // Combine KLE from IT System with optionally fetched KLE details description
  public readonly kle$ = combineLatest([this.store.select(selectItSystemKle), this.componentStore.kleDetails$]).pipe(
    map(([kleList, kleDetails]) => {
      if (!kleList) return undefined;

      return kleList.map((kle) => ({
        id: kle.name,
        name: kleDetails?.find((kleDetail) => kleDetail.uuid === kle.uuid)?.description || '',
      }));
    })
  );

  public readonly itSystemDeactivated$ = this.store.select(selectItSystemDeactivated);

  public readonly businessTypes$ = this.componentStore.businessTypes$;

  constructor(private store: Store, private componentStore: ITSystemUsageDetailsFrontpageCatalogComponentStore) {
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

    // Fetch business types
    this.subscriptions.add(
      this.store
        .select(selectOrganizationUuid)
        .pipe(filterNullish(), first())
        .subscribe((organizationUuid) => this.componentStore.getBusinessTypes(organizationUuid))
    );

    // Fetch KLE details for each KLE from IT System
    this.subscriptions.add(
      this.store
        .select(selectItSystemKle)
        .pipe(filterNullish(), first())
        .subscribe((kles) => kles.map((kle) => this.componentStore.getKLEDetail(kle.uuid)))
    );

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
            businessType: mapBusinessTypeToOption(itSystem.businessType),
            scope: mapItSystemScopeToString(itSystem.scope) || '',
            uuid: itSystem.uuid,
            recommendedArchiveDuty: mapRecommendedArchiveDutyToString(itSystem.recommendedArchiveDuty) || '',
            recommendedArchiveDutyComment: itSystem.recommendedArchiveDuty.comment,
            urlReference: itSystem.externalReferences,
            description: itSystem.description,
          })
        )
    );

    // Update form with parent system details
    this.subscriptions.add(
      this.componentStore.parentSystem$.pipe(filterNullish()).subscribe((parentSystem) => {
        this.itSystemInformationForm.patchValue({
          parentSystem: `${parentSystem.name} ${parentSystem.deactivated ? $localize`(ikke tilgængeligt)` : ''}`,
        });
      })
    );
  }
}
