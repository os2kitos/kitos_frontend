import { Inject, Injectable } from '@angular/core';
import { ComponentStore, tapResponse } from '@ngrx/component-store';
import { Observable, mergeMap, tap } from 'rxjs';
import {
  APIV2DataProcessingRegistrationService,
  APIV2ItContractService,
  APIV2ItInterfaceService,
  APIV2ItSystemInternalINTERNALService,
} from 'src/app/api/v2';
import { RegistrationEntityTypes } from 'src/app/shared/models/registrations/registration-entity-categories.model';

interface State {
  isLoading: boolean;
  alreadyExists: boolean;
}

export interface NameWithRegistrationEntityTypeDto {
  searchObject: { nameEquals?: string; extraSearchParameter?: string };
  entityType: RegistrationEntityTypes;
}

@Injectable()
export class CreateEntityDialogComponentStore extends ComponentStore<State> {
  public readonly isLoading$ = this.select((state) => state.isLoading);
  public readonly alreadyExists$ = this.select((state) => state.alreadyExists);

  constructor(
    @Inject(APIV2ItContractService)
    private contractService: APIV2ItContractService,
    @Inject(APIV2ItSystemInternalINTERNALService)
    private systemService: APIV2ItSystemInternalINTERNALService,
    @Inject(APIV2ItInterfaceService)
    private interfaceService: APIV2ItInterfaceService,
    @Inject(APIV2DataProcessingRegistrationService)
    private dataProcessingService: APIV2DataProcessingRegistrationService
  ) {
    super({ isLoading: false, alreadyExists: false });
  }

  private readonly setLoading = this.updater((state, isLoading: boolean): State => ({ ...state, isLoading }));
  private readonly setAlreadyExists = this.updater(
    (state, length: number): State => ({ ...state, alreadyExists: length > 0 })
  );

  public checkNameAvailability = this.effect((dto$: Observable<NameWithRegistrationEntityTypeDto>) =>
    dto$.pipe(
      tap(() => this.setLoading(true)),
      mergeMap(({ searchObject, entityType }) => {
        switch (entityType) {
          case 'it-contract':
            return this.contractService.getManyItContractV2GetItContracts({ nameEquals: searchObject.nameEquals }).pipe(
              tapResponse(
                (contracts) => this.setAlreadyExists(contracts.length),
                (e) => console.error(e),
                () => this.setLoading(false)
              )
            );
          case 'it-system':
            return this.systemService
              .getManyItSystemInternalV2GetItSystems({ nameEquals: searchObject.nameEquals })
              .pipe(
                tapResponse(
                  (systems) => this.setAlreadyExists(systems.length),
                  (e) => console.error(e),
                  () => this.setLoading(false)
                )
              );
          case 'it-interface': {
            const request: { nameEquals?: string; interfaceId?: string } = { nameEquals: searchObject.nameEquals };
            if (searchObject.extraSearchParameter) {
              request.interfaceId = searchObject.extraSearchParameter;
            }
            return this.interfaceService.getManyItInterfaceV2GetItInterfaces(request).pipe(
              tapResponse(
                (interfaces) => this.setAlreadyExists(interfaces.length),
                (e) => console.error(e),
                () => this.setLoading(false)
              )
            );
          }
          case 'data-processing-registration':
            return this.dataProcessingService
              .getManyDataProcessingRegistrationV2GetDataProcessingRegistrations({
                nameEquals: searchObject.nameEquals,
              })
              .pipe(
                tapResponse(
                  (registrations) => this.setAlreadyExists(registrations.length),
                  (e) => console.error(e),
                  () => this.setLoading(false)
                )
              );
          default:
            throw `Entity of type: ${entityType} is not implemented`;
        }
      })
    )
  );
}
