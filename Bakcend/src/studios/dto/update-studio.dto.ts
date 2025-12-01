/* eslint-disable @typescript-eslint/no-unsafe-call */
import { PartialType } from '@nestjs/mapped-types';
import { CreateStudioDto } from './create-studio.dto.js';

export class UpdateStudioDto extends PartialType(CreateStudioDto) {}
