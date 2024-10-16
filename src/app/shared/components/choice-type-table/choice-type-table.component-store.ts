import { Injectable } from '@angular/core';
import { ComponentStore } from '@ngrx/component-store';
import { concatLatestFrom, tapResponse } from '@ngrx/operators';
import { Store } from '@ngrx/store';
import { map, Observable, switchMap, tap } from 'rxjs';
import {
  APIRoleOptionResponseDTO,
} from 'src/app/api/v2';
import { selectOrganizationUuid } from 'src/app/store/user-store/selectors';
import { filterNullish } from '../../pipes/filter-nullish';
import { ChoiceTypeTableItem, ChoiceTypeTableOption } from './choice-type-table.component';
import { RoleOptionTypeService } from '../../services/role-option-type.service';
import { RegularOptionTypeServiceService } from '../../services/regular-option-type-service.service';
import { RoleOptionTypes } from '../../models/options/role-option-types.model';
import { RegularOptionType } from '../../models/options/regular-option-types.model';

interface State {
  isLoading: boolean;
  choiceTypeItems: ChoiceTypeTableItem[];
  type: ChoiceTypeTableOption;
}

@Injectable()
export class ChoiceTypeTableComponentStore extends ComponentStore<State> {
  public readonly choiceTypeItems$ = this.select((state) => state.choiceTypeItems);
  public readonly type$ = this.select((state) => state.type);
  public readonly isLoading$ = this.select((state) => state.isLoading);

  constructor(
    private readonly store: Store,
    private roleOptionTypeService: RoleOptionTypeService,
    private optionTypeService: RegularOptionTypeServiceService
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
      isLoading: loading,
    })
  );

  private getChoiceItemsObservable(): Observable<APIRoleOptionResponseDTO[]> {
    return this.store.select(selectOrganizationUuid).pipe(
      filterNullish(),
      concatLatestFrom(() => this.type$),
      switchMap(([organizationUuid, type]) => {
        if (this.isRoleOptionType(type)) {
          return this.roleOptionTypeService.getAvailableOptions(organizationUuid, type as RoleOptionTypes);
        } else {
          return this.optionTypeService.getAvailableOptions(organizationUuid, type as RegularOptionType);
        }
      })
    );
  }

  private mapDtoToChoiceType(dto: APIRoleOptionResponseDTO): ChoiceTypeTableItem {
    const item: ChoiceTypeTableItem = {
      active: true,
      name: dto.name,
      writeAccess: dto.writeAccess ?? false,
      description: dto.description,
      uuid: dto.uuid,
      obligatory: false,
    };
    return item;
  }

  private isRoleOptionType(type: ChoiceTypeTableOption): boolean {
    return (
      type === 'organization-unit' || type === 'it-system-usage' || type === 'it-contract' || type === 'data-processing'
    );
  }

  public getChoiceTypeItems = this.effect<void>((trigger$) =>
    trigger$.pipe(
      tap(() => this.updateIsLoading(true)),
      switchMap(() =>
        this.getChoiceItemsObservable().pipe(
          map((items) => items.map(this.mapDtoToChoiceType)),
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
