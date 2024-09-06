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
