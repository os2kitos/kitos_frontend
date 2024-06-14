import { Component, Input, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup } from '@angular/forms';
import { Store } from '@ngrx/store';
import { BaseComponent } from 'src/app/shared/base/base.component';
import { ValidatedValueChange } from 'src/app/shared/models/validated-value-change.model';
import { filterNullish } from 'src/app/shared/pipes/filter-nullish';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { ITSystemUsageActions } from 'src/app/store/it-system-usage/actions';
import { selectItSystemUsageGdprRegisteredDataCategories } from 'src/app/store/it-system-usage/selectors';
import { RegularOptionTypeActions } from 'src/app/store/regular-option-type-store/actions';
import { selectRegularOptionTypes } from 'src/app/store/regular-option-type-store/selectors';

@Component({
  selector: 'app-registered-data-categories-section',
  templateUrl: './registered-data-categories-section.component.html',
  styleUrls: ['./registered-data-categories-section.component.scss'],
})
export class RegisteredDataCategoriesSectionComponent extends BaseComponent implements OnInit {
  @Input() onNoPermissions: (forms: AbstractControl[])  => void = (forms: AbstractControl[]) => {};

  public readonly registeredDataCategoriesOptions$ = this.store.select(
    selectRegularOptionTypes('it_system_usage-gdpr-registered-data-category-type')
  );

  public readonly registeredDataCategories$ = this.store
    .select(selectItSystemUsageGdprRegisteredDataCategories)
    .pipe(filterNullish());

  public readonly registeredDataCategoriesForm = new FormGroup({}, { updateOn: 'change' });

  public constructor(private readonly store: Store, private readonly notificationService: NotificationService) {
    super();
  }

  ngOnInit(): void {
    this.store.dispatch(RegularOptionTypeActions.getOptions('it_system_usage-gdpr-registered-data-category-type'));
    this.setupRegisteredDataCategories();
  }

  public setupRegisteredDataCategories(): void {
    this.registeredDataCategoriesOptions$.subscribe((options) => {
      options?.forEach((option) => {
        this.registeredDataCategoriesForm.addControl(option.uuid, new FormControl<boolean>(false));
      });
      this.registeredDataCategories$.subscribe((registeredDataCategories) => {
        registeredDataCategories.forEach((type) => {
          if (type) {
            const control = this.registeredDataCategoriesForm.get(type.uuid);
            control?.patchValue(true);
          }
        });
        this.onNoPermissions([this.registeredDataCategoriesForm]);
      });
    });
  }

  public patchRegisteredDataCategories(valueChange?: ValidatedValueChange<unknown>) {
    if (valueChange && !valueChange.valid) {
      this.notificationService.showInvalidFormField(valueChange.text);
    } else {
      const newRegisteredDataCategoryUuids: string[] = [];
      for (const controlKey in this.registeredDataCategoriesForm.controls) {
        const control = this.registeredDataCategoriesForm.get(controlKey);
        if (control?.value) {
          newRegisteredDataCategoryUuids.push(controlKey);
        }
      }
      this.store.dispatch(
        ITSystemUsageActions.patchITSystemUsage({
          gdpr: { registeredDataCategoryUuids: newRegisteredDataCategoryUuids },
        })
      );
    }
  }
}
