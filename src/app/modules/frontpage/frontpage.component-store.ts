import { Injectable } from '@angular/core';
import { ComponentStore, tapResponse } from '@ngrx/component-store';
import { Observable, switchMap, tap } from 'rxjs';
import { APITextDTO, APITextDTOIEnumerableApiReturnDTO } from 'src/app/api/v1';
import { APIV1TextService } from 'src/app/api/v1/api/v1Text.service';

interface FrontpageComponentStoreState {
  loading: boolean;
  text: APITextDTO[];
}

@Injectable()
export class FrontpageComponentStore extends ComponentStore<FrontpageComponentStoreState> {
  constructor(private apiTextService: APIV1TextService) {
    super({
      loading: false,
      text: [],
    });
  }

  readonly loading$: Observable<boolean> = this.select((state) => state.loading);
  readonly text$: Observable<APITextDTO[]> = this.select((state) => state.text);

  readonly updateLoading = this.updater(
    (state, loading: boolean): FrontpageComponentStoreState => ({
      ...state,
      loading,
    })
  );

  readonly updateText = this.updater(
    (state, text: APITextDTO[]): FrontpageComponentStoreState => ({
      ...state,
      loading: false,
      text,
    })
  );

  readonly getText = this.effect<void>((trigger$) =>
    trigger$.pipe(
      tap(() => this.updateLoading(true)),
      switchMap(() =>
        this.apiTextService.gETTextGetAllPagingModel1Paging().pipe(
          tapResponse(
            (response: APITextDTOIEnumerableApiReturnDTO) =>
              this.updateText(response.response ? response.response : []),
            (e) => {
              console.error(e);
              this.updateLoading(false);
            }
          )
        )
      )
    )
  );
}
