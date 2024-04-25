import { Injectable } from '@angular/core';
import { ComponentStore } from '@ngrx/component-store';
import { APIV2ItContractService } from 'src/app/api/v2';
import { RegistrationEntityTypes } from 'src/app/shared/models/registrations/registration-entity-categories.model';

interface State {
  isLoading: boolean;
  alreadyExists: boolean;
}

export interface NameWithRegistrationEntityTypeDto {
  name: string;
  entityType: RegistrationEntityTypes;
}

@Injectable()
export class CreateEntityWithNameDialogComponentStore extends ComponentStore<State> {
  public readonly isLoading$ = this.select((state) => state.isLoading);
  public readonly alreadyExists$ = this.select((state) => state.alreadyExists);

  constructor(private contractService: APIV2ItContractService) {
    super({ isLoading: false, alreadyExists: false });
  }

  private readonly setLoading = this.updater((state, isLoading: boolean): State => ({ ...state, isLoading }));
  private readonly setAlreadyExists = this.updater(
    (state, alreadyExists: boolean): State => ({ ...state, alreadyExists })
  );

  /* public checkNameAvailability = this.effect((dto$: Observable<NameWithRegistrationEntityTypeDto>) => {
    dto$.pipe(
      tap(() => this.setLoading(true)),
      mergeMap(({name, entityType}) => {
        switch (entityType) {
          case 'it-contract':
            this.contractService.getManyItContractV2GetItContracts({ })
          default:
            throw `Entity of type: ${entityType} is not implemented`;
        }
      })
    );
  }); */
}
