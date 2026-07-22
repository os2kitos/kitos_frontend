import { Injectable } from '@angular/core';
import { ComponentStore } from '@ngrx/component-store';
import { tapResponse } from '@ngrx/operators';
import { switchMap, tap } from 'rxjs';
import { APIUserReferenceResponseDTO, GlobalUserInternalV2Service } from 'src/app/api/v2';
import { ShallowUser, toShallowUser } from 'src/app/shared/models/userV2.model';

interface State {
  systemIntegrators: ShallowUser[];
  loading: boolean;
}

@Injectable()
export class SystemIntegratorComponentStore extends ComponentStore<State> {
  constructor(private readonly userApiService: GlobalUserInternalV2Service) {
    super({ systemIntegrators: [], loading: false });
  }

  public readonly systemIntegrators$ = this.select((state) => state.systemIntegrators);
  public readonly loading$ = this.select((state) => state.loading);

  private readonly setLoading = this.updater((state, loading: boolean): State => ({ ...state, loading }));

  private readonly setSystemIntegrators = this.updater(
    (state, systemIntegrators: ShallowUser[]): State => ({
      ...state,
      systemIntegrators,
      loading: false,
    }),
  );

  public readonly getSystemIntegrators = this.effect<void>((trigger$) =>
    trigger$.pipe(
      tap(() => this.setLoading(true)),
      switchMap(() =>
        this.userApiService.getManyGlobalUserInternalV2GetSystemIntegrators().pipe(
          tapResponse({
            next: (response: APIUserReferenceResponseDTO[]) => this.setSystemIntegrators(response.map(toShallowUser)),
            error: (e) => {
              console.error(e);
            },
            complete: () => this.setLoading(false),
          }),
        ),
      ),
    ),
  );
}
