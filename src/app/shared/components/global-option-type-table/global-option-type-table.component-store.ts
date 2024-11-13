import { Injectable } from '@angular/core';
import { ComponentStore } from '@ngrx/component-store';
import { tapResponse } from '@ngrx/operators';
import { Store } from '@ngrx/store';
import { map, Observable, switchMap, tap } from 'rxjs';
import { APIGlobalRoleOptionResponseDTO } from 'src/app/api/v2';
import {
  adaptGlobalAdminOptionType,
  GlobalAdminOptionType,
  GlobalAdminOptionTypeItem,
} from '../../models/options/global-admin-option-type.model';
import { GlobalAdminOptionTypeService } from '../../services/global-admin-option-type.service';

interface State {
  isLoading: boolean;
  optionTypeItems: GlobalAdminOptionTypeItem[];
  type: GlobalAdminOptionType;
}

@Injectable()
export class GlobalOptionTypeTableComponentStore extends ComponentStore<State> {
  public readonly optionTypeItems$ = this.select((state) => state.optionTypeItems);
  public readonly optionType$ = this.select((state) => state.type);
  public readonly isLoading$ = this.select((state) => state.isLoading);

  constructor(private readonly store: Store, private globalOptionTypeService: GlobalAdminOptionTypeService) {
    super();
  }

  public getOptionTypeItems = this.effect<void>((trigger$) =>
    trigger$.pipe(
      tap(() => this.updateIsLoading(true)),
      switchMap(() =>
        this.getOptionItems$().pipe(
          map((items) => items.map(adaptGlobalAdminOptionType)),
          tapResponse(
            (mappedItems) => {
              this.sortByPriority(mappedItems);
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

  private sortByPriority(items: GlobalAdminOptionTypeItem[]) {
    items.sort((a, b) => b.priority - a.priority);
  }

  private getOptionItems$(): Observable<APIGlobalRoleOptionResponseDTO[]> {
    return this.optionType$.pipe(switchMap((type) => this.globalOptionTypeService.getGlobalOptions(type)));
  }

  private updateItems = this.updater(
    (state: State, optionTypeItems: GlobalAdminOptionTypeItem[]): State => ({
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
}
