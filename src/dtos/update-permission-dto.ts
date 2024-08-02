import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsString } from 'class-validator';

export class UpdatePermissionDto {
  @ApiProperty()
  @IsBoolean()
  permission: boolean;

  @ApiProperty()
  @IsString()
  action: string;

  @ApiProperty()
  @IsString()
  model: string;
}
