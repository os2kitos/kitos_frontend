import { Inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { concatLatestFrom } from '@ngrx/operators';
import { ActionCreator, Store } from '@ngrx/store';
import { catchError, combineLatestWith, concatMap, map, mergeMap, of, switchMap } from 'rxjs';
import {
  APICustomizedUINodeRequestDTO,
  APICustomizedUINodeResponseDTO,
  APIUIModuleCustomizationRequestDTO,
  APIUIModuleCustomizationResponseDTO,
  APIV2OrganizationsInternalINTERNALService,
} from 'src/app/api/v2';
import { UIModuleConfigKey } from 'src/app/shared/enums/ui-module-config-key';
import { UIModuleConfig } from 'src/app/shared/models/ui-config/ui-module-config.model';
import { adaptUIModuleCustomization } from 'src/app/shared/models/ui-config/ui-module-customization.model';
import { filterNullish } from 'src/app/shared/pipes/filter-nullish';
import { UIConfigService } from 'src/app/shared/services/ui-config-services/ui-config.service';
import { selectOrganizationUuid } from '../../user-store/selectors';
import { UIModuleConfigActions } from './actions';
import { selectHasValidUIModuleConfigCache } from './selectors';

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
      concatLatestFrom(({ module }) => [
        this.store.select(selectOrganizationUuid).pipe(filterNullish()),
        this.store.select(selectHasValidUIModuleConfigCache(module)),
      ]),
      mergeMap(([{ module: moduleName }, organizationUuid, validCache]) => {
        if (validCache) {
          return of(UIModuleConfigActions.resetLoading());
        }
        return this.organizationInternalService
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
          );
      })
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
            map((nodes) => this.addMissingNodes(nodes.nodes, moduleName)),
            switchMap((existingUICustomization) => {
              const requestDto = this.getUIModuleCustomizationUpdateRequestDto(
                existingUICustomization,
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
        nodes: [...existingNodes, updatedNode],
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
    if (this.uiConfigService.isTab(rootToUpdateKey)) {
      return {
        nodes: this.updateChildrenInRequestDto(rootToUpdateKey, newEnabledState, existingNodes),
      };
    } else if (this.uiConfigService.isField(rootToUpdateKey)) {
      const parent = this.findParentNode(rootToUpdateKey, existingNodes)!;
      const children = this.getChildrenOfTab(parent.key, existingNodes);
      if (this.allChildrenHasSameValue(newEnabledState, children)) {
        parent.enabled = newEnabledState;
      }
      return { nodes: existingNodes as APICustomizedUINodeRequestDTO[] };
    } else {
      return { nodes: existingNodes as APICustomizedUINodeRequestDTO[] };
    }
  }

  private updateChildrenInRequestDto(
    rootToUpdateKey: string,
    newState: boolean | undefined,
    existingNodes: APICustomizedUINodeResponseDTO[]
  ): APICustomizedUINodeRequestDTO[] {
    return existingNodes.map((node) => {
      if (this.uiConfigService.isChildOfTab(rootToUpdateKey, node.key)) {
        return { ...node, enabled: newState };
      }
      return node;
    }) as APICustomizedUINodeRequestDTO[];
  }

  private findParentNode(
    fieldKey: string,
    existingNodes: APICustomizedUINodeResponseDTO[]
  ): APICustomizedUINodeResponseDTO | undefined {
    return existingNodes.find((node) => this.uiConfigService.isChildOfTab(node.key, fieldKey));
  }

  private allChildrenHasSameValue(enabled: boolean | undefined, children: APICustomizedUINodeResponseDTO[]): boolean {
    return children.every((child) => child.enabled === enabled);
  }

  private getChildrenOfTab(
    tabKey: string,
    existingNodes: APICustomizedUINodeResponseDTO[]
  ): APICustomizedUINodeResponseDTO[] {
    return existingNodes.filter((node) => this.uiConfigService.isChildOfTab(tabKey, node.key));
  }

  private addMissingNodes(
    response: APICustomizedUINodeResponseDTO[],
    module: UIModuleConfigKey
  ): APICustomizedUINodeResponseDTO[] {
    const allKeys = this.uiConfigService.getAllKeysOfBlueprint(module);
    const existingKeys = new Set(response.map((node) => node.key));
    const missingKeys = allKeys.filter((key) => !existingKeys.has(key));
    const nodesToAdd = missingKeys.map((key) => ({ key, enabled: true }));
    return [...response, ...nodesToAdd];
  }
}
