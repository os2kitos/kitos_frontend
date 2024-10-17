import { Inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { catchError, combineLatestWith, map, of, switchMap } from 'rxjs';
import { APIV2OrganizationsInternalINTERNALService } from 'src/app/api/v2';
import { adaptUIModuleCustomization } from 'src/app/shared/models/ui-customization/ui-module-customization.model';
import { filterNullish } from 'src/app/shared/pipes/filter-nullish';
import { selectOrganizationUuid } from '../../user-store/selectors';
import { OrganizationUiModuleCustomizationActions } from './actions';

@Injectable()
export class OrganizationUIModuleCustomizationEffects {
  constructor(
    @Inject(APIV2OrganizationsInternalINTERNALService)
    private organizationInternalService: APIV2OrganizationsInternalINTERNALService,
    private actions$: Actions,
    private store: Store
  ) {}

  getUIModuleCustomization$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(OrganizationUiModuleCustomizationActions.getUIModuleCustomization),
      combineLatestWith(this.store.select(selectOrganizationUuid).pipe(filterNullish())),
      switchMap(([{ moduleName }, organizationUuid]) =>
        this.organizationInternalService
          .getSingleOrganizationsInternalV2GetUIModuleCustomization({ moduleName, organizationUuid })
          .pipe(
            map((uiModuleCustomizationDto) => {
              const uiModuleCustomization = adaptUIModuleCustomization(uiModuleCustomizationDto);
              if (uiModuleCustomization)
                return OrganizationUiModuleCustomizationActions.getUIModuleCustomizationSuccess({ uiModuleCustomization });
              else return OrganizationUiModuleCustomizationActions.getUIModuleCustomizationError();
            }),
            catchError(() => of(OrganizationUiModuleCustomizationActions.getUIModuleCustomizationError()))
          )
      )
    );
  });

  putUIModuleCustomization$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(OrganizationUiModuleCustomizationActions.putUIModuleCustomization),
      combineLatestWith(this.store.select(selectOrganizationUuid).pipe(filterNullish())),
      switchMap(([{ moduleName, request }, organizationUuid]) =>
        this.organizationInternalService
          .putSingleOrganizationsInternalV2PutUIModuleCustomization({
            organizationUuid,
            moduleName,
            dto: request,
          })
          .pipe(
            map((uiModuleCustomizationDto) => {
              const uiModuleCustomization = adaptUIModuleCustomization(uiModuleCustomizationDto);
              if (uiModuleCustomization)
                return OrganizationUiModuleCustomizationActions.getUIModuleCustomizationSuccess({ uiModuleCustomization });
              else return OrganizationUiModuleCustomizationActions.getUIModuleCustomizationError();
            }),
            catchError(() => of(OrganizationUiModuleCustomizationActions.getUIModuleCustomizationError()))
          )
      )
    );
  });
}
