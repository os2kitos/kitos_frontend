import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Store } from '@ngrx/store';
import { APIGDPRRegistrationsResponseDTO } from 'src/app/api/v2';
import { BaseComponent } from 'src/app/shared/base/base.component';
import { IdentityNamePair, mapIdentityNamePair } from 'src/app/shared/models/identity-name-pair.model';
import { ValidatedValueChange } from 'src/app/shared/models/validated-value-change.model';
import { filterNullish } from 'src/app/shared/pipes/filter-nullish';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { ITSystemUsageActions } from 'src/app/store/it-system-usage/actions';
import { selectItSystemUsageGdpr } from 'src/app/store/it-system-usage/selectors';
import { RegularOptionTypeActions } from 'src/app/store/regular-option-type-store/actions';
import { selectRegularOptionTypes } from 'src/app/store/regular-option-type-store/selectors';

@Component({
  selector: 'app-registered-data-categories-section',
  templateUrl: './registered-data-categories-section.component.html',
  styleUrls: ['./registered-data-categories-section.component.scss']
})
export class RegisteredDataCategoriesSectionComponent extends BaseComponent implements OnInit{
  public readonly registeredDataCategoriesOptions$ = this.store
  .select(selectRegularOptionTypes('it_system_usage-gdpr-registered-data-category-type'))

  public readonly registeredDataCategoriesForm = new FormGroup({},
    { updateOn: 'change'})

  public constructor(
    private readonly store: Store,
    private readonly notificationService: NotificationService){
      super();
    }

  ngOnInit(): void {
    this.store.dispatch(RegularOptionTypeActions.getOptions('it_system_usage-gdpr-registered-data-category-type'));

    this.subscriptions.add(
      this.store
      .select(selectItSystemUsageGdpr)
      .pipe(filterNullish())
      .subscribe((gdpr) => {
        this.setupRegisteredDataCategories(gdpr);
      })
    )
  }

  public setupRegisteredDataCategories(gdpr: APIGDPRRegistrationsResponseDTO): void {
    this.registeredDataCategoriesOptions$.subscribe((options) => {
      options?.forEach((option) => {
        this.registeredDataCategoriesForm.addControl(option.uuid, new FormControl<boolean>(false));
      })
      const registeredDataCategories: (IdentityNamePair | undefined)[] = [];
      gdpr.registeredDataCategories.forEach((category) => registeredDataCategories.push(mapIdentityNamePair(category)))
      registeredDataCategories.forEach((type) => {
          if (type){
            const control = this.registeredDataCategoriesForm.get(type.uuid);
            control?.patchValue(true)
          }
      })
    })
  }

  public patchRegisteredDataCategories(valueChange?: ValidatedValueChange<unknown>) {
    if (valueChange && !valueChange.valid) {
      this.notificationService.showInvalidFormField(valueChange.text);
  } else {
    const newRegisteredDataCategoryUuids: string[] = [];
      for (const controlKey in this.registeredDataCategoriesForm.controls){
        const control = this.registeredDataCategoriesForm.get(controlKey);
        if (control?.value){
          newRegisteredDataCategoryUuids.push(controlKey);
        }
      }
      this.store.dispatch(ITSystemUsageActions.patchItSystemUsage({ gdpr: { registeredDataCategoryUuids: newRegisteredDataCategoryUuids } }));
  }
  }
}
