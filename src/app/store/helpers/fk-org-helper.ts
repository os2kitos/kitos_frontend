import { APIStsOrganizationChangeLogResponseDTO } from 'src/app/api/v2';
import { FkOrgChangeLogModel } from 'src/app/shared/models/local-admin/fk-org-change-log.dictionary';

export function getResponsibleEntityTextBasedOnOrigin(
  changelog: APIStsOrganizationChangeLogResponseDTO | FkOrgChangeLogModel
): string {
  return changelog.origin === APIStsOrganizationChangeLogResponseDTO.OriginEnum.Background
    ? $localize`Fk Organisation`
    : `${changelog.user?.name} (${changelog.user?.email})`;
}
