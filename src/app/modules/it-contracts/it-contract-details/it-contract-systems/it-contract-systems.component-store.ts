import { Injectable, OnDestroy } from '@angular/core';
import { ComponentStore, tapResponse } from '@ngrx/component-store';
import { Store } from '@ngrx/store';
import { mergeMap, tap } from 'rxjs';
import { APIGeneralSystemRelationResponseDTO, APIV2ItSystemUsageInternalINTERNALService } from 'src/app/api/v2';
import { filterNullish } from 'src/app/shared/pipes/filter-nullish';
import { selectItContractUuid } from 'src/app/store/it-contract/selectors';

interface State {
  systemRelations?: Array<APIGeneralSystemRelationResponseDTO>;
  systemRelationsIsLoading: boolean;
}

@Injectable()
export class ItContractSystemsComponentStore extends ComponentStore<State> implements OnDestroy {
  public readonly systemRelations$ = this.select((state) => state.systemRelations).pipe(filterNullish());
  public readonly systemRelationsIsLoading$ = this.select((state) => state.systemRelationsIsLoading);

  constructor(
    private readonly systemUsageService: APIV2ItSystemUsageInternalINTERNALService,
    private readonly store: Store
  ) {
    super({ systemRelationsIsLoading: false });
  }

  private updateSystemRelations = this.updater(
    (state, systemRelations: APIGeneralSystemRelationResponseDTO[]): State => ({
      ...state,
      systemRelations,
    })
  );

  private updateSystemRelationsIsLoading = this.updater(
    (state, systemRelationsIsLoading: boolean): State => ({ ...state, systemRelationsIsLoading })
  );

  public getSystemRelations = this.effect(() =>
    this.store.select(selectItContractUuid).pipe(
      filterNullish(),
      tap(() => this.updateSystemRelationsIsLoading(true)),
      mergeMap((itContractUuid) => {
        return this.systemUsageService
          .getManyItSystemUsageInternalV2GetRelations({ contractUuid: itContractUuid })
          .pipe(
            tapResponse(
              (relations) => this.updateSystemRelations(relations),
              (e) => console.error(e),
              () => this.updateSystemRelationsIsLoading(false)
            )
          );
      })
    )
  );
}
