import { RoleDto } from '../../models/role';

export function isRoleDto(role: number | RoleDto): role is RoleDto {
  return role.hasOwnProperty('id');
}
