import { Injectable } from '@angular/core';
import { ComponentStore } from '@ngrx/component-store';
import { concatLatestFrom, tapResponse } from '@ngrx/operators';
import { Store } from '@ngrx/store';
import { mergeMap, Observable, of, tap } from 'rxjs';
import { selectOrganizationUuid } from 'src/app/store/user-store/selectors';
import { filterNullish } from '../../pipes/filter-nullish';
import { ChoiceTypeTableItem } from './choice-type-table.component';

interface State {
  loading: boolean;
  choiceTypeItems: ChoiceTypeTableItem[];
}

@Injectable()
export class ChoiceTypeTableComponentStore extends ComponentStore<State> {
  public readonly choiceTypeItems$ = this.select((state) => state.choiceTypeItems);
  public readonly loading$ = this.select((state) => state.loading);

  constructor(private readonly store: Store) {
    super({ loading: false, choiceTypeItems: [] });
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
        description: 'Dette er en rolle',
        id: 0,
        uuid: 'uuid1',
        obligatory: true,
      },
      {
        active: false,
        name: 'En anden rolle',
        writeAccess: true,
        description: 'Dette er en anden rolle',
        id: 1,
        uuid: 'uuid2',
        obligatory: true,
      },
      {
        active: true,
        name: 'Et meget meget meget meget meget meget meget langt navn',
        writeAccess: true,
        description: 'Dette er en meget meget meget meget meget meget meget lang beskrivelse',
        id: 2,
        uuid: 'uuid3',
        obligatory: true,
      },
    ];
  }

  public getChoiceTypeItems = this.effect((search$: Observable<string | undefined>) =>
    search$.pipe(
      tap(() => this.updateIsLoading(true)),
      concatLatestFrom(() => this.store.select(selectOrganizationUuid).pipe(filterNullish())),
      //TODO: Remove the line below
      //eslint-disable-next-line @typescript-eslint/no-unused-vars
      mergeMap(([search, organziationUuid]) =>
        of(this.mockData()).pipe(
          //TODO: Replace this with the actual API call
          tapResponse(
            (items) => this.updateItems(items),
            (error) => console.error(error),
            () => this.updateIsLoading(false)
          )
        )
      )
    )
  );
}
