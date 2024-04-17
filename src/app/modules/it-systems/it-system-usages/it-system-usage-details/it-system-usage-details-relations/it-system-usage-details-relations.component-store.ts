import { Injectable } from '@angular/core';
import { ComponentStore, tapResponse } from '@ngrx/component-store';
import { Observable, mergeMap } from 'rxjs';
import {
  APIIdentityNamePairResponseDTO,
  APIIncomingSystemRelationResponseDTO,
  APIOutgoingSystemRelationResponseDTO,
  APIV2ItSystemUsageService,
} from 'src/app/api/v2';
import { BOUNDED_PAGINATION_QUERY_MAX_SIZE } from 'src/app/shared/constants';
import { filterNullish } from 'src/app/shared/pipes/filter-nullish';
import { SystemRelationModel } from './relation-table/relation-table.component';

interface State {
  loading: boolean;
  incomingRelations?: Array<SystemRelationModel>;
}
@Injectable()
export class ItSystemUsageDetailsRelationsComponentStore extends ComponentStore<State> {
  public readonly PAGE_SIZE = BOUNDED_PAGINATION_QUERY_MAX_SIZE;

  public readonly incomingRelations$ = this.select((state) => state.incomingRelations).pipe(filterNullish());
  public readonly isIncomingRelationsLoading$ = this.select((state) => state.loading).pipe(filterNullish());

  constructor(private readonly apiUsageService: APIV2ItSystemUsageService) {
    super({ loading: false });
  }

  private updateIncomingRelations = this.updater(
    (state, incomingRelations: Array<SystemRelationModel>): State => ({
      ...state,
      incomingRelations,
    })
  );

  private updateIncomingRelationsIsLoading = this.updater(
    (state, loading: boolean): State => ({
      ...state,
      loading,
    })
  );
  public getIncomingRelations = this.effect((systemUsageUuid$: Observable<string>) =>
    systemUsageUuid$.pipe(
      mergeMap((systemUsageUuid) => {
        this.updateIncomingRelationsIsLoading(true);
        return this.apiUsageService
          .getManyItSystemUsageV2GetIncomingSystemRelationsBySystemusageuuid({ systemUsageUuid })
          .pipe(
            tapResponse(
              (relations) =>
                this.updateIncomingRelations(
                  relations.map((relation) =>
                    this.mapRelationResponseDTOToSystemRelationModel(relation, relation.fromSystemUsage)
                  )
                ),
              (e) => console.error(e),
              () => this.updateIncomingRelationsIsLoading(false)
            )
          );
      })
    )
  );

  public mapRelationResponseDTOToSystemRelationModel(
    relation: APIOutgoingSystemRelationResponseDTO | APIIncomingSystemRelationResponseDTO,
    relationSystemUsage: APIIdentityNamePairResponseDTO
  ): SystemRelationModel {
    return {
      uuid: relation.uuid,
      systemUsage: relationSystemUsage,
      relationInterface: relation.relationInterface,
      associatedContract: relation.associatedContract,
      relationFrequency: relation.relationFrequency,
      description: relation.description,
      urlReference: relation.urlReference,
    };
  }
}
