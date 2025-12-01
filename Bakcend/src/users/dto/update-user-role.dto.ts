/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { IsEnum } from 'class-validator';
import { Role } from '../../../generated/client/client.js';

export class UpdateUserRoleDto {
  @IsEnum(Role)
  role: Role;
}
