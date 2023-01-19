import { Injectable } from '@angular/core';
import { ComponentStore, tapResponse } from '@ngrx/component-store';
import { Observable, switchMap, tap } from 'rxjs';
import { APIPublicMessagesResponseDTO, APIV2PublicMessagesINTERNALService } from 'src/app/api/v2';

interface FrontpageComponentStoreState {
  loading: boolean;
  text: APIPublicMessagesResponseDTO;
}

@Injectable()
export class FrontpageComponentStore extends ComponentStore<FrontpageComponentStoreState> {
  constructor(private apiTextService: APIV2PublicMessagesINTERNALService) {
    super({
      loading: false,
      text: { about: "", contactInfo: "", guides: "", misc: "", statusMessages: "" },
    });
  }

  readonly loading$: Observable<boolean> = this.select((state) => state.loading);
  readonly text$: Observable<APIPublicMessagesResponseDTO> = this.select((state) => state.text);

  readonly updateLoading = this.updater(
    (state, loading: boolean): FrontpageComponentStoreState => ({
      ...state,
      loading,
    })
  );

  readonly updateText = this.updater(
    (state, text: APIPublicMessagesResponseDTO): FrontpageComponentStoreState => ({
      ...state,
      loading: false,
      text,
    })
  );

  readonly getText = this.effect<void>((trigger$) =>
    trigger$.pipe(
      tap(() => this.updateLoading(true)),
      switchMap(() =>
        this.apiTextService.gETPublicMessagesV2Get().pipe(
          tapResponse(
            (response: APIPublicMessagesResponseDTO) =>
              this.updateText(response),
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
