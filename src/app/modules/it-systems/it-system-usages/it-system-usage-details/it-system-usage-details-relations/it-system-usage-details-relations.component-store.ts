import { Injectable } from '@angular/core';
import { ComponentStore, tapResponse } from '@ngrx/component-store';
import { concatLatestFrom } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { Observable, mergeMap, tap } from 'rxjs';
import {
  APIIdentityNamePairResponseDTO,
  APIIncomingSystemRelationResponseDTO,
  APIOutgoingSystemRelationResponseDTO,
  APIV2ItSystemUsageService,
} from 'src/app/api/v2';
import { BOUNDED_PAGINATION_QUERY_MAX_SIZE } from 'src/app/shared/constants';
import { filterNullish } from 'src/app/shared/pipes/filter-nullish';
import { selectOrganizationUuid } from 'src/app/store/user-store/selectors';
import { SystemRelationModel } from './relation-table/relation-table.component';

interface State {
  loading: boolean;
  incomingRelations?: Array<SystemRelationModel>;
  usagesLoading: boolean;
  systemUsages?: Array<APIIdentityNamePairResponseDTO>;
}
@Injectable()
export class ItSystemUsageDetailsRelationsComponentStore extends ComponentStore<State> {
  public readonly PAGE_SIZE = BOUNDED_PAGINATION_QUERY_MAX_SIZE;

  public readonly incomingRelations$ = this.select((state) => state.incomingRelations).pipe(filterNullish());
  public readonly isIncomingRelationsLoading$ = this.select((state) => state.loading).pipe(filterNullish());

  public readonly systemUsages$ = this.select((state) => state.systemUsages).pipe(filterNullish());
  public readonly isSystemUsagesLoading$ = this.select((state) => state.usagesLoading).pipe(filterNullish());

  constructor(private readonly store: Store, private readonly apiUsageService: APIV2ItSystemUsageService) {
    super({ loading: false, usagesLoading: false });
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

  private updateSystemUsages = this.updater(
    (state, systemUsages: Array<APIIdentityNamePairResponseDTO>): State => ({
      ...state,
      systemUsages,
    })
  );

  private updateSystemUsagesIsLoading = this.updater(
    (state, usagesLoading: boolean): State => ({
      ...state,
      usagesLoading,
    })
  );

  public getIncomingRelations = this.effect((systemUsageUuid$: Observable<string>) =>
    systemUsageUuid$.pipe(
      mergeMap((systemUsageUuid) => {
        this.updateIncomingRelationsIsLoading(true);
        return this.apiUsageService.getManyItSystemUsageV2GetIncomingSystemRelations({ systemUsageUuid }).pipe(
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

  public getItSystemUsages = this.effect((search$: Observable<string | undefined>) =>
    search$.pipe(
      tap(() => this.updateSystemUsagesIsLoading(true)),
      concatLatestFrom(() => this.store.select(selectOrganizationUuid).pipe(filterNullish())),
      mergeMap(([search, organizationUuid]) => {
        return this.apiUsageService
          .getManyItSystemUsageV2GetItSystemUsages({
            organizationUuid: organizationUuid,
            systemNameContent: search,
            pageSize: this.PAGE_SIZE,
          })
          .pipe(
            tapResponse(
              (usages) =>
                this.updateSystemUsages(usages.map((usage) => ({ name: usage.systemContext.name, uuid: usage.uuid }))),
              (error) => console.error(error),
              () => this.updateSystemUsagesIsLoading(false)
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
