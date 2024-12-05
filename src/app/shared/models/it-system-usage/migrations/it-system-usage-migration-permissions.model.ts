import { APICommandPermissionResponseDTO, APIItSystemUsageMigrationPermissionsResponseDTO } from "src/app/api/v2";

export interface ItSystemUsageMigrationPermissions {
  commands: CommandPermission[];
}

export interface CommandPermission {
  id?: string;
  canExecute?: boolean;
}

export function adaptItSystemUsageMigrationPermissions(source: APIItSystemUsageMigrationPermissionsResponseDTO): ItSystemUsageMigrationPermissions {
  return {
    commands: source.commands?.map(adaptCommandPermission) ?? [],
  };
}

function adaptCommandPermission(source: APICommandPermissionResponseDTO): CommandPermission {
  return {
    id: source.id,
    canExecute: source.canExecute,
  };
}
