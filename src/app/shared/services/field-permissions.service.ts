import { APIFieldPermissionsResponseDTO } from 'src/app/api/v2';

export class FieldPermissionsService {
  static hasPermission(fieldPermissions: APIFieldPermissionsResponseDTO[] | undefined, field: string): boolean {
    if (!fieldPermissions) return false;
    const permission = fieldPermissions.find((p) => p.key?.toLocaleLowerCase() === field.toLocaleLowerCase());
    return permission?.enabled ?? false;
  }
}
