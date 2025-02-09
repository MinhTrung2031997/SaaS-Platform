import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdateSuperTodoDto {
  @ApiProperty({ example: 'Buy milk' })
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty({ example: true })
  @IsNotEmpty()
  @IsBoolean()
  completed: boolean;

  @ApiProperty({ example: 'oki' })
  @IsOptional()
  @IsString()
  notes: string;

  constructor(partial: Partial<UpdateSuperTodoDto>) {
    Object.assign(this, partial);
  }
}
