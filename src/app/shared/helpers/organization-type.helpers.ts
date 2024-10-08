import { APIOrganizationResponseDTO } from 'src/app/api/v2';

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
