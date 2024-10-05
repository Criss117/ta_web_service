import { Type } from 'class-transformer';
import { IsIn, IsOptional, IsPositive } from 'class-validator';
import { PAGINATION_DTO_MESSAGE } from './pagination.dto.message';

export class PaginationDto {
  @IsOptional()
  @IsPositive({
    message: PAGINATION_DTO_MESSAGE.OFFSET_IS_POSITIVE,
  })
  @Type(() => Number)
  @IsIn([10, 20, 30, 40, 50], {
    message: PAGINATION_DTO_MESSAGE.NOT_IN,
  })
  offSet?: number;

  @IsOptional()
  @Type(() => Number)
  page?: number;

  @IsOptional()
  @Type(() => String)
  query?: string;
}
