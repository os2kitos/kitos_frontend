import { Injectable, OnDestroy } from "@angular/core";
import { ComponentStore, tapResponse } from "@ngrx/component-store";
import { mergeMap, Observable } from 'rxjs';
import { APIItInterfaceResponseDTO, APIV2ItInterfaceService } from "src/app/api/v2";
import { filterNullish } from "src/app/shared/pipes/filter-nullish";

interface State{
  itInterfaces?: Array<APIItInterfaceResponseDTO>;
}

@Injectable()
export class ItSystemInterfacesTableComponentStore extends ComponentStore<State> implements OnDestroy{
  public readonly itInterfaces$ = this
    .select((state) => state.itInterfaces)
    .pipe(filterNullish());

  constructor(private apiInterfaceService: APIV2ItInterfaceService){
    super({});
  }

  private updateInterfaces = this.updater(
    (state, itInterfaces: Array<APIItInterfaceResponseDTO>): State => ({
      ...state,
      itInterfaces
    })
  );

  public getInterfacesExposedBySystemWithUuid = this.effect((itSystemUuid$: Observable<string>) =>
    itSystemUuid$.pipe(
      mergeMap((systemUuid) =>
        this.apiInterfaceService.gETItInterfaceV2GetItInterfacesBoundedPaginationQueryPaginationNullable1IncludeDeactivatedNullable1ChangedSinceGtEqNullable1ExposedBySystemUuidNullable1OrganizationUuidNullable1UsedInOrganizationUuidStringInterfaceIdStringNameContainsStringNameEquals(
          systemUuid,
          true
        ).pipe(
          tapResponse(
            (itInterfaces) => this.updateInterfaces(itInterfaces),
            (e) => console.error(e)
          )
        )
      )
    )
  );
}
