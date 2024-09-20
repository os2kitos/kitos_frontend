import { IRoleAssignment } from "../models/helpers/read-model-role-assignments";

export function compareByRoleName(a: IRoleAssignment, b: IRoleAssignment): number {
  return a.assignment.role.name.localeCompare(b.assignment.role.name);
}
