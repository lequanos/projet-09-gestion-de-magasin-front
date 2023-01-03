import { ProductDto, ProductDtoPayload } from '@/models/product';
import { RoleDto } from '../../models/role';

export function isRoleDto(role: number | RoleDto): role is RoleDto {
  return role.hasOwnProperty('id');
}

export function isProductDto(
  product?: ProductDto | ProductDtoPayload,
): product is ProductDto {
  return !!product?.hasOwnProperty('isActive');
}
