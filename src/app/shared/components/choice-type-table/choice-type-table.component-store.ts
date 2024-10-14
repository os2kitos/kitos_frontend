import { Injectable } from '@angular/core';
import { ComponentStore } from '@ngrx/component-store';
import { concatLatestFrom, tapResponse } from '@ngrx/operators';
import { Store } from '@ngrx/store';
import { map, Observable, switchMap, tap } from 'rxjs';
import { selectOrganizationUuid } from 'src/app/store/user-store/selectors';
import { filterNullish } from '../../pipes/filter-nullish';
import { ChoiceTypeTableItem, ChoiceTypeTableOption } from './choice-type-table.component';
import {
  APIRoleOptionResponseDTO,
  APIV2DataProcessingRegistrationRoleTypeService,
  APIV2ItContractRoleTypeService,
  APIV2ItSystemUsageRoleTypeService,
  APIV2OrganizationUnitRoleTypeService,
} from 'src/app/api/v2';

interface State {
  loading: boolean;
  choiceTypeItems: ChoiceTypeTableItem[];
  type: ChoiceTypeTableOption;
}

@Injectable()
export class ChoiceTypeTableComponentStore extends ComponentStore<State> {
  public readonly choiceTypeItems$ = this.select((state) => state.choiceTypeItems);
  public readonly type$ = this.select((state) => state.type);
  public readonly loading$ = this.select((state) => state.loading);

  constructor(
    private readonly store: Store,
    private organizationUnitRolesService: APIV2OrganizationUnitRoleTypeService,
    private systemUsageRoleService: APIV2ItSystemUsageRoleTypeService,
    private contractRolesService: APIV2ItContractRoleTypeService,
    private dataprocessingRolesService: APIV2DataProcessingRegistrationRoleTypeService
  ) {
    super();
  }

  private updateItems = this.updater(
    (state: State, choiceTypeItems: ChoiceTypeTableItem[]): State => ({
      ...state,
      choiceTypeItems,
    })
  );

  private updateIsLoading = this.updater(
    (state: State, loading: boolean): State => ({
      ...state,
      loading,
    })
  );

  private mockData(): ChoiceTypeTableItem[] {
    return [
      {
        active: true,
        name: 'En rolle',
        writeAccess: false,
        description: 'Dette er en beskrivelse',
        id: 0,
        uuid: 'uuid1',
        obligatory: false,
      },
      {
        active: false,
        name: 'En anden rolle',
        writeAccess: true,
        description: 'Dette er en anden beskrivelse',
        id: 1,
        uuid: 'uuid2',
        obligatory: false,
      },
      {
        active: true,
        name: 'Et meget meget meget meget meget meget meget langt navn for en rolle',
        writeAccess: true,
        description: 'Dette er en meget meget meget meget meget meget meget lang beskrivelse',
        id: 2,
        uuid: 'uuid3',
        obligatory: false,
      },
      {
        active: true,
        name: 'En obligatorisk rolle',
        writeAccess: true,
        description: 'Denne rolle er obligatorisk',
        id: 3,
        uuid: 'uuid4',
        obligatory: true,
      },
    ];
  }

  private getApiCallByType(
    type: ChoiceTypeTableOption,
    organizationUuid: string
  ): Observable<APIRoleOptionResponseDTO[]> {
    switch (type) {
      case 'it-system-usage':
        return this.systemUsageRoleService.getManyItSystemUsageRoleTypeV2Get({ organizationUuid });
      case 'it-contract':
        return this.contractRolesService.getManyItContractRoleTypeV2Get({ organizationUuid });
      case 'data-processing':
        return this.dataprocessingRolesService.getManyDataProcessingRegistrationRoleTypeV2Get({ organizationUuid });
      case 'organization-unit':
        return this.organizationUnitRolesService.getManyOrganizationUnitRoleTypeV2Get({ organizationUuid });
      default:
        throw new Error(`This component does not support entity type: ${type}`);
    }
  }

  private getChoiceItemsObservable(): Observable<APIRoleOptionResponseDTO[]> {
    return this.store.select(selectOrganizationUuid).pipe(
      filterNullish(),
      concatLatestFrom(() => this.type$),
      switchMap(([organizationUuid, type]) => this.getApiCallByType(type, organizationUuid))
    );
  }

  private mapDtoToChoiceType(dto: APIRoleOptionResponseDTO): ChoiceTypeTableItem {
    const item: ChoiceTypeTableItem = {
      active: true,
      name: dto.name,
      writeAccess: dto.writeAccess ?? false,
      description: dto.description,
      id: 0, //TODO: Should ID be removed from the interface?
      uuid: dto.uuid,
      obligatory: false,
    };
    return item;
  }

  public getChoiceTypeItems = this.effect<void>((trigger$) =>
    trigger$.pipe(
      tap(() => this.updateIsLoading(true)),
      switchMap(() =>
        this.getChoiceItemsObservable().pipe(
          map((items) => items.map(this.mapDtoToChoiceType)),
          tapResponse(
            (mappedItems) => this.updateItems(mappedItems),
            (error) => console.error(error),
            () => this.updateIsLoading(false)
          )
        )
      )
    )
  );
}
