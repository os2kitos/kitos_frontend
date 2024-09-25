import { createEntityAdapter } from "@ngrx/entity";
import { OrganizationMasterData } from "src/app/shared/models/organization/organization-master-data/organizationMasterData.model";
import { OrganizationMasterDataState } from "./state";
import { createFeature, createReducer, on } from "@ngrx/store";
import { OrganizationMasterDataActions } from "./actions";

export const organizationMasterDataAdapter = createEntityAdapter<OrganizationMasterData>();

export const organizationMasterDataInitialState: OrganizationMasterDataState = organizationMasterDataAdapter.getInitialState({
  organizationMasterData: null
});

export const organizationMasterDataFeature = createFeature({
  name: 'OrganizationMasterData',
  reducer: createReducer(
    organizationMasterDataInitialState,
    on(OrganizationMasterDataActions.getMasterData, (state): OrganizationMasterDataState => state),
    on(OrganizationMasterDataActions.getMasterDataSuccess,
      (state, organizationMasterData ): OrganizationMasterDataState =>
      ({ ...state, organizationMasterData })
    ),
    on(OrganizationMasterDataActions.getMasterDataError,
      (state): OrganizationMasterDataState => ({ ...state, organizationMasterData: null })),
    )
})
