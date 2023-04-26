import { Injectable } from '@angular/core';
import { ComponentStore, tapResponse } from '@ngrx/component-store';
import { concatLatestFrom } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { Observable, mergeMap, tap } from 'rxjs';
import {
  APIIdentityNamePairResponseDTO,
  APIIncomingSystemRelationResponseDTO,
  APIItContractResponseDTO,
  APIItInterfaceResponseDTO,
  APIOutgoingSystemRelationResponseDTO,
  APIV2ItContractService,
  APIV2ItInterfaceService,
  APIV2ItSystemUsageService,
} from 'src/app/api/v2';
import { BOUNDED_PAGINATION_QUERY_MAX_SIZE } from 'src/app/shared/constants';
import { filterNullish } from 'src/app/shared/pipes/filter-nullish';
import { selectItSystemUsageUuid } from 'src/app/store/it-system-usage/selectors';
import { selectOrganizationUuid } from 'src/app/store/user-store/selectors';
import { SystemRelationModel } from './relation-table/relation-table.component';

interface State {
  loading: boolean;
  incomingRelations?: Array<SystemRelationModel>;
  usagesLoading: boolean;
  systemUsages?: Array<IdentityNamePairWithSystemUuid>;
  interfacesLoading: boolean;
  interfaces?: Array<APIItInterfaceResponseDTO>;
  contractsLoading: boolean;
  contracts?: Array<APIItContractResponseDTO>;
}
interface IdentityNamePairWithSystemUuid {
  uuid: string;
  name: string;
  systemUuid: string;
}
@Injectable()
export class ItSystemUsageDetailsRelationsComponentStore extends ComponentStore<State> {
  public readonly PAGE_SIZE = BOUNDED_PAGINATION_QUERY_MAX_SIZE;

  public readonly incomingRelations$ = this.select((state) => state.incomingRelations).pipe(filterNullish());
  public readonly isIncomingRelationsLoading$ = this.select((state) => state.loading).pipe(filterNullish());

  public readonly systemUsages$ = this.select((state) => state.systemUsages).pipe(filterNullish());
  public readonly isSystemUsagesLoading$ = this.select((state) => state.usagesLoading).pipe(filterNullish());

  public readonly contracts$ = this.select((state) => state.contracts).pipe(filterNullish());
  public readonly contractsLoading$ = this.select((state) => state.contractsLoading).pipe(filterNullish());

  public readonly interfaces$ = this.select((state) => state.interfaces).pipe(filterNullish());
  public readonly interfacesLoading$ = this.select((state) => state.contractsLoading).pipe(filterNullish());

  constructor(
    private readonly store: Store,
    private readonly apiUsageService: APIV2ItSystemUsageService,
    private readonly apiInterfaceService: APIV2ItInterfaceService,
    private readonly apiContractService: APIV2ItContractService
  ) {
    super({ loading: false, usagesLoading: false, interfacesLoading: false, contractsLoading: false });
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
    (state, systemUsages: Array<IdentityNamePairWithSystemUuid>): State => ({
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

  private updateInterfaces = this.updater(
    (state, interfaces: Array<APIItInterfaceResponseDTO>): State => ({
      ...state,
      interfaces,
    })
  );

  private updateInterfacesIsLoading = this.updater(
    (state, interfacesListIsLoading: boolean): State => ({
      ...state,
      interfacesLoading: interfacesListIsLoading,
    })
  );

  private updateContracts = this.updater(
    (state, contracts: Array<APIItContractResponseDTO>): State => ({
      ...state,
      contracts,
    })
  );

  private updateContractsIsLoading = this.updater(
    (state, contractsListIsLoading: boolean): State => ({
      ...state,
      contractsLoading: contractsListIsLoading,
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
      concatLatestFrom(() => [
        this.store.select(selectOrganizationUuid).pipe(filterNullish()),
        this.store.select(selectItSystemUsageUuid),
      ]),
      mergeMap(([search, organizationUuid, currentUsageUuid]) => {
        return this.apiUsageService
          .getManyItSystemUsageV2GetItSystemUsages({
            organizationUuid: organizationUuid,
            systemNameContent: search,
            pageSize: this.PAGE_SIZE,
          })
          .pipe(
            tapResponse(
              (usages) =>
                this.updateSystemUsages(
                  usages
                    .filter((usage) => usage.uuid != currentUsageUuid)
                    .map((usage) => ({
                      name: usage.systemContext.name,
                      uuid: usage.uuid,
                      systemUuid: usage.systemContext.uuid,
                    }))
                ),
              (error) => console.error(error),
              () => this.updateSystemUsagesIsLoading(false)
            )
          );
      })
    )
  );

  public getItInterfaces = this.effect((params$: Observable<{ systemUuid: string; search: string | undefined }>) =>
    params$.pipe(
      tap(() => this.updateInterfacesIsLoading(true)),
      mergeMap((params) => {
        return this.apiInterfaceService
          .getManyItInterfaceV2GetItInterfaces({
            nameContains: params.search,
            exposedBySystemUuid: params.systemUuid,
            includeDeactivated: true,
          })
          .pipe(
            tapResponse(
              (interfaces) => this.updateInterfaces(interfaces),
              (error) => console.error(error),
              () => this.updateIncomingRelationsIsLoading(false)
            )
          );
      })
    )
  );

  public getItContracts = this.effect((search$: Observable<string | undefined>) =>
    search$.pipe(
      tap(() => this.updateContractsIsLoading(true)),
      concatLatestFrom(() => this.store.select(selectOrganizationUuid).pipe(filterNullish())),
      mergeMap(([search, organizationUuid]) => {
        return this.apiContractService
          .getManyItContractV2GetItContracts({
            nameContent: search,
            organizationUuid: organizationUuid,
          })
          .pipe(
            tapResponse(
              (contracts) => this.updateContracts(contracts),
              (error) => console.error(error),
              () => this.updateContractsIsLoading(false)
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
