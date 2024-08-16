// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function mapReadModelRoleAssignments(roleAssignments: any){
  const roles: { [key: string]: string } = {};
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
