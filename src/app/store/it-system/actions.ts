import { createActionGroup, emptyProps } from '@ngrx/store';
import {
  APIItSystemResponseDTO,
  APIResourceCollectionPermissionsResponseDTO,
  APIResourcePermissionsResponseDTO,
  APIUpdateItSystemRequestDTO,
} from 'src/app/api/v2';
import { SavedFilterState } from 'src/app/shared/components/filter-options-button/filter-options-button.component';
import { ExternalReferenceProperties } from 'src/app/shared/models/external-references/external-reference-properties.model';
import { GridColumn } from 'src/app/shared/models/grid-column.model';
import { GridState } from 'src/app/shared/models/grid-state.model';
import { ITSystem } from 'src/app/shared/models/it-system/it-system.model';

export const ITSystemActions = createActionGroup({
  source: 'ITSystem',
  events: {
    'Get IT System': (systemUuid: string) => ({ systemUuid }),
    'Get IT System Success ': (itSystem: APIItSystemResponseDTO) => ({ itSystem }),
    'Get IT System Error': emptyProps(),
    'Get IT Systems': (odataString: string) => ({ odataString }),
    'Get IT Systems Success ': (itSystems: ITSystem[], total: number) => ({ itSystems, total }),
    'Get IT Systems Error': emptyProps(),

    'Update Grid State': (gridState: GridState) => ({ gridState }),
    'Update Grid Columns': (gridColumns: GridColumn[]) => ({ gridColumns }),
    'Update Grid Columns Success': (gridColumns: GridColumn[]) => ({ gridColumns }),

    'Get IT System Permissions': (systemUuid: string) => ({ systemUuid }),
    'Get IT System Permissions Success ': (permissions?: APIResourcePermissionsResponseDTO) => ({
      permissions,
    }),
    'Get IT System Permissions Error': emptyProps(),

    'Get IT System Collection Permissions': emptyProps(),
    'Get IT System Collection Permissions Success ': (
      collectionPermissions?: APIResourceCollectionPermissionsResponseDTO
    ) => ({
      collectionPermissions,
    }),
    'Get IT System Collection Permissions Error': emptyProps(),

    'Delete IT System': emptyProps(),
    'Delete IT System Success': emptyProps(),
    'Delete IT System Error': emptyProps(),

    'Patch IT System': (
      itSystem: APIUpdateItSystemRequestDTO,
      customSuccessText?: string,
      customErrorText?: string
    ) => ({
      itSystem,
      customSuccessText,
      customErrorText,
    }),
    'Patch IT System Success ': (itSystem: APIItSystemResponseDTO, customSuccessText?: string) => ({
      itSystem,
      customSuccessText,
    }),
    'Patch IT System Error': (customErrorText?: string) => ({ customErrorText }),
    'Remove External Reference': (referenceUuid: string) => ({ referenceUuid }),
    'Remove External Reference Success': (itSystem: APIItSystemResponseDTO) => ({ itSystem }),
    'Remove External Reference Error': () => emptyProps(),
    'Add External Reference': (externalReference: ExternalReferenceProperties) => ({ externalReference }),
    'Add External Reference Success': (itSystem: APIItSystemResponseDTO) => ({ itSystem }),
    'Add External Reference Error': () => emptyProps(),
    'Edit External Reference': (referenceUuid: string, externalReference: ExternalReferenceProperties) => ({
      referenceUuid,
      externalReference,
    }),
    'Edit External Reference Success': (itSystem: APIItSystemResponseDTO) => ({ itSystem }),
    'Edit External Reference Error': () => emptyProps(),

    'Create It System': (name: string, openAfterCreate: boolean) => ({ name, openAfterCreate }),
    'Create It System Success': (uuid: string, openAfterCreate: boolean) => ({ uuid, openAfterCreate }),
    'Create It System Error': emptyProps(),

    'Save IT System Filter': (localStoreKey: string) => ({ localStoreKey }),
    'Apply IT System Filter': (state: SavedFilterState) => ({ state }),
    'IT System Filter Change Done': emptyProps(),
  },
});
