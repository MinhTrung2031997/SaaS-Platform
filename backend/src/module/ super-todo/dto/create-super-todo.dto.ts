import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { UserRole } from '../../../common/enum/user-role.enum';

export class CreateSuperTodoDto {
  @ApiProperty({ example: 'Buy milk' })
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty({ example: true })
  @IsNotEmpty()
  @IsBoolean()
  completed: boolean;

  @ApiProperty({ example: 'free' })
  @IsNotEmpty()
  @IsEnum(UserRole)
  userRole: UserRole;

  @ApiProperty({ example: 'oki' })
  @IsOptional()
  @IsString()
  notes: string;

  constructor(partial: Partial<CreateSuperTodoDto>) {
    Object.assign(this, partial);
  }
}
