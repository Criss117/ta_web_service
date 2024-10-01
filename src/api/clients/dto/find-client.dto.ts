import { IsBoolean, IsOptional, IsString, MaxLength } from 'class-validator';
import { FIND_ONE_CLIENT_DTO_MESSAGE } from './client.dto.message';

export class FindOneClientDto {
  @IsString({
    message: FIND_ONE_CLIENT_DTO_MESSAGE.REQUIRED,
  })
  @MaxLength(16, {
    message: FIND_ONE_CLIENT_DTO_MESSAGE.MAX_LENGTH,
  })
  ccNumber: string;

  @IsBoolean()
  @IsOptional()
  obtainTickets?: boolean;
}
