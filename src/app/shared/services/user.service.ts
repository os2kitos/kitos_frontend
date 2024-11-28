import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { map } from 'rxjs';
import { APIUserResponseDTO } from 'src/app/api/v2';
import { selectUIRootConfig } from 'src/app/store/organization/selectors';
import { startPreferenceChoiceOptions } from '../models/organization/organization-user/start-preference.model';
import { filterNullish } from '../pipes/filter-nullish';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private readonly uiRootConfig$ = this.store.select(selectUIRootConfig).pipe(filterNullish());

  constructor(private readonly store: Store) {}

  public getAvailableStartPreferenceOptions() {
    return this.uiRootConfig$.pipe(
      map((uiRootConfig) => {
        const excludedValues: APIUserResponseDTO.DefaultUserStartPreferenceEnum[] = [];
        if (!uiRootConfig.showItSystemModule) {
          excludedValues.push(APIUserResponseDTO.DefaultUserStartPreferenceEnum.ItSystemCatalog);
          excludedValues.push(APIUserResponseDTO.DefaultUserStartPreferenceEnum.ItSystemUsage);
        }
        if (!uiRootConfig.showDataProcessing) {
          excludedValues.push(APIUserResponseDTO.DefaultUserStartPreferenceEnum.DataProcessing);
        }
        if (!uiRootConfig.showItContractModule) {
          excludedValues.push(APIUserResponseDTO.DefaultUserStartPreferenceEnum.ItContract);
        }

        return startPreferenceChoiceOptions.filter((o) => !excludedValues.includes(o.value));
      })
    );
  }
}
