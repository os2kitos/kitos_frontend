import { APIItSystemUsageMigrationV2ResponseDTO, APIItSystemUsageRelationMigrationV2ResponseDTO } from "src/app/api/v2";
import { IdentityNamePair, IdentityNamePairWithDeactivatedStatus, mapIdentityNamePair, mapIdentityNamePairWithDeactivatedStatus } from "../../identity-name-pair.model";

export interface ItSystemUsageMigration {
  targetUsage?: IdentityNamePairWithDeactivatedStatus;
  fromSystem?: IdentityNamePairWithDeactivatedStatus;
  toSystem?: IdentityNamePairWithDeactivatedStatus;
  affectedContracts?: IdentityNamePair[];
  affectedDataProcessingRegistrations?: IdentityNamePair[];
  affectedRelations?: ItSystemUsageRelationMigration[];

}

export interface ItSystemUsageRelationMigration
{
  toSystem?: IdentityNamePairWithDeactivatedStatus;
  fromSystem?: IdentityNamePairWithDeactivatedStatus;
  description?: string;
  interface?: IdentityNamePair;
  frequencyType?: IdentityNamePair;
  contract?: IdentityNamePair;
}

export function adaptItSystemUsageMigration(source: APIItSystemUsageMigrationV2ResponseDTO): ItSystemUsageMigration{
  return {
    targetUsage: mapIdentityNamePairWithDeactivatedStatus(source.targetUsage),
    fromSystem: mapIdentityNamePairWithDeactivatedStatus(source.fromSystem),
    toSystem: mapIdentityNamePairWithDeactivatedStatus(source.toSystem),
    affectedContracts: source.affectedContracts?.map(mapIdentityNamePair).filter(x => x !== undefined),
    affectedDataProcessingRegistrations: source.affectedDataProcessingRegistrations?.map(mapIdentityNamePair).filter(x => x !== undefined),
    affectedRelations: source.affectedRelations?.map(mapItSystemUsageRelationMigration)
  };
}

function mapItSystemUsageRelationMigration(source: APIItSystemUsageRelationMigrationV2ResponseDTO){
  return {
    toSystem: mapIdentityNamePairWithDeactivatedStatus(source.toSystem),
    fromSystem: mapIdentityNamePairWithDeactivatedStatus(source.fromSystem),
    description: source.description,
    interface: mapIdentityNamePair(source._interface),
    frequencyType: mapIdentityNamePair(source.frequencyType),
    contract: mapIdentityNamePair(source.contract)
  }
}
