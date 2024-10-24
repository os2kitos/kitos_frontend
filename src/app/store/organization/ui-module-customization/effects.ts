import { Inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { ActionCreator, Store } from '@ngrx/store';
import { catchError, combineLatestWith, concatMap, map, of, switchMap } from 'rxjs';
import {
  APICustomizedUINodeRequestDTO,
  APICustomizedUINodeResponseDTO,
  APIUIModuleCustomizationRequestDTO,
  APIUIModuleCustomizationResponseDTO,
  APIV2OrganizationsInternalINTERNALService,
} from 'src/app/api/v2';
import { UIModuleConfigKey } from 'src/app/shared/enums/ui-module-config-key';
import { adaptUIModuleCustomization } from 'src/app/shared/models/ui-config/ui-module-customization.model';
import { filterNullish } from 'src/app/shared/pipes/filter-nullish';
import { UIConfigService } from 'src/app/shared/services/ui-config.service';
import { selectOrganizationUuid } from '../../user-store/selectors';
import { UIModuleConfigActions } from './actions';
import { UIModuleConfig } from 'src/app/shared/models/ui-config/ui-module-config.model';

@Injectable()
export class UIModuleCustomizationEffects {
  constructor(
    @Inject(APIV2OrganizationsInternalINTERNALService)
    private organizationInternalService: APIV2OrganizationsInternalINTERNALService,
    private actions$: Actions,
    private store: Store,
    private uiConfigService: UIConfigService
  ) {}

  getUIModuleConfig$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(UIModuleConfigActions.getUIModuleConfig),
      combineLatestWith(this.store.select(selectOrganizationUuid).pipe(filterNullish())),
      concatMap(([{ module: moduleName }, organizationUuid]) =>
        this.organizationInternalService
          .getSingleOrganizationsInternalV2GetUIModuleCustomization({ moduleName, organizationUuid })
          .pipe(
            map((uiModuleCustomizationDto) =>
              this.combineBlueprintWithCustomizationDto(
                uiModuleCustomizationDto,
                moduleName,
                UIModuleConfigActions.getUIModuleConfigSuccess
              )
            ),
            catchError(() => of(UIModuleConfigActions.getUIModuleConfigError()))
          )
      )
    );
  });

  putUIModuleCustomization$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(UIModuleConfigActions.putUIModuleCustomization),
      combineLatestWith(this.store.select(selectOrganizationUuid).pipe(filterNullish())),
      concatMap(([{ module: moduleName, updatedNodeRequest }, organizationUuid]) =>
        this.organizationInternalService
          .getSingleOrganizationsInternalV2GetUIModuleCustomization({ moduleName, organizationUuid })
          .pipe(
            switchMap((existingUICustomization) => {
              const requestDto = this.getUIModuleCustomizationUpdateRequestDto(
                existingUICustomization.nodes,
                updatedNodeRequest
              );

              return this.organizationInternalService
                .putSingleOrganizationsInternalV2PutUIModuleCustomization({
                  organizationUuid,
                  moduleName,
                  dto: requestDto,
                })
                .pipe(
                  map((uiModuleCustomizationDto) =>
                    this.combineBlueprintWithCustomizationDto(
                      uiModuleCustomizationDto,
                      moduleName,
                      UIModuleConfigActions.putUIModuleCustomizationSuccess
                    )
                  ),
                  catchError(() => of(UIModuleConfigActions.putUIModuleCustomizationError()))
                );
            }),
            catchError(() => of(UIModuleConfigActions.getUIModuleConfigError()))
          )
      )
    );
  });

  private combineBlueprintWithCustomizationDto<T extends { uiModuleConfig: UIModuleConfig }>(
    uiModuleCustomizationDto: APIUIModuleCustomizationResponseDTO,
    module: UIModuleConfigKey,
    successAction: ActionCreator<string, (props: { uiModuleConfig: UIModuleConfig }) => T>
  ) {
    const uiModuleCustomization = adaptUIModuleCustomization(uiModuleCustomizationDto);
    const moduleCustomizationNodes = uiModuleCustomization?.nodes ?? [];
    const uiModuleConfig = this.uiConfigService.buildUIModuleConfig(moduleCustomizationNodes, module);
    return successAction({
      uiModuleConfig: uiModuleConfig,
    });
  }

  private getUIModuleCustomizationUpdateRequestDto(
    existingNodes: APICustomizedUINodeResponseDTO[],
    updatedNode: APICustomizedUINodeRequestDTO
  ): APIUIModuleCustomizationRequestDTO {
    const rootToUpdate = existingNodes?.find((node) => node.key === updatedNode.key);
    if (!rootToUpdate) {
      return {
        nodes: [updatedNode],
      };
    }

    return this.updateUIModuleCustomizationInRequestDto(existingNodes, updatedNode, rootToUpdate);
  }

  private updateUIModuleCustomizationInRequestDto(
    existingNodes: APICustomizedUINodeResponseDTO[],
    updatedNode: APICustomizedUINodeRequestDTO,
    rootToUpdate: APICustomizedUINodeResponseDTO
  ): APIUIModuleCustomizationRequestDTO {
    const newEnabledState = updatedNode.enabled;
    if (rootToUpdate) {
      rootToUpdate.enabled = newEnabledState;
    }

    const rootToUpdateKey = rootToUpdate?.key;
    if (this.shouldUpdateChildren(rootToUpdateKey, newEnabledState)) {
      const childrenToUpdate = existingNodes.filter((node) =>
        this.uiConfigService.isChildOfTab(rootToUpdateKey!, node.key)
      );
      childrenToUpdate.forEach((c) => (c.enabled = newEnabledState));
    }

    return {
      nodes: existingNodes as APICustomizedUINodeRequestDTO[],
    };
  }

  private shouldUpdateChildren(rootKey: string | undefined, isEnabling: boolean | undefined) {
    return !isEnabling && rootKey && this.uiConfigService.isTab(rootKey);
  }
}
