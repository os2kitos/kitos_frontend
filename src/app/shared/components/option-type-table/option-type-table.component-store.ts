import { Injectable } from '@angular/core';
import { ComponentStore } from '@ngrx/component-store';
import { concatLatestFrom, tapResponse } from '@ngrx/operators';
import { Store } from '@ngrx/store';
import { map, Observable, switchMap, tap } from 'rxjs';
import { APIRoleOptionResponseDTO } from 'src/app/api/v2';
import { selectOrganizationUuid } from 'src/app/store/user-store/selectors';
import { RegularOptionType } from '../../models/options/regular-option-types.model';
import { RoleOptionTypes } from '../../models/options/role-option-types.model';
import { filterNullish } from '../../pipes/filter-nullish';
import { RegularOptionTypeServiceService } from '../../services/regular-option-type-service.service';
import { RoleOptionTypeService } from '../../services/role-option-type.service';
import { OptionTypeTableItem, OptionTypeTableOption } from './option-type-table.component';

interface State {
  isLoading: boolean;
  optionTypeItems: OptionTypeTableItem[];
  type: OptionTypeTableOption;
}

@Injectable()
export class OptionTypeTableComponentStore extends ComponentStore<State> {
  public readonly optionTypeItems$ = this.select((state) => state.optionTypeItems);
  public readonly optionType$ = this.select((state) => state.type);
  public readonly isLoading$ = this.select((state) => state.isLoading);

  constructor(
    private readonly store: Store,
    private roleOptionTypeService: RoleOptionTypeService,
    private regularOptionTypeService: RegularOptionTypeServiceService
  ) {
    super();
  }

  private updateItems = this.updater(
    (state: State, optionTypeItems: OptionTypeTableItem[]): State => ({
      ...state,
      optionTypeItems: optionTypeItems,
    })
  );

  private updateIsLoading = this.updater(
    (state: State, loading: boolean): State => ({
      ...state,
      isLoading: loading,
    })
  );

  private getOptionItemsObservable(): Observable<APIRoleOptionResponseDTO[]> {
    return this.store.select(selectOrganizationUuid).pipe(
      filterNullish(),
      concatLatestFrom(() => this.optionType$),
      switchMap(([organizationUuid, type]) => {
        if (this.isRoleOptionType(type)) {
          return this.roleOptionTypeService.getAvailableOptions(organizationUuid, type as RoleOptionTypes);
        } else {
          return this.regularOptionTypeService.getAvailableOptions(organizationUuid, type as RegularOptionType);
        }
      })
    );
  }

  private mapDtoToOptionType(dto: APIRoleOptionResponseDTO): OptionTypeTableItem {
    const item: OptionTypeTableItem = {
      active: true,
      name: dto.name,
      writeAccess: dto.writeAccess ?? false,
      description: dto.description,
      uuid: dto.uuid,
      obligatory: false,
    };
    return item;
  }

  private isRoleOptionType(type: OptionTypeTableOption): boolean {
    return (
      type === 'organization-unit' || type === 'it-system-usage' || type === 'it-contract' || type === 'data-processing'
    );
  }

  public getOptionTypeItems = this.effect<void>((trigger$) =>
    trigger$.pipe(
      tap(() => this.updateIsLoading(true)),
      switchMap(() =>
        this.getOptionItemsObservable().pipe(
          map((items) => items.map(this.mapDtoToOptionType)),
          tapResponse(
            (mappedItems) => {
              this.updateItems(mappedItems);
              this.updateIsLoading(false);
            },
            (error) => {
              console.error(error);
              this.updateIsLoading(false);
            }
          )
        )
      )
    )
  );
}
