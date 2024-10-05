import { UserRole } from '../constants/user-role-type';
import { SetMetadata } from '@nestjs/common';

export const ROLES_KEY = 'role';
export const Role = (role: UserRole) => SetMetadata(ROLES_KEY, role);
