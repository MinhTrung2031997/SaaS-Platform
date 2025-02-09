import { ValidationPipeOptions } from '@nestjs/common';

export const DefaultValidationOptions: ValidationPipeOptions = {
  whitelist: true,
  transform: true,
  stopAtFirstError: true,
  forbidNonWhitelisted: false,
  forbidUnknownValues: false,
};
