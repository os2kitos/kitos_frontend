import { type } from 'cypress/types/jquery';
import {
  APICreateOrganizationUnitRoleAssignmentRequestDTO,
  APIExtendedRoleAssignmentResponseDTO,
  APIOrganizationUnitResponseDTO,
  APIOrganizationUnitRolesResponseDTO,
} from 'src/app/api/v2';

export type RoleAssignmentsMap = {
  [key: string]: string;
};

export type RoleAssignmentEmailsMaps = {
  [key: string]: string;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function mapRoleAssignmentsToUserFullNames(roleAssignments: any): RoleAssignmentsMap {
  const roles: RoleAssignmentsMap = {};
  roleAssignments.forEach((assignment: { RoleId: number; UserFullName: string }) => {
    const roleKey = `Role${assignment.RoleId}`;
    if (!roles[roleKey]) {
      roles[roleKey] = assignment.UserFullName;
    } else {
      roles[roleKey] += `, ${assignment.UserFullName}`;
    }
  });
  return roles;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function mapRoleAssignmentsToEmails(roleAssignments: any): RoleAssignmentEmailsMaps {
  const emailsPerRole: RoleAssignmentEmailsMaps = {};
  roleAssignments.forEach((assignment: { RoleId: number; Email: string }) => {
    const roleKey = `Role${assignment.RoleId}`;
    if (!emailsPerRole[roleKey]) {
      emailsPerRole[roleKey] = assignment.Email;
    } else {
      emailsPerRole[roleKey] += `, ${assignment.Email}`;
    }
  });
  return emailsPerRole;
}

export class RegularRoleAssignment implements IRoleAssignment {
  
  public assignment: APIExtendedRoleAssignmentResponseDTO;

  constructor(assignment: APIExtendedRoleAssignmentResponseDTO) {
    this.assignment = assignment;
  }
}

export class OrganizationUnitRoleAssignment implements IRoleAssignment {

  public assignment: APIExtendedRoleAssignmentResponseDTO;
  public unitName: string;

  constructor(assignment: APIOrganizationUnitRolesResponseDTO) {
    if (!assignment.roleAssignment) throw new Error('Role assignment is missing');
    this.assignment = assignment.roleAssignment;
    this.unitName = assignment.organizationUnitName ?? '';
  }
}

export interface IRoleAssignment {
  assignment: APIExtendedRoleAssignmentResponseDTO;
  unitName?: string;
}

export function mapDTOsToRoleAssignment(
  roleAssignment: APIExtendedRoleAssignmentResponseDTO | APIOrganizationUnitRolesResponseDTO
): IRoleAssignment {
  if (isAPIOrganizationUnitRolesResponseDTO(roleAssignment)) {
    return new OrganizationUnitRoleAssignment(roleAssignment);
  } else {
    return new RegularRoleAssignment(roleAssignment);
  }
}

function isAPIOrganizationUnitRolesResponseDTO(obj: any): obj is APIOrganizationUnitRolesResponseDTO {
  return (
    obj && typeof obj === 'object' && 'roleAssignment' in obj && 'organizationUnitUuid' in obj && 'organizationUnitName'
  );
}
