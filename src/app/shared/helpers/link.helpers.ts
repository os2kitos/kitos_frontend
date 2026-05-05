import { AppPath } from '../enums/app-path';
import { RegistrationEntityTypes } from '../models/registrations/registration-entity-categories.model';

const validDocumentSharingProtocols = ['kmdsageraabn', 'kmdedhvis', 'sbsyslauncher'];

export function validateHttpUrl(url?: string): boolean {
  if (!url) return false;

  const regexp = /(^https?):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-/])$)?/;
  return regexp.test(url.toLowerCase());
}

export function isUrlEmptyOrValid(url?: string): boolean {
  return !url || validateHttpUrl(url);
}

export function isExternalReferenceUrlEmptyOrValid(url?: string): boolean {
  return !url || validateExternalReferenceUrl(url);
}

export function validateExternalReferenceUrl(externalRef?: string): boolean {
  if (!externalRef) return false;

  if (validateHttpUrl(externalRef)) {
    return true;
  } else {
    const regexp = new RegExp(`^(${validDocumentSharingProtocols.join('|')}):.*`);
    return regexp.test(externalRef.toLowerCase());
  }
}

export function getDetailsPageLink(
  itemUuid?: string,
  itemType?: RegistrationEntityTypes,
  subpagePath?: string,
  itemPathIncludesSubmodule?: boolean,
): string | undefined {
  const isValid = itemUuid != undefined && itemType != undefined;
  if (isValid) {
    switch (itemType) {
      case 'data-processing-registration':
        return getDetailsPagePath(AppPath.dataProcessing, itemUuid, subpagePath);
      case 'it-contract':
        return getDetailsPagePath(AppPath.itContracts, itemUuid, subpagePath);
      case 'it-interface':
        return getDetailsPagePathWithSubmodule(
          `${AppPath.itSystems}/${AppPath.itInterfaces}`,
          itemUuid,
          subpagePath,
          itemPathIncludesSubmodule,
        );
      case 'it-system':
        return getDetailsPagePathWithSubmodule(
          `${AppPath.itSystems}/${AppPath.itSystemCatalog}`,
          itemUuid,
          subpagePath,
          itemPathIncludesSubmodule,
        );
      case 'it-system-usage':
        return getDetailsPagePathWithSubmodule(
          `${AppPath.itSystems}/${AppPath.itSystemUsages}`,
          itemUuid,
          subpagePath,
          itemPathIncludesSubmodule,
        );
      case 'organization':
        return getDetailsPagePathWithSubmodule(
          `${AppPath.organization}/${AppPath.structure}`,
          itemUuid,
          subpagePath,
          itemPathIncludesSubmodule,
        );
      case 'organization-unit':
        return getDetailsPagePath(`${AppPath.organization}/${AppPath.structure}`, itemUuid);
      default:
        console.error('Unmapped link itemType', itemType);
        return undefined;
    }
  } else {
    console.error('Details page link incorrectly configured. Got (uuid,type)', itemUuid, itemType);
    return undefined;
  }
}

function getDetailsPagePath(resourceUrlSegment: string, itemUuid: string, subpagePath?: string) {
  let path = `/${resourceUrlSegment}/${itemUuid}`;
  if (subpagePath) {
    path += `/${subpagePath}`;
  }
  return path;
}

function getDetailsPagePathWithSubmodule(
  resourceUrlSegment: string,
  itemUuid: string,
  subpagePath?: string,
  itemPathIncludesSubmodule?: boolean,
) {
  if (itemPathIncludesSubmodule) {
    const segmentWithoutSubmodule = resourceUrlSegment.split('/')[0];
    return getDetailsPagePath(segmentWithoutSubmodule, itemUuid, subpagePath);
  }
  return getDetailsPagePath(resourceUrlSegment, itemUuid, subpagePath);
}
