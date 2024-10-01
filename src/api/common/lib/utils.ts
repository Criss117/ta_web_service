import { BadRequestException, Logger } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PRISMACODES } from './constants/prisma-codes';
import { CommonResponse } from '../models/common.response';

export function validateCatchError(error: any): CommonResponse {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    const prismaError = PRISMACODES.ERRORS.find(
      (err) => err.code === error.code,
    );

    if (prismaError) {
      throw new BadRequestException(prismaError.message, {
        cause: prismaError.message,
      });
    }
  }

  if (error.cause) {
    throw new BadRequestException(error.cause, {
      cause: error.cause,
    });
  }
  const logger = new Logger(validateCatchError.name);

  logger.error(error);

  throw new BadRequestException('Something went wrong', {
    cause: 'Something went wrong',
  });
}

export const sleep = (ms = 500) =>
  new Promise((resolve) => setTimeout(resolve, ms));
