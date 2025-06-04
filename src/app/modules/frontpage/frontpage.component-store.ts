import { Inject, Injectable } from '@angular/core';
import { ComponentStore } from '@ngrx/component-store';
import { tapResponse } from '@ngrx/operators';

import { switchMap, tap } from 'rxjs';
import { APIPublicMessageResponseDTO, APIV2PublicMessagesINTERNALService } from 'src/app/api/v2';
import { adaptPublicMessage, PublicMessage } from 'src/app/shared/models/public-messages/public-message.model';

interface FrontpageComponentStoreState {
  loading: boolean;
  publicMessages?: PublicMessage[];
}

@Injectable({ providedIn: 'any' })
export class FrontpageComponentStore extends ComponentStore<FrontpageComponentStoreState> {
  public readonly loading$ = this.select((state) => state.loading);
  public readonly publicMessages$ = this.select((state) => state.publicMessages);

  constructor(@Inject(APIV2PublicMessagesINTERNALService) private apiTextService: APIV2PublicMessagesINTERNALService) {
    super({
      loading: false,
    });
  }

  private updateLoading = this.updater(
    (state, loading: boolean): FrontpageComponentStoreState => ({
      ...state,
      loading,
    }),
  );

  private updatePublicMessages = this.updater(
    (state, publicMessages: PublicMessage[]): FrontpageComponentStoreState => ({
      ...state,
      loading: false,
      publicMessages,
    }),
  );

  public getPublicMessages = this.effect<void>((trigger$) =>
    trigger$.pipe(
      tap(() => this.updateLoading(true)),
      switchMap(() =>
        this.apiTextService.getManyPublicMessagesV2Get().pipe(
          tapResponse(
            (response: APIPublicMessageResponseDTO[]) => this.updatePublicMessages(response.map(adaptPublicMessage)),
            (e) => {
              console.error(e);
            },
            () => this.updateLoading(false),
          ),
        ),
      ),
    ),
  );
}
