import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { first, switchMap } from 'rxjs';
import { APIV2OrganizationService } from 'src/app/api/v2';
import { OptionTypeActions } from 'src/app/store/option-types/actions';
import { selectOrganizationUuid } from 'src/app/store/user-store/selectors';
import {
  OptionTypeTableItem,
  OptionTypeTableOption,
} from '../components/option-type-table/option-type-table.component';
import { filterNullish } from '../pipes/filter-nullish';

@Injectable({
  providedIn: 'root',
})
export class OptionTypeService {
  constructor(private thisApiServiceIsAProofOfConcept: APIV2OrganizationService, private store: Store) {}

  public updateOptionType(optionType: OptionTypeTableItem, type: OptionTypeTableOption) {
    const patchMethod = this.getPatchMethod(type);
    const requestBody = this.getRequestBody(optionType);

    this.store
      .select(selectOrganizationUuid)
      .pipe(
        first(),
        filterNullish(),
        switchMap((organizationUuid) => {
          const request = { organizationUuid, userUuid: optionType.uuid, requestBody };
          return patchMethod(request);
        })
      )
      .subscribe({
        next: () => {
          this.store.dispatch(OptionTypeActions.updateOptionTypeSuccess());
        },
        error: () => {
          this.store.dispatch(OptionTypeActions.updateOptionTypeError());
        },
      });
  }

  private getPatchMethod(type: OptionTypeTableOption) {
    switch (type) {
      case 'organization-unit':
        return this.thisApiServiceIsAProofOfConcept.getSingleOrganizationV2GetOrganizationUser.bind(
          this.thisApiServiceIsAProofOfConcept
        );
      default:
        throw new Error('Invalid option type');
    }
  }

  private getRequestBody(optionTypeItem: OptionTypeTableItem) {
    return {
      description: optionTypeItem.description,
    };
  }
}
