import { EntityDataModuleConfig, EntityMetadataMap } from '@ngrx/data';

const entityMetadata: EntityMetadataMap = {
  Organization: {
    selectId: (organization) => organization.uuid,
  },
};

const pluralNames = {};

export const entityConfig: EntityDataModuleConfig = {
  entityMetadata,
  pluralNames,
};
