import { APIOrganizationResponseDTO } from 'src/app/api/v2';
import { OrganizationTypeEnum } from '../models/organization/organization.model';

export function mapOrganizationType(
  source: APIOrganizationResponseDTO.OrganizationTypeEnum | undefined
): string | undefined {
  switch (source) {
    case APIOrganizationResponseDTO.OrganizationTypeEnum.Municipality: {
      return $localize`Kommune`;
    }
    case APIOrganizationResponseDTO.OrganizationTypeEnum.CommunityOfInterest: {
      return $localize`Interessefællesskab`;
    }
    case APIOrganizationResponseDTO.OrganizationTypeEnum.Company: {
      return $localize`Virksomhed`;
    }
    case APIOrganizationResponseDTO.OrganizationTypeEnum.OtherPublicAuthority: {
      return $localize`Anden offentlig myndighed`;
    }
    default:
      return undefined;
  }
}

export function mapOrgTypeToDtoType(type: OrganizationTypeEnum): APIOrganizationResponseDTO.OrganizationTypeEnum {
  switch (type) {
    case OrganizationTypeEnum.Municipality:
      return APIOrganizationResponseDTO.OrganizationTypeEnum.Municipality;
    case OrganizationTypeEnum.CommunityOfInterest:
      return APIOrganizationResponseDTO.OrganizationTypeEnum.CommunityOfInterest;
    case OrganizationTypeEnum.Company:
      return APIOrganizationResponseDTO.OrganizationTypeEnum.Company;
    case OrganizationTypeEnum.OtherPublicAuthority:
      return APIOrganizationResponseDTO.OrganizationTypeEnum.OtherPublicAuthority;
  }
}
