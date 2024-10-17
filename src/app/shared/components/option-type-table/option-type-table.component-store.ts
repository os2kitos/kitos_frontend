import { Injectable } from '@angular/core';
import { ComponentStore } from '@ngrx/component-store';
import { concatLatestFrom, tapResponse } from '@ngrx/operators';
import { Store } from '@ngrx/store';
import { map, Observable, switchMap, tap } from 'rxjs';
import { APILocalRoleOptionResponseDTO } from 'src/app/api/v2';
import { selectOrganizationUuid } from 'src/app/store/user-store/selectors';
import { filterNullish } from '../../pipes/filter-nullish';
import { LocalOptionTypeService } from '../../services/local-option-type.service';
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

  constructor(private readonly store: Store, private localOptionTypeService: LocalOptionTypeService) {
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

  private getOptionItemsObservable(): Observable<APILocalRoleOptionResponseDTO[]> {
    return this.store.select(selectOrganizationUuid).pipe(
      filterNullish(),
      concatLatestFrom(() => this.optionType$),
      switchMap(([organizationUuid, type]) => this.localOptionTypeService.getLocalOptions(organizationUuid, type))
    );
  }

  private mapDtoToOptionType(dto: APILocalRoleOptionResponseDTO): OptionTypeTableItem {
    const item: OptionTypeTableItem = {
      active: dto.isActive ?? false,
      name: dto.name,
      writeAccess: dto.writeAccess,
      description: dto.description,
      uuid: dto.uuid,
      obligatory: dto.isObligatory ?? false,
    };
    return item;
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
