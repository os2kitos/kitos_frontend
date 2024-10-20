import { Inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { catchError, combineLatestWith, map, of, switchMap } from 'rxjs';
import { APIV2OrganizationsInternalINTERNALService } from 'src/app/api/v2';
import { UIModuleConfigKey } from 'src/app/shared/enums/ui-module-config-key';
import {
  collectUIConfigNodeViewModels as buildUIModuleConfig,
  getItSystemUsageUiBluePrint,
  resolveUIBlueprint,
} from 'src/app/shared/models/helpers/ui-config-helpers';
import { adaptUIModuleCustomization } from 'src/app/shared/models/ui-config/ui-module-customization.model';
import { filterNullish } from 'src/app/shared/pipes/filter-nullish';
import { selectOrganizationUuid } from '../../user-store/selectors';
import { UIModuleConfigActions } from './actions';

@Injectable()
export class UIModuleCustomizationEffects {
  constructor(
    @Inject(APIV2OrganizationsInternalINTERNALService)
    private organizationInternalService: APIV2OrganizationsInternalINTERNALService,
    private actions$: Actions,
    private store: Store
  ) {}

  getUIModuleConfig$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(UIModuleConfigActions.getUIModuleCustomization),
      combineLatestWith(this.store.select(selectOrganizationUuid).pipe(filterNullish())),
      switchMap(([{ module: moduleName }, organizationUuid]) =>
        this.organizationInternalService
          .getSingleOrganizationsInternalV2GetUIModuleCustomization({ moduleName, organizationUuid })
          .pipe(
            map((uiModuleCustomizationDto) => {
              const uiModuleCustomization = adaptUIModuleCustomization(uiModuleCustomizationDto);
              const moduleCustomizationNodes = uiModuleCustomization?.nodes ?? [];
              const blueprint = resolveUIBlueprint(moduleName)
              const itSystemUsagesUIModuleConfig = buildUIModuleConfig(blueprint, moduleCustomizationNodes, moduleName);
              return UIModuleConfigActions.getUIModuleCustomizationSuccess({
                uiModuleConfig: itSystemUsagesUIModuleConfig,
              });
            }),
            catchError(() => of(UIModuleConfigActions.getUIModuleCustomizationError()))
          )
      )
    );
  });

  putUIModuleCustomization$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(UIModuleConfigActions.putUIModuleCustomization),
      combineLatestWith(this.store.select(selectOrganizationUuid).pipe(filterNullish())),
      switchMap(([{ module: moduleName, request }, organizationUuid]) =>
        this.organizationInternalService
          .putSingleOrganizationsInternalV2PutUIModuleCustomization({
            organizationUuid,
            moduleName,
            dto: request,
          })
          .pipe(
            map((uiModuleCustomizationDto) => {
              const uiModuleCustomization = adaptUIModuleCustomization(uiModuleCustomizationDto);
              const moduleCustomizationNodes = uiModuleCustomization?.nodes ?? [];
              const blueprint = resolveUIBlueprint(moduleName);
              const itSystemUsagesUIModuleConfig = buildUIModuleConfig(blueprint, moduleCustomizationNodes, moduleName);
              return UIModuleConfigActions.getUIModuleCustomizationSuccess({
                uiModuleConfig: itSystemUsagesUIModuleConfig,
              });
            }),
            catchError(() => of(UIModuleConfigActions.getUIModuleCustomizationError()))
          )
      )
    );
  });
}
