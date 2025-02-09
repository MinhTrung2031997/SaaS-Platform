/* istanbul ignore file */
import { plainToInstance } from 'class-transformer';
import { IsNotEmpty, IsNumber, validateSync } from 'class-validator';

export class EnvironmentVariable {
  @IsNotEmpty()
  @IsNumber()
  PORT: number;
}

export function validate(config: Record<string, unknown>): EnvironmentVariable {
  const validatedConfig = plainToInstance(EnvironmentVariable, config, {
    enableImplicitConversion: true,
  });
  const errors = validateSync(validatedConfig, {
    skipMissingProperties: false,
  });

  if (errors.length > 0) {
    throw new Error(errors.toString());
  }
  return validatedConfig;
}
