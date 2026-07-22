import { Injectable } from '@angular/core';
import { ComponentStore } from '@ngrx/component-store';
import { tapResponse } from '@ngrx/operators';

import { Observable, mergeMap } from 'rxjs';
import { APIItSystemResponseDTO, ItSystemV2Service } from 'src/app/api/v2';

interface State {
  parentSystem?: APIItSystemResponseDTO;
}

@Injectable()
export class ITSystemUsageDetailsFrontpageCatalogComponentStore extends ComponentStore<State> {
  public readonly parentSystem$ = this.select((state) => state.parentSystem);

  constructor(private apiItSystemService: ItSystemV2Service) {
    super({});
  }

  private updateParentSystem = this.updater(
    (state, parentSystem: APIItSystemResponseDTO): State => ({
      ...state,
      parentSystem,
    }),
  );

  public getParentSystem = this.effect((systemUuid$: Observable<string>) =>
    systemUuid$.pipe(
      mergeMap((uuid) =>
        this.apiItSystemService.getSingleItSystemV2GetItSystem({ uuid }).pipe(
          tapResponse({
            next: (parentSystem: APIItSystemResponseDTO) => this.updateParentSystem(parentSystem),
            error: (e) => console.error(e),
          }),
        ),
      ),
    ),
  );
}
