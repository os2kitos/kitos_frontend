import { APIStsOrganizationChangeLogOriginOption, APIUserReferenceResponseDTO } from 'src/app/api/v2';
import { FkOrganizationUnit } from './fk-org-consequence.model';

export type FkOrgChangeLogDictionary = {
  [key: string]: FkOrgChangeLogModel;
};

export interface FkOrgChangeLogModel {
  origin?: APIStsOrganizationChangeLogOriginOption;
  user?: APIUserReferenceResponseDTO;
  logTime?: string;
  consequences?: Array<FkOrganizationUnit>;
}
