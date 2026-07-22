import { APIOrganizationType } from 'src/app/api/v2';
import { OrganizationTypeEnum } from '../models/organization/organization-odata.model';

export function mapOrganizationType(source: APIOrganizationType | undefined): string | undefined {
  switch (source) {
    case APIOrganizationType.Municipality: {
      return $localize`Kommune`;
    }
    case APIOrganizationType.CommunityOfInterest: {
      return $localize`Interessefællesskab`;
    }
    case APIOrganizationType.Company: {
      return $localize`Virksomhed`;
    }
    case APIOrganizationType.OtherPublicAuthority: {
      return $localize`Anden offentlig myndighed`;
    }
    default:
      return undefined;
  }
}

export function mapOrgTypeToDtoType(type: OrganizationTypeEnum): APIOrganizationType {
  switch (type) {
    case OrganizationTypeEnum.Municipality:
      return APIOrganizationType.Municipality;
    case OrganizationTypeEnum.CommunityOfInterest:
      return APIOrganizationType.CommunityOfInterest;
    case OrganizationTypeEnum.Company:
      return APIOrganizationType.Company;
    case OrganizationTypeEnum.OtherPublicAuthority:
      return APIOrganizationType.OtherPublicAuthority;
  }
}
