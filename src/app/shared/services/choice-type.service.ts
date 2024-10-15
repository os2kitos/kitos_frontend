import { Injectable } from '@angular/core';
import {
  ChoiceTypeTableItem,
  ChoiceTypeTableOption,
} from '../components/choice-type-table/choice-type-table.component';
import { APIV2OrganizationService } from 'src/app/api/v2';
import { Store } from '@ngrx/store';
import { selectOrganizationUuid } from 'src/app/store/user-store/selectors';
import { first, switchMap } from 'rxjs';
import { filterNullish } from '../pipes/filter-nullish';
import { ChoiceTypeActions } from 'src/app/store/choice-types/actions';

@Injectable({
  providedIn: 'root',
})
export class ChoiceTypeService {
  constructor(private thisApiServiceIsAProofOfConcept: APIV2OrganizationService, private store: Store) {}

  public updateChoiceType(choiceTypeItem: ChoiceTypeTableItem, type: ChoiceTypeTableOption) {
    const patchMethod = this.getPatchMethod(type);
    const requestBody = this.getRequestBody(choiceTypeItem);

    this.store
      .select(selectOrganizationUuid)
      .pipe(
        first(),
        filterNullish(),
        switchMap((organizationUuid) => {
          const request = { organizationUuid, userUuid: choiceTypeItem.uuid, requestBody };
          return patchMethod(request);
        })
      )
      .subscribe({
        next: () => {
          this.store.dispatch(ChoiceTypeActions.updateChoiceTypeSuccess());
        },
        error: () => {
          this.store.dispatch(ChoiceTypeActions.updateChoiceTypeError());
        },
      });
  }

  private getPatchMethod(type: ChoiceTypeTableOption) {
    switch (type) {
      case 'organization-unit':
        return this.thisApiServiceIsAProofOfConcept.getSingleOrganizationV2GetOrganizationUser.bind(
          this.thisApiServiceIsAProofOfConcept
        );
      default:
        throw new Error('Invalid choice type');
    }
  }

  private getRequestBody(choiceTypeItem: ChoiceTypeTableItem) {
    return {
      description: choiceTypeItem.description,
    };
  }
}
